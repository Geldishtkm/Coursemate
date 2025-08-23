package com.campusmate.repository;

import com.campusmate.entity.Query;
import com.campusmate.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QueryRepository extends JpaRepository<Query, String> {

    // Find queries by author
    List<Query> findByAuthorOrderByCreatedAtDesc(User author);
    
    // Find queries by category
    List<Query> findByCategoryOrderByCreatedAtDesc(String category);
    
    // Find queries by status
    List<Query> findByStatusOrderByCreatedAtDesc(String status);
    
    // Find queries by course ID
    List<Query> findByCourseIdOrderByCreatedAtDesc(String courseId);
    
    // Find queries by tags (contains any of the tags)
    @org.springframework.data.jpa.repository.Query("SELECT q FROM Query q JOIN q.tags t WHERE t IN :tags")
    List<Query> findByTagsContaining(@Param("tags") List<String> tags);
    
    // Find queries by author ID
    List<Query> findByAuthorIdOrderByCreatedAtDesc(String authorId);
    
    // Find queries by author ID with pagination
    Page<Query> findByAuthorId(String authorId, Pageable pageable);
    
    // Find queries by category with pagination
    Page<Query> findByCategory(String category, Pageable pageable);
    
    // Find all queries with pagination, ordered by creation date
    Page<Query> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    // Find queries by author and status
    List<Query> findByAuthorAndStatusOrderByCreatedAtDesc(User author, String status);
    
    // Find queries by author ID and status
    List<Query> findByAuthorIdAndStatusOrderByCreatedAtDesc(String authorId, String status);
    
    // Check if query exists by author ID
    boolean existsByIdAndAuthorId(String queryId, String authorId);
    
    // Find queries by title containing (search functionality)
    @org.springframework.data.jpa.repository.Query("SELECT q FROM Query q WHERE LOWER(q.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(q.content) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Query> findByTitleOrContentContainingIgnoreCase(@Param("searchTerm") String searchTerm, Pageable pageable);
}
