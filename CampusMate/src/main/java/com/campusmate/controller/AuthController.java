package com.campusmate.controller;

import com.campusmate.dto.request.LoginRequest;
import com.campusmate.dto.request.RegisterRequest;
import com.campusmate.dto.response.ApiResponse;
import com.campusmate.dto.response.AuthResponse;
import com.campusmate.entity.User;
import com.campusmate.service.UserService;
import com.campusmate.service.JwtService;
import com.campusmate.service.EmailVerificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import jakarta.validation.Valid;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

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
    
    @Autowired
    private JwtService jwtService;

    @Autowired
    private EmailVerificationService emailVerificationService;

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
            
            // Check if user is verified
            if (!user.getIsVerified()) {
                log.warn("Login failed: Unverified user: {}", request.getEmail());
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Please verify your email before logging in. Check your inbox for the verification link."));
            }
            
            // Generate real JWT tokens
            String accessToken = jwtService.generateToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);
            
            // Create auth response with real tokens and user info
            AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                    user.getId(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getRole(),
                    user.getStudentId(),
                    user.getDepartment(),
                    null // avatarUrl
            );
            
            AuthResponse authResponse = new AuthResponse(
                    accessToken,
                    refreshToken,
                    "Bearer", 
                    86400000L,
                    userInfo
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
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request, BindingResult bindingResult) {
        log.info("Registration attempt for user: {}", request.getEmail());
        
        // Check for validation errors
        if (bindingResult.hasErrors()) {
            List<String> errorMessages = bindingResult.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .collect(Collectors.toList());
            
            String combinedErrors = String.join(", ", errorMessages);
            log.warn("Registration validation failed for user: {} - Errors: {}", request.getEmail(), combinedErrors);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Validation failed: " + combinedErrors));
        }
        
        try {
            // Register the user
            User registeredUser = userService.registerUser(request);
            
            // Generate real JWT tokens
            String accessToken = jwtService.generateToken(registeredUser);
            String refreshToken = jwtService.generateRefreshToken(registeredUser);
            
            // Create auth response with real tokens and user info
            AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                    registeredUser.getId(),
                    registeredUser.getEmail(),
                    registeredUser.getFirstName(),
                    registeredUser.getLastName(),
                    registeredUser.getRole(),
                    registeredUser.getStudentId(),
                    registeredUser.getDepartment(),
                    null // avatarUrl
            );
            
            AuthResponse authResponse = new AuthResponse(
                    accessToken,
                    refreshToken,
                    "Bearer", 
                    86400000L,
                    userInfo
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

    @GetMapping("/health/email")
    public ResponseEntity<ApiResponse<String>> emailHealth() {
        try {
            boolean emailConfigured = emailVerificationService.isEmailServiceConfigured();
            if (emailConfigured) {
                return ResponseEntity.ok(ApiResponse.success("Email service is properly configured"));
            } else {
                return ResponseEntity.status(503)
                        .body(ApiResponse.error("Email service not configured. Registration will fail."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(503)
                    .body(ApiResponse.error("Email service health check failed: " + e.getMessage()));
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@RequestParam String token) {
        log.info("Email verification attempt with token: {}", token);
        
        try {
            boolean verified = emailVerificationService.verifyEmailToken(token);
            
            if (verified) {
                log.info("Email verified successfully with token: {}", token);
                return ResponseEntity.ok(ApiResponse.success("Email verified successfully! You can now log in."));
            } else {
                log.warn("Email verification failed with token: {}", token);
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid or expired verification token"));
            }
            
        } catch (Exception e) {
            log.error("Email verification failed with token: {}", token, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Email verification failed: " + e.getMessage()));
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<String>> resendVerificationEmail(@RequestParam String email) {
        log.info("Resend verification email request for: {}", email);
        
        try {
            Optional<User> userOpt = userService.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("User not found with this email"));
            }
            
            User user = userOpt.get();
            
            if (user.getIsVerified()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("User is already verified"));
            }
            
            emailVerificationService.resendVerificationEmail(user);
            
            log.info("Verification email resent to: {}", email);
            return ResponseEntity.ok(ApiResponse.success("Verification email sent successfully"));
            
        } catch (Exception e) {
            log.error("Failed to resend verification email to: {}", email, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to resend verification email: " + e.getMessage()));
        }
    }

    @GetMapping("/check-verification")
    public ResponseEntity<ApiResponse<Boolean>> checkVerificationStatus(@RequestParam String email) {
        log.info("Checking verification status for: {}", email);
        
        try {
            Optional<User> userOpt = userService.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("User not found with this email"));
            }
            
            User user = userOpt.get();
            boolean isVerified = user.getIsVerified();
            
            log.info("Verification status for {}: {}", email, isVerified);
            return ResponseEntity.ok(ApiResponse.success("Verification status retrieved", isVerified));
            
        } catch (Exception e) {
            log.error("Failed to check verification status for: {}", email, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to check verification status: " + e.getMessage()));
        }
    }
}
