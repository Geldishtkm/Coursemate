package com.campusmate.controller;

import com.campusmate.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Root controller for handling the base endpoint
 */
@RestController
@CrossOrigin(origins = "*")
public class RootController {

    @GetMapping("/")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRoot() {
        Map<String, Object> apiInfo = new HashMap<>();
        apiInfo.put("name", "CampusMate Backend API");
        apiInfo.put("version", "1.0.0");
        apiInfo.put("status", "running");
        apiInfo.put("endpoints", Map.of(
            "auth", "/auth",
            "courses", "/courses", 
            "users", "/users",
            "projects", "/projects",
            "subjects", "/subjects",
            "queries", "/queries"
        ));
        
        return ResponseEntity.ok(ApiResponse.success("CampusMate API is running", apiInfo));
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> getHealth() {
        return ResponseEntity.ok(ApiResponse.success("Service is healthy"));
    }
}
