package com.campusmate.repository;

import com.campusmate.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
    
    List<Course> findBySubjectId(String subjectId);
    
    List<Course> findByProfessorId(String professorId);
    
    List<Course> findByIsActiveTrue();
    
    Optional<Course> findByCode(String code);
    
    @Query("SELECT c FROM Course c WHERE c.title LIKE %:keyword% OR c.description LIKE %:keyword%")
    List<Course> searchByKeyword(@Param("keyword") String keyword);
    
    List<Course> findByYearAndSemester(String year, String semester);
    
    @Query("SELECT c FROM Course c WHERE c.maxStudents > (SELECT COUNT(e) FROM Enrollment e WHERE e.course.id = c.id)")
    List<Course> findAvailableCourses();
}
