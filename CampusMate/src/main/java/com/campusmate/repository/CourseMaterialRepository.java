package com.campusmate.repository;

import com.campusmate.entity.CourseMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for CourseMaterial entity
 */
@Repository
public interface CourseMaterialRepository extends JpaRepository<CourseMaterial, String> {
    
    List<CourseMaterial> findByCourseIdOrderByCreatedAtDesc(String courseId);
    
    List<CourseMaterial> findByCourseIdAndIsPublicTrueOrderByCreatedAtDesc(String courseId);
    
    void deleteByCourseId(String courseId);
}
