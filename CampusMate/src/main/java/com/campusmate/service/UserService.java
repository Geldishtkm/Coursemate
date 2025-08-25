package com.campusmate.service;

import com.campusmate.dto.request.RegisterRequest;
import com.campusmate.entity.User;
import com.campusmate.enums.UserRole;
import com.campusmate.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Service for user management operations
 */
@Service
@Transactional
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailVerificationService emailVerificationService;

    /**
     * Register a new user
     */
    public User registerUser(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());

        // Check if email service is configured
        if (!emailVerificationService.isEmailServiceConfigured()) {
            throw new RuntimeException("Registration service temporarily unavailable. Please contact administrator.");
        }

        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with this email already exists");
        }

        if (request.getStudentId() != null && userRepository.existsByStudentId(request.getStudentId())) {
            throw new RuntimeException("User with this student ID already exists");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(request.getRole() != null ? request.getRole() : UserRole.STUDENT);
        user.setStudentId(request.getStudentId());
        user.setDepartment(request.getDepartment());
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getId());
        
        // Generate and send verification email (MANDATORY)
        try {
            String token = emailVerificationService.generateVerificationToken(savedUser);
            emailVerificationService.resendVerificationEmail(savedUser);
            log.info("Verification email sent to user: {}", savedUser.getEmail());
        } catch (Exception e) {
            log.error("Failed to send verification email to user: {}", savedUser.getEmail(), e);
            // Email verification is mandatory - if it fails, we need to clean up the user
            userRepository.delete(savedUser);
            throw new RuntimeException("Registration failed: Could not send verification email. Please check your email configuration: " + e.getMessage());
        }
        
        return savedUser;
    }

    /**
     * Find user by email
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Find user by ID
     */
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    /**
     * Check if user exists by email
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Check if user exists by student ID
     */
    public boolean existsByStudentId(String studentId) {
        return userRepository.existsByStudentId(studentId);
    }
}
