package com.campusmate.repository;

import com.campusmate.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    
    List<Project> findByLeaderId(String leaderId);
    
    List<Project> findByCourseId(String courseId);
    
    List<Project> findByStatus(String status);
    
    List<Project> findByCategory(String category);
    
    @Query("SELECT p FROM Project p WHERE p.deadline < :deadline")
    List<Project> findProjectsBeforeDeadline(@Param("deadline") LocalDateTime deadline);
    
    @Query("SELECT p FROM Project p WHERE p.currentMembers < p.maxMembers")
    List<Project> findProjectsWithAvailableSlots();
    
    @Query("SELECT p FROM Project p WHERE p.title LIKE %:keyword% OR p.description LIKE %:keyword%")
    List<Project> searchByKeyword(@Param("keyword") String keyword);
    
    List<Project> findBySkillsRequiredContaining(String skill);
}
