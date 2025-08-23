package com.campusmate.controller;

import com.campusmate.dto.request.LoginRequest;
import com.campusmate.dto.request.RegisterRequest;
import com.campusmate.dto.response.ApiResponse;
import com.campusmate.dto.response.AuthResponse;
import com.campusmate.entity.User;
import com.campusmate.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.validation.Valid;
import java.util.Optional;

/**
 * Authentication controller for user login and registration
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login attempt for user: {}", request.getEmail());
        
        try {
            // Find user by email
            Optional<User> userOpt = userService.findByEmail(request.getEmail());
            if (userOpt.isEmpty()) {
                log.warn("Login failed: User not found with email: {}", request.getEmail());
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid email or password"));
            }
            
            User user = userOpt.get();
            
            // Verify password
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                log.warn("Login failed: Invalid password for user: {}", request.getEmail());
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid email or password"));
            }
            
            // Check if user is active
            if (!user.getIsActive()) {
                log.warn("Login failed: Inactive user: {}", request.getEmail());
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Account is deactivated"));
            }
            
            // Create auth response (for now, return mock tokens)
            // TODO: Implement actual JWT token generation
            AuthResponse authResponse = new AuthResponse(
                    "mock-jwt-token-" + user.getId(),
                    "mock-refresh-token-" + user.getId(),
                    "Bearer", 
                    86400000L
            );
            
            log.info("User logged in successfully: {}", user.getEmail());
            return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
            
        } catch (Exception e) {
            log.error("Login failed for user: {}", request.getEmail(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration attempt for user: {}", request.getEmail());
        
        try {
            // Register the user
            User registeredUser = userService.registerUser(request);
            
            // Create auth response (for now, return mock tokens)
            // TODO: Implement actual JWT token generation
            AuthResponse authResponse = new AuthResponse(
                    "mock-jwt-token-" + registeredUser.getId(),
                    "mock-refresh-token-" + registeredUser.getId(),
                    "Bearer", 
                    86400000L
            );
            
            log.info("User registered successfully: {}", registeredUser.getEmail());
            return ResponseEntity.ok(ApiResponse.success("Registration successful", authResponse));
            
        } catch (Exception e) {
            log.error("Registration failed for user: {}", request.getEmail(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.success("Auth service is running"));
    }
}
