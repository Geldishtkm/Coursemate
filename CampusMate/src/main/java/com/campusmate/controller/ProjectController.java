package com.campusmate.controller;

import com.campusmate.dto.response.ApiResponse;
import com.campusmate.dto.request.CreateProjectRequest;
import com.campusmate.dto.request.ProjectJoinRequestDto;
import com.campusmate.dto.request.ProjectJoinResponseDto;
import com.campusmate.dto.response.ProjectJoinRequestResponseDto;
import com.campusmate.dto.response.ProjectResponseDto;
import com.campusmate.entity.Project;
import com.campusmate.entity.ProjectJoinRequest;
import com.campusmate.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/projects")
@CrossOrigin(origins = "*")
public class ProjectController {
    
    @Autowired
    private ProjectService projectService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectResponseDto>>> getAllProjects() {
        List<ProjectResponseDto> projects = projectService.getAllProjects();
        return ResponseEntity.ok(ApiResponse.success("Projects retrieved successfully", projects));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> getProjectById(@PathVariable String id) {
        return projectService.getProjectById(id)
            .map(project -> ResponseEntity.ok(ApiResponse.success("Project retrieved successfully", project)))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Project>> createProject(@RequestBody CreateProjectRequest request) {
        try {
            // Get current user from security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401)
                    .body(ApiResponse.error("Authentication required"));
            }

            String userEmail = authentication.getName();
            System.out.println("Received project creation request: " + request.getTitle() + " from user: " + userEmail);
            System.out.println("Project details: title=" + request.getTitle() + 
                             ", description=" + request.getDescription() + 
                             ", category=" + request.getCategory() + 
                             ", spots=" + request.getSpots());
            
            Project createdProject = projectService.createProjectFromRequest(request, userEmail);
            System.out.println("Project created successfully with ID: " + createdProject.getId());
            return ResponseEntity.ok(ApiResponse.success("Project created successfully", createdProject));
        } catch (Exception e) {
            System.err.println("Error creating project: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to create project: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> updateProject(@PathVariable String id, @RequestBody Project project) {
        try {
            // Get current user from security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401)
                    .body(ApiResponse.error("Authentication required"));
            }

            String userEmail = authentication.getName();
            Project updatedProject = projectService.updateProject(id, project, userEmail);
            return ResponseEntity.ok(ApiResponse.success("Project updated successfully", updatedProject));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to update project: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable String id) {
        try {
            // Get current user from security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401)
                    .body(ApiResponse.error("Authentication required"));
            }

            String userEmail = authentication.getName();
            projectService.deleteProject(id, userEmail);
            return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to delete project: " + e.getMessage()));
        }
    }
    
    @GetMapping("/leader/{leaderId}")
    public ResponseEntity<ApiResponse<List<Project>>> getProjectsByLeader(@PathVariable String leaderId) {
        List<Project> projects = projectService.getProjectsByLeader(leaderId);
        return ResponseEntity.ok(ApiResponse.success("Projects by leader retrieved successfully", projects));
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<Project>>> getProjectsByCourse(@PathVariable String courseId) {
        List<Project> projects = projectService.getProjectsByCourse(courseId);
        return ResponseEntity.ok(ApiResponse.success("Projects by course retrieved successfully", projects));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<Project>>> getProjectsByStatus(@PathVariable String status) {
        List<Project> projects = projectService.getProjectsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Projects by status retrieved successfully", projects));
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<Project>>> getProjectsByCategory(@PathVariable String category) {
        List<Project> projects = projectService.getProjectsByCategory(category);
        return ResponseEntity.ok(ApiResponse.success("Projects by category retrieved successfully", projects));
    }
    
    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<Project>>> getProjectsWithAvailableSlots() {
        List<Project> projects = projectService.getProjectsWithAvailableSlots();
        return ResponseEntity.ok(ApiResponse.success("Projects with available slots retrieved successfully", projects));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Project>>> searchProjects(@RequestParam String keyword) {
        List<Project> projects = projectService.searchProjects(keyword);
        return ResponseEntity.ok(ApiResponse.success("Projects search completed successfully", projects));
    }
    
    @GetMapping("/skill/{skill}")
    public ResponseEntity<ApiResponse<List<Project>>> getProjectsBySkill(@PathVariable String skill) {
        List<Project> projects = projectService.getProjectsBySkill(skill);
        return ResponseEntity.ok(ApiResponse.success("Projects by skill retrieved successfully", projects));
    }
    
    @GetMapping("/deadline")
    public ResponseEntity<ApiResponse<List<Project>>> getProjectsBeforeDeadline(@RequestParam String deadline) {
        LocalDateTime deadlineTime = LocalDateTime.parse(deadline);
        List<Project> projects = projectService.getProjectsBeforeDeadline(deadlineTime);
        return ResponseEntity.ok(ApiResponse.success("Projects before deadline retrieved successfully", projects));
    }
    
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        System.out.println("Project controller health check called");
        return ResponseEntity.ok(ApiResponse.success("Project controller is healthy", "OK"));
    }

    // ========== PROJECT JOIN REQUEST ENDPOINTS ==========

    /**
     * Request to join a project
     */
    @PostMapping("/{projectId}/join")
    public ResponseEntity<ApiResponse<ProjectJoinRequest>> requestToJoinProject(
            @PathVariable String projectId,
            @RequestBody ProjectJoinRequestDto requestDto) {
        try {
            // Get current user from security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401)
                    .body(ApiResponse.error("Authentication required"));
            }

            String userEmail = authentication.getName();
            ProjectJoinRequest joinRequest = projectService.requestToJoinProject(requestDto, userEmail);
            
            return ResponseEntity.ok(ApiResponse.success("Join request submitted successfully", joinRequest));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to submit join request: " + e.getMessage()));
        }
    }

    /**
     * Get pending join requests for a project (project leader only)
     */
    @GetMapping("/{projectId}/join-requests")
    public ResponseEntity<ApiResponse<List<ProjectJoinRequestResponseDto>>> getProjectJoinRequests(@PathVariable String projectId) {
        try {
            List<ProjectJoinRequestResponseDto> joinRequests = projectService.getPendingJoinRequests(projectId);
            return ResponseEntity.ok(ApiResponse.success("Join requests retrieved successfully", joinRequests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to retrieve join requests: " + e.getMessage()));
        }
    }

    /**
     * Get join requests for projects led by current user
     */
    @GetMapping("/my-projects/join-requests")
    public ResponseEntity<ApiResponse<List<ProjectJoinRequestResponseDto>>> getMyProjectJoinRequests() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401)
                    .body(ApiResponse.error("Authentication required"));
            }

            String userEmail = authentication.getName();
            List<ProjectJoinRequestResponseDto> joinRequests = projectService.getJoinRequestsForUserProjects(userEmail);
            
            return ResponseEntity.ok(ApiResponse.success("Join requests retrieved successfully", joinRequests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to retrieve join requests: " + e.getMessage()));
        }
    }

    /**
     * Respond to a join request (approve/reject)
     */
    @PostMapping("/join-requests/{requestId}/respond")
    public ResponseEntity<ApiResponse<ProjectJoinRequestResponseDto>> respondToJoinRequest(
            @PathVariable String requestId,
            @RequestBody ProjectJoinResponseDto responseDto) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401)
                    .body(ApiResponse.error("Authentication required"));
            }

            String userEmail = authentication.getName();
            ProjectJoinRequestResponseDto joinRequest = projectService.respondToJoinRequest(responseDto, userEmail);
            
            return ResponseEntity.ok(ApiResponse.success("Join request processed successfully", joinRequest));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to process join request: " + e.getMessage()));
        }
    }

    /**
     * Get user's own join requests
     */
    @GetMapping("/my-join-requests")
    public ResponseEntity<ApiResponse<List<ProjectJoinRequestResponseDto>>> getMyJoinRequests() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401)
                    .body(ApiResponse.error("Authentication required"));
            }

            String userEmail = authentication.getName();
            List<ProjectJoinRequestResponseDto> joinRequests = projectService.getUserJoinRequests(userEmail);
            
            return ResponseEntity.ok(ApiResponse.success("Join requests retrieved successfully", joinRequests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to retrieve join requests: " + e.getMessage()));
        }
    }

    /**
     * Cancel a join request
     */
    @DeleteMapping("/join-requests/{requestId}")
    public ResponseEntity<ApiResponse<Void>> cancelJoinRequest(@PathVariable String requestId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401)
                    .body(ApiResponse.error("Authentication required"));
            }

            String userEmail = authentication.getName();
            projectService.cancelJoinRequest(requestId, userEmail);
            
            return ResponseEntity.ok(ApiResponse.success("Join request cancelled successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to cancel join request: " + e.getMessage()));
        }
    }

    /**
     * Get user's status with a project
     */
    @GetMapping("/{projectId}/user-status")
    public ResponseEntity<ApiResponse<String>> getUserProjectStatus(@PathVariable String projectId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401)
                    .body(ApiResponse.error("Authentication required"));
            }

            String userEmail = authentication.getName();
            String status = projectService.getUserProjectStatus(projectId, userEmail);
            
            return ResponseEntity.ok(ApiResponse.success("User status retrieved successfully", status));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to get user status: " + e.getMessage()));
        }
    }
}
