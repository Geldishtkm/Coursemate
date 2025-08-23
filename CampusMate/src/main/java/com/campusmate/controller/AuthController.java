package com.campusmate.controller;

import com.campusmate.dto.request.LoginRequest;
import com.campusmate.dto.request.RegisterRequest;
import com.campusmate.dto.response.ApiResponse;
import com.campusmate.dto.response.AuthResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/**
 * Authentication controller for user login and registration
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login attempt for user: {}", request.getEmail());
        
        // TODO: Implement actual authentication logic
        // For now, return a mock response
        AuthResponse mockResponse = new AuthResponse(
                "mock-jwt-token",
                "mock-refresh-token", 
                "Bearer",
                86400000L
        );
        
        return ResponseEntity.ok(ApiResponse.success("Login successful", mockResponse));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration attempt for user: {}", request.getEmail());
        
        // TODO: Implement actual registration logic
        // For now, return a mock response
        AuthResponse mockResponse = new AuthResponse(
                "mock-jwt-token",
                "mock-refresh-token",
                "Bearer", 
                86400000L
        );
        
        return ResponseEntity.ok(ApiResponse.success("Registration successful", mockResponse));
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.success("Auth service is running"));
    }
}
