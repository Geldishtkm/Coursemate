package com.campusmate.service;

import com.campusmate.entity.Query;
import com.campusmate.entity.User;
import com.campusmate.enums.QueryStatus;
import com.campusmate.enums.UserRole;
import com.campusmate.repository.QueryRepository;
import com.campusmate.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class QueryService {

    private static final Logger log = LoggerFactory.getLogger(QueryService.class);

    private final QueryRepository queryRepository;
    private final UserRepository userRepository;

    @Autowired
    public QueryService(QueryRepository queryRepository, UserRepository userRepository) {
        this.queryRepository = queryRepository;
        this.userRepository = userRepository;
    }

    // Create a new query
    public Query createQuery(Query query) {
        log.info("Creating new query: {}", query.getTitle());
        
        // Ensure the author exists (create mock user if needed)
        if (query.getAuthor() != null && query.getAuthor().getId() == null) {
            User mockUser = getOrCreateMockUser();
            query.setAuthor(mockUser);
        }
        
        // Set default values (don't set timestamps - let JPA auditing handle them)
        query.setStatus(QueryStatus.OPEN);
        query.setUpvotes(0);
        query.setDownvotes(0);
        query.setResponseCount(0);
        query.setIsSolved(false);
        
        return queryRepository.save(query);
    }
    
    /**
     * Get or create a mock user for development/testing
     */
    private User getOrCreateMockUser() {
        log.info("Getting or creating mock user");
        
        // Try to find existing mock user by email
        Optional<User> existingUser = userRepository.findByEmail("mock@user.com");
        if (existingUser.isPresent()) {
            log.info("Mock user found: {}", existingUser.get().getId());
            return existingUser.get();
        }
        
        // Create new mock user - let Hibernate generate the ID
        User mockUser = new User();
        mockUser.setEmail("mock@user.com");
        mockUser.setPassword("mockpassword");
        mockUser.setFirstName("Mock");
        mockUser.setLastName("User");
        mockUser.setRole(UserRole.STUDENT);
        mockUser.setIsActive(true);
        mockUser.setCreatedAt(java.time.LocalDateTime.now());
        mockUser.setUpdatedAt(java.time.LocalDateTime.now());
        
        User savedUser = userRepository.save(mockUser);
        log.info("Mock user created and saved: {}", savedUser.getId());
        return savedUser;
    }

    // Get all queries with pagination
    public Page<Query> getAllQueries(Pageable pageable) {
        log.info("Fetching all queries with pagination");
        return queryRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    // Get query by ID
    public Optional<Query> getQueryById(String id) {
        log.info("Fetching query with id: {}", id);
        return queryRepository.findById(id);
    }

    // Get queries by author
    public List<Query> getQueriesByAuthor(User author) {
        log.info("Fetching queries by author: {}", author.getId());
        return queryRepository.findByAuthorOrderByCreatedAtDesc(author);
    }

    // Get queries by category
    public List<Query> getQueriesByCategory(String category) {
        log.info("Fetching queries by category: {}", category);
        return queryRepository.findByCategoryOrderByCreatedAtDesc(category);
    }

    // Get queries by status
    public List<Query> getQueriesByStatus(String status) {
        log.info("Fetching queries by status: {}", status);
        return queryRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    // Update query
    public Query updateQuery(String id, Query updatedQuery, String currentUserId) {
        log.info("Updating query with id: {}", id);
        
        Optional<Query> existingQuery = queryRepository.findById(id);
        if (existingQuery.isEmpty()) {
            throw new RuntimeException("Query not found with id: " + id);
        }
        
        Query query = existingQuery.get();
        
        // Get current user to check role
        User currentUser = userRepository.findById(currentUserId)
            .orElseThrow(() -> new RuntimeException("Current user not found"));
        
        // Check if user is the author or admin
        boolean isAuthor = query.getAuthor().getId().equals(currentUserId);
        boolean isAdmin = currentUser.getRole() == UserRole.ADMIN;
        
        if (!isAuthor && !isAdmin) {
            throw new RuntimeException("Unauthorized: Only the author or administrators can update this query");
        }
        
        // Update fields
        query.setTitle(updatedQuery.getTitle());
        query.setContent(updatedQuery.getContent());
        query.setCategory(updatedQuery.getCategory());
        query.setTags(updatedQuery.getTags());
        query.setUpdatedAt(LocalDateTime.now());
        
        return queryRepository.save(query);
    }

    // Delete query (only author or admin)
    public boolean deleteQuery(String id, String currentUserId) {
        log.info("Deleting query with id: {}", id);
        
        Optional<Query> queryOpt = queryRepository.findById(id);
        if (queryOpt.isEmpty()) {
            log.warn("Query not found with id: {}", id);
            return false;
        }
        
        Query query = queryOpt.get();
        
        // Get current user to check role
        User currentUser = userRepository.findById(currentUserId)
            .orElseThrow(() -> new RuntimeException("Current user not found"));
        
        // Check if user is admin first (admin can delete any query without author validation)
        if (currentUser.getRole() == UserRole.ADMIN) {
            log.info("Admin user {} deleting query {} - bypassing author check", currentUserId, id);
            try {
                queryRepository.deleteById(id);
                log.info("Query {} deleted successfully by admin {}", id, currentUserId);
                return true;
            } catch (Exception e) {
                log.error("Error deleting query {} by admin {}: {}", id, currentUserId, e.getMessage(), e);
                throw new RuntimeException("Failed to delete query: " + e.getMessage());
            }
        }
        
        // Only check author relationship for non-admin users
        if (query.getAuthor() != null && query.getAuthor().getId() != null) {
            boolean isAuthor = query.getAuthor().getId().equals(currentUserId);
            if (isAuthor) {
                log.info("Author user {} deleting their query {}", currentUserId, id);
                try {
                    queryRepository.deleteById(id);
                    log.info("Query {} deleted successfully by author {}", id, currentUserId);
                    return true;
                } catch (Exception e) {
                    log.error("Error deleting query {} by author {}: {}", id, currentUserId, e.getMessage(), e);
                    throw new RuntimeException("Failed to delete query: " + e.getMessage());
                }
            }
        }
        
        // If we get here, user is not authorized
        log.warn("User {} not authorized to delete query {}", currentUserId, id);
        throw new RuntimeException("Unauthorized: Only the author or administrators can delete this query");
    }

    // Upvote query
    public Query upvoteQuery(String id) {
        log.info("Upvoting query with id: {}", id);
        
        Optional<Query> query = queryRepository.findById(id);
        if (query.isEmpty()) {
            throw new RuntimeException("Query not found with id: " + id);
        }
        
        Query q = query.get();
        q.setUpvotes(q.getUpvotes() + 1);
        q.setUpdatedAt(LocalDateTime.now());
        
        return queryRepository.save(q);
    }

    // Downvote query
    public Query downvoteQuery(String id) {
        log.info("Downvoting query with id: {}", id);
        
        Optional<Query> query = queryRepository.findById(id);
        if (query.isEmpty()) {
            throw new RuntimeException("Query not found with id: " + id);
        }
        
        Query q = query.get();
        q.setDownvotes(q.getDownvotes() + 1);
        q.setUpdatedAt(LocalDateTime.now());
        
        return queryRepository.save(q);
    }

    // Mark query as solved
    public Query markAsSolved(String id, User solvedBy) {
        log.info("Marking query as solved with id: {}", id);
        
        Optional<Query> query = queryRepository.findById(id);
        if (query.isEmpty()) {
            throw new RuntimeException("Query not found with id: " + id);
        }
        
        Query q = query.get();
        q.setIsSolved(true);
        q.setSolvedAt(LocalDateTime.now());
        q.setSolvedBy(solvedBy);
        q.setStatus(QueryStatus.ANSWERED);
        q.setUpdatedAt(LocalDateTime.now());
        
        return queryRepository.save(q);
    }

    // Search queries
    public Page<Query> searchQueries(String searchTerm, Pageable pageable) {
        log.info("Searching queries with term: {}", searchTerm);
        return queryRepository.findByTitleOrContentContainingIgnoreCase(searchTerm, pageable);
    }

    // Get queries by tags
    public List<Query> getQueriesByTags(Set<String> tags) {
        log.info("Fetching queries by tags: {}", tags);
        return queryRepository.findByTagsContaining(new ArrayList<>(tags));
    }

    // Admin delete query - bypasses all user validation
    public boolean adminDeleteQuery(String id) {
        log.info("Admin deleting query with id: {}", id);
        
        Optional<Query> queryOpt = queryRepository.findById(id);
        if (queryOpt.isEmpty()) {
            log.warn("Query not found with id: {}", id);
            return false;
        }
        
        try {
            queryRepository.deleteById(id);
            log.info("Query {} deleted successfully by admin", id);
            return true;
        } catch (Exception e) {
            log.error("Error deleting query {} by admin: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to delete query: " + e.getMessage());
        }
    }
}
