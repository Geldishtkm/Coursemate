package com.campusmate.repository;

import com.campusmate.entity.Response;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponseRepository extends JpaRepository<Response, String> {
    
    List<Response> findByQueryId(String queryId);
    
    List<Response> findByAuthorId(String authorId);
    
    List<Response> findByIsAcceptedTrue();
    
    @Query("SELECT r FROM Response r WHERE r.content LIKE %:keyword%")
    List<Response> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT r FROM Response r WHERE r.query.id = :queryId ORDER BY r.createdAt DESC")
    List<Response> findByQueryIdOrderByCreatedAtDesc(@Param("queryId") String queryId);
    
    @Query("SELECT COUNT(r) FROM Response r WHERE r.author.id = :authorId")
    Long countByAuthorId(@Param("authorId") String authorId);
    
    @Query("SELECT r FROM Response r WHERE r.upvotes > :minUpvotes ORDER BY r.upvotes DESC")
    List<Response> findTopResponsesByUpvotes(@Param("minUpvotes") Integer minUpvotes);
    
    Long countByQueryId(String queryId);
}
