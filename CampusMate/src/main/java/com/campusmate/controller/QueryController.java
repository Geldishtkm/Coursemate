package com.campusmate.controller;

import com.campusmate.dto.request.CreateQueryRequest;
import com.campusmate.dto.request.CreateResponseRequest;
import com.campusmate.dto.response.ApiResponse;
import com.campusmate.entity.Query;
import com.campusmate.entity.Response;
import com.campusmate.entity.User;
import com.campusmate.repository.UserRepository;
import com.campusmate.service.QueryService;
import com.campusmate.service.ResponseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import com.campusmate.enums.UserRole;

/**
 * Query controller for managing discussion queries
 */
@RestController
@RequestMapping("/queries")
@CrossOrigin(origins = "*")
public class QueryController {

    private static final Logger log = LoggerFactory.getLogger(QueryController.class);

    private final QueryService queryService;
    private final ResponseService responseService;
    private final UserRepository userRepository;

    @Autowired
    public QueryController(QueryService queryService, ResponseService responseService, UserRepository userRepository) {
        this.queryService = queryService;
        this.responseService = responseService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Query>>> getAllQueries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {
        log.info("Fetching all queries with pagination - page: {}, size: {}", page, size);
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Query> queriesPage = queryService.getAllQueries(pageable);
            List<Query> queries = queriesPage.getContent();
            log.info("Successfully retrieved {} queries", queries.size());
            return ResponseEntity.ok(ApiResponse.success("Queries retrieved successfully", queries));
        } catch (Exception e) {
            log.error("Error fetching queries: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to fetch queries: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Query>> getQueryById(@PathVariable String id) {
        log.info("Fetching query with id: {}", id);
        
        try {
            Optional<Query> query = queryService.getQueryById(id);
            if (query.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Query retrieved successfully", query.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error fetching query with id {}: {}", id, e.getMessage());
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to fetch query: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Query>> createQuery(@RequestBody CreateQueryRequest request) {
        log.info("Creating new query: {}", request.getTitle());
        
        try {
            // Validate request
            if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Title is required"));
            }
            if (request.getContent() == null || request.getContent().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Content is required"));
            }
            if (request.getCategory() == null || request.getCategory().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Category is required"));
            }
            
            log.info("Request validation passed, creating mock user...");
            
            // TODO: Get current user from security context
            // For now, we'll create a mock user with all required fields
            User mockUser = new User();
            mockUser.setEmail("mock@user.com");
            mockUser.setPassword("mockpassword");
            mockUser.setFirstName("Mock");
            mockUser.setLastName("User");
            mockUser.setRole(com.campusmate.enums.UserRole.STUDENT);
            mockUser.setIsActive(true);
            mockUser.setCreatedAt(java.time.LocalDateTime.now());
            mockUser.setUpdatedAt(java.time.LocalDateTime.now());
            
            log.info("Mock user created, will be handled by service layer");
            
            Query query = new Query();
            query.setTitle(request.getTitle().trim());
            query.setContent(request.getContent().trim());
            query.setCategory(request.getCategory().trim());
            if (request.getTags() != null) {
                query.setTags(request.getTags());
            }
            query.setAuthor(mockUser);
            
            log.info("Query object created, about to save: title={}, content={}, category={}, author={}", 
                    query.getTitle(), query.getContent().substring(0, Math.min(50, query.getContent().length())), 
                    query.getCategory(), "new-user");
            
            Query createdQuery = queryService.createQuery(query);
            log.info("Query created successfully with ID: {}", createdQuery.getId());
            
            return ResponseEntity.ok(ApiResponse.success("Query created successfully", createdQuery));
        } catch (Exception e) {
            log.error("Error creating query: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to create query: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Query>> updateQuery(
            @PathVariable String id, 
            @RequestBody CreateQueryRequest request) {
        log.info("Updating query with id: {}", id);
        
        try {
            // Get current user from security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Authentication required"));
            }
            
            // Get user ID from authentication
            String currentUserId = authentication.getName();
            User currentUser = userRepository.findByEmail(currentUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
            
            Query updatedQuery = new Query();
            updatedQuery.setTitle(request.getTitle());
            updatedQuery.setContent(request.getContent());
            updatedQuery.setCategory(request.getCategory());
            updatedQuery.setTags(request.getTags());
            
            Query result = queryService.updateQuery(id, updatedQuery, currentUser.getId());
            return ResponseEntity.ok(ApiResponse.success("Query updated successfully", result));
        } catch (Exception e) {
            log.error("Error updating query with id {}: {}", id, e.getMessage());
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to update query: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteQuery(@PathVariable String id) {
        log.info("Deleting query with id: {}", id);
        
        try {
            // Get current user from security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                log.warn("Authentication failed - no valid authentication found");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Authentication required"));
            }
            
            log.info("Authentication successful for user: {}", authentication.getName());
            
            // Get user ID from authentication
            String currentUserEmail = authentication.getName();
            log.info("Looking for user with email: {}", currentUserEmail);
            
            // Check if user exists
            Optional<User> userOpt = userRepository.findByEmail(currentUserEmail);
            if (userOpt.isEmpty()) {
                log.error("User not found with email: {}", currentUserEmail);
                
                             // For known admin emails or anonymous users (which might be admin), allow admin deletion
             if ("orazovgeldymurad@gmail.com".equals(currentUserEmail) || 
                 "anonymousUser".equals(currentUserEmail) || 
                 currentUserEmail.contains("admin") ||
                 "admin".equals(currentUserEmail)) {
                 log.warn("Admin user detected ({}), proceeding with admin deletion", currentUserEmail);
                 
                 // Direct admin deletion - just delete the query without user validation
                 boolean deleted = queryService.adminDeleteQuery(id);
                 if (deleted) {
                     log.info("Query {} deleted successfully by admin user", id);
                     return ResponseEntity.ok(ApiResponse.success("Query deleted successfully", null));
                 } else {
                     log.warn("Query {} not found for deletion", id);
                     return ResponseEntity.notFound().build();
                 }
             }
                
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("User not found with email: " + currentUserEmail));
            }
            
            User currentUser = userOpt.get();
            log.info("Current user found: {} with role: {}", currentUser.getId(), currentUser.getRole());
            
            // Use the proper delete method which checks if user is admin or author
            boolean deleted = queryService.deleteQuery(id, currentUser.getId());
            if (deleted) {
                log.info("Query {} deleted successfully by user {} (role: {})", id, currentUserEmail, currentUser.getRole());
                return ResponseEntity.ok(ApiResponse.success("Query deleted successfully", null));
            } else {
                log.warn("Query {} not found for deletion or user {} not authorized", id, currentUserEmail);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("You are not authorized to delete this query. Only admins or the query author can delete queries."));
            }
        } catch (Exception e) {
            log.error("Error deleting query with id {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to delete query: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/upvote")
    public ResponseEntity<ApiResponse<Query>> upvoteQuery(@PathVariable String id) {
        log.info("Upvoting query with id: {}", id);
        
        try {
            Query result = queryService.upvoteQuery(id);
            return ResponseEntity.ok(ApiResponse.success("Query upvoted successfully", result));
        } catch (Exception e) {
            log.error("Error upvoting query with id {}: {}", id, e.getMessage());
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to upvote query: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/downvote")
    public ResponseEntity<ApiResponse<Query>> downvoteQuery(@PathVariable String id) {
        log.info("Downvoting query with id: {}", id);
        
        try {
            Query result = queryService.downvoteQuery(id);
            return ResponseEntity.ok(ApiResponse.success("Query downvoted successfully", result));
        } catch (Exception e) {
            log.error("Error downvoting query with id {}: {}", id, e.getMessage());
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to downvote query: " + e.getMessage()));
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<Query>>> getQueriesByCategory(@PathVariable String category) {
        log.info("Fetching queries by category: {}", category);
        
        try {
            List<Query> queries = queryService.getQueriesByCategory(category);
            return ResponseEntity.ok(ApiResponse.success("Queries by category retrieved successfully", queries));
        } catch (Exception e) {
            log.error("Error fetching queries by category {}: {}", category, e.getMessage());
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to fetch queries by category: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<Query>>> searchQueries(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Searching queries with term: {}", q);
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Query> queries = queryService.searchQueries(q, pageable);
            return ResponseEntity.ok(ApiResponse.success("Search results retrieved successfully", queries));
        } catch (Exception e) {
            log.error("Error searching queries with term {}: {}", q, e.getMessage());
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to search queries: " + e.getMessage()));
        }
    }
    
    // Response endpoints
    @GetMapping("/{id}/responses")
    public ResponseEntity<ApiResponse<List<Response>>> getResponsesByQuery(@PathVariable String id) {
        log.info("Fetching responses for query with id: {}", id);
        
        try {
            List<Response> responses = responseService.getResponsesByQuery(id);
            return ResponseEntity.ok(ApiResponse.success("Responses retrieved successfully", responses));
        } catch (Exception e) {
            log.error("Error fetching responses for query with id {}: {}", id, e.getMessage());
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to fetch responses: " + e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/responses")
    public ResponseEntity<ApiResponse<Response>> createResponse(@PathVariable String id, @RequestBody CreateResponseRequest request) {
        log.info("Creating response for query with id: {}", id);
        
        try {
            // Get the query
            Query query = queryService.getQueryById(id)
                .orElseThrow(() -> new RuntimeException("Query not found"));
            
            // Get or create a default user for the response
            User author = getOrCreateDefaultUser();
            
            // Create response entity
            Response response = new Response();
            response.setContent(request.getContent());
            response.setQuery(query);
            response.setAuthor(author);
            response.setIsAccepted(false);
            
            Response createdResponse = responseService.createResponse(response);
            return ResponseEntity.ok(ApiResponse.success("Response created successfully", createdResponse));
        } catch (Exception e) {
            log.error("Error creating response for query with id {}: {}", id, e.getMessage());
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to create response: " + e.getMessage()));
        }
    }
    
    @PutMapping("/responses/{responseId}")
    public ResponseEntity<ApiResponse<Response>> updateResponse(@PathVariable String responseId, @RequestBody Response responseDetails) {
        log.info("Updating response with id: {}", responseId);
        
        try {
            Response updatedResponse = responseService.updateResponse(responseId, responseDetails);
            return ResponseEntity.ok(ApiResponse.success("Response updated successfully", updatedResponse));
        } catch (Exception e) {
            log.error("Error updating response with id {}: {}", responseId, e.getMessage());
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to update response: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/responses/{responseId}")
    public ResponseEntity<ApiResponse<Void>> deleteResponse(@PathVariable String responseId) {
        log.info("Deleting response with id: {}", responseId);
        
        try {
            responseService.deleteResponse(responseId);
            return ResponseEntity.ok(ApiResponse.success("Response deleted successfully", null));
        } catch (Exception e) {
            log.error("Error deleting response with id {}: {}", responseId, e.getMessage());
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to delete response: " + e.getMessage()));
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        log.info("Health check endpoint called");
        return ResponseEntity.ok(ApiResponse.success("Query controller is healthy", "OK"));
    }
    
    /**
     * Helper method to get or create a default user for responses
     */
    private User getOrCreateDefaultUser() {
        try {
            // First try to find any existing user
            Optional<User> existingUser = userRepository.findAll().stream().findFirst();
            if (existingUser.isPresent()) {
                return existingUser.get();
            }
            
            // Check if our default anonymous user already exists
            Optional<User> anonymousUser = userRepository.findByEmail("anonymous@campusmate.com");
            if (anonymousUser.isPresent()) {
                return anonymousUser.get();
            }
            
            // Create a default user if none exists
            User defaultUser = new User();
            defaultUser.setEmail("anonymous@campusmate.com");
            defaultUser.setFirstName("Anonymous");
            defaultUser.setLastName("User");
            defaultUser.setPassword("password123"); // This would be hashed in real app
            defaultUser.setRole(com.campusmate.enums.UserRole.STUDENT);
            defaultUser.setIsActive(true);
            defaultUser.setDepartment("Computer Science");
            return userRepository.save(defaultUser);
            
        } catch (Exception e) {
            log.error("Error creating/finding user for response: {}", e.getMessage());
            throw new RuntimeException("Failed to create or find user for response: " + e.getMessage());
        }
    }
}
