package com.campusmate.repository;

import com.campusmate.entity.CourseMaterial;
import com.campusmate.dto.CourseMaterialSummaryDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    
    @Query(value = "SELECT cm.id, cm.title, cm.description, cm.type, cm.file_name, cm.file_size, " +
                   "cm.is_public, cm.created_at, cm.updated_at, " +
                   "CONCAT(u.first_name, ' ', u.last_name) as uploaded_by_name " +
                   "FROM course_materials cm JOIN users u ON cm.uploaded_by = u.id " +
                   "WHERE cm.course_id = :courseId " +
                   "ORDER BY cm.created_at DESC", nativeQuery = true)
    List<Object[]> findMaterialSummariesByCourseIdNative(@Param("courseId") String courseId);
}
