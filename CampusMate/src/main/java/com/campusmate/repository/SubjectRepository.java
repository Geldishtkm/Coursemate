package com.campusmate.repository;

import com.campusmate.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, String> {
    
    List<Subject> findByDepartment(String department);
    
    List<Subject> findByDifficulty(String difficulty);
    
    Optional<Subject> findByCode(String code);
    
    @Query("SELECT s FROM Subject s WHERE s.name LIKE %:keyword% OR s.description LIKE %:keyword%")
    List<Subject> searchByKeyword(@Param("keyword") String keyword);
    
    List<Subject> findByCredits(Integer credits);
    
    @Query("SELECT s FROM Subject s WHERE :prerequisite MEMBER OF s.prerequisites")
    List<Subject> findByPrerequisite(@Param("prerequisite") String prerequisite);
    
    Optional<Subject> findByNameIgnoreCase(String name);
}
