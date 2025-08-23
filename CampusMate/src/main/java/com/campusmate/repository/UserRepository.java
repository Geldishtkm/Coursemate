package com.campusmate.repository;

import com.campusmate.entity.User;
import com.campusmate.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);
    
    Optional<User> findByStudentId(String studentId);
    
    boolean existsByEmail(String email);
    
    boolean existsByStudentId(String studentId);
    
    List<User> findByRole(UserRole role);
    
    List<User> findByDepartment(String department);
    
    List<User> findByIsActive(Boolean isActive);
    
    @Query("SELECT u FROM User u WHERE u.firstName LIKE %:searchTerm% OR u.lastName LIKE %:searchTerm% OR u.email LIKE %:searchTerm%")
    Page<User> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND (u.firstName LIKE %:searchTerm% OR u.lastName LIKE %:searchTerm%)")
    Page<User> findByRoleAndSearchTerm(@Param("role") UserRole role, @Param("searchTerm") String searchTerm, Pageable pageable);
}
