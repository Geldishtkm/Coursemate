package com.campusmate.controller;

import com.campusmate.dto.response.ApiResponse;
import com.campusmate.entity.User;
import com.campusmate.enums.UserRole;
import com.campusmate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/create-admin")
    public ResponseEntity<ApiResponse<User>> createAdmin() {
        try {
            // Check if admin already exists
            if (userRepository.findByEmail("orazovgeldymurad@gmail.com").isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Admin user already exists", 
                    userRepository.findByEmail("orazovgeldymurad@gmail.com").get()));
            }
            
            // Create admin user
            User admin = new User();
            admin.setId(UUID.randomUUID().toString());
            admin.setEmail("orazovgeldymurad@gmail.com");
            admin.setPassword(passwordEncoder.encode("newpassword2005cs"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole(UserRole.ADMIN);
            admin.setStudentId("ADMIN001");
            admin.setDepartment("System Administration");
            admin.setIsActive(true);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());
            
            User savedAdmin = userRepository.save(admin);
            return ResponseEntity.ok(ApiResponse.success("Admin user created successfully", savedAdmin));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to create admin user: " + e.getMessage()));
        }
    }

    @GetMapping("/check-admin")
    public ResponseEntity<ApiResponse<String>> checkAdmin() {
        try {
            if (userRepository.findByEmail("orazovgeldymurad@gmail.com").isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Admin user exists", "Admin user found"));
            } else {
                return ResponseEntity.ok(ApiResponse.success("Admin user not found", "No admin user exists"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error checking admin user: " + e.getMessage()));
        }
    }

    @GetMapping("/hash-password")
    public ResponseEntity<ApiResponse<String>> hashPassword(@RequestParam String password) {
        try {
            String hashedPassword = passwordEncoder.encode(password);
            return ResponseEntity.ok(ApiResponse.success("Password hashed successfully", hashedPassword));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to hash password: " + e.getMessage()));
        }
    }

    @PostMapping("/create-admin-direct")
    public ResponseEntity<ApiResponse<User>> createAdminDirect() {
        try {
            // Delete existing admin if exists
            userRepository.findByEmail("orazovgeldymurad@gmail.com").ifPresent(userRepository::delete);
            
            // Create admin user with correct password
            User admin = new User();
            admin.setId(UUID.randomUUID().toString());
            admin.setEmail("orazovgeldymurad@gmail.com");
            admin.setPassword(passwordEncoder.encode("cs2023geldi05"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole(UserRole.ADMIN);
            admin.setStudentId("ADMIN001");
            admin.setDepartment("System Administration");
            admin.setIsActive(true);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());
            
            User savedAdmin = userRepository.save(admin);
            return ResponseEntity.ok(ApiResponse.success("Admin user created successfully", savedAdmin));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to create admin user: " + e.getMessage()));
        }
    }

    @GetMapping("/debug-admin")
    public ResponseEntity<ApiResponse<String>> debugAdmin() {
        try {
            User admin = userRepository.findByEmail("orazovgeldymurad@gmail.com").orElse(null);
            if (admin == null) {
                return ResponseEntity.ok(ApiResponse.success("No admin found", "Admin user does not exist"));
            }
            
            // Test password verification
            String testPassword = "cs2023geldi05";
            boolean passwordMatches = passwordEncoder.matches(testPassword, admin.getPassword());
            
            String debugInfo = String.format(
                "Admin found - ID: %s, Email: %s, Role: %s, Active: %s, Password matches '%s': %s", 
                admin.getId(), 
                admin.getEmail(), 
                admin.getRole(), 
                admin.getIsActive(),
                testPassword,
                passwordMatches
            );
            
            return ResponseEntity.ok(ApiResponse.success("Admin debug info", debugInfo));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Debug failed: " + e.getMessage()));
        }
    }

    @PostMapping("/recreate-admin")
    public ResponseEntity<ApiResponse<String>> recreateAdmin() {
        try {
            // Delete any existing user with this email
            userRepository.findByEmail("orazovgeldymurad@gmail.com").ifPresent(userRepository::delete);
            
            // Create fresh admin user using UserService approach
            User admin = new User();
            admin.setEmail("orazovgeldymurad@gmail.com");
            admin.setPassword(passwordEncoder.encode("cs2023geldi05"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole(UserRole.ADMIN);
            admin.setStudentId("ADMIN001");
            admin.setDepartment("System Administration");
            admin.setIsActive(true);
            
            User saved = userRepository.save(admin);
            
            // Test the password immediately
            boolean testMatch = passwordEncoder.matches("cs2023geldi05", saved.getPassword());
            
            return ResponseEntity.ok(ApiResponse.success("Admin recreated successfully", 
                "Admin ID: " + saved.getId() + ", Password test: " + testMatch));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to recreate admin: " + e.getMessage()));
        }
    }
}
