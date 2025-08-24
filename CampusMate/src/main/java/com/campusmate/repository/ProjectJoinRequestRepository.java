package com.campusmate.repository;

import com.campusmate.entity.ProjectJoinRequest;
import com.campusmate.entity.ProjectJoinRequest.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for ProjectJoinRequest entity
 */
@Repository
public interface ProjectJoinRequestRepository extends JpaRepository<ProjectJoinRequest, String> {

    /**
     * Find all join requests for a specific project
     */
    List<ProjectJoinRequest> findByProjectIdOrderByCreatedAtDesc(String projectId);

    /**
     * Find all join requests by a specific user
     */
    List<ProjectJoinRequest> findByUserIdOrderByCreatedAtDesc(String userId);

    /**
     * Find all pending join requests for a project
     */
    List<ProjectJoinRequest> findByProjectIdAndStatusOrderByCreatedAtDesc(String projectId, RequestStatus status);

    /**
     * Find all pending join requests for a project
     */
    @EntityGraph(attributePaths = {"user"})
    List<ProjectJoinRequest> findByProjectIdAndStatus(String projectId, RequestStatus status);

    /**
     * Find a specific join request by project and user
     */
    Optional<ProjectJoinRequest> findByProjectIdAndUserId(String projectId, String userId);

    /**
     * Check if a user has already requested to join a project
     */
    boolean existsByProjectIdAndUserId(String projectId, String userId);

    /**
     * Count pending requests for a project
     */
    long countByProjectIdAndStatus(String projectId, RequestStatus status);

    /**
     * Find all join requests by status
     */
    List<ProjectJoinRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);

    /**
     * Find join requests for projects led by a specific user
     */
    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT r FROM ProjectJoinRequest r WHERE r.project.leader.id = :leaderId ORDER BY r.createdAt DESC")
    List<ProjectJoinRequest> findByProjectLeaderId(@Param("leaderId") String leaderId);

    /**
     * Find pending join requests for projects led by a specific user
     */
    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT r FROM ProjectJoinRequest r WHERE r.project.leader.id = :leaderId AND r.status = :status ORDER BY r.createdAt DESC")
    List<ProjectJoinRequest> findByProjectLeaderIdAndStatus(@Param("leaderId") String leaderId, @Param("status") RequestStatus status);
}
