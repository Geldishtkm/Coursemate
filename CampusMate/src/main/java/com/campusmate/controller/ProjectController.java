package com.campusmate.controller;

import com.campusmate.dto.response.ApiResponse;
import com.campusmate.dto.request.CreateProjectRequest;
import com.campusmate.entity.Project;
import com.campusmate.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/projects")
@CrossOrigin(origins = "*")
public class ProjectController {
    
    @Autowired
    private ProjectService projectService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
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
            System.out.println("Received project creation request: " + request.getTitle());
            System.out.println("Project details: title=" + request.getTitle() + 
                             ", description=" + request.getDescription() + 
                             ", category=" + request.getCategory() + 
                             ", spots=" + request.getSpots());
            
            Project createdProject = projectService.createProjectFromRequest(request);
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
        Project updatedProject = projectService.updateProject(id, project);
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", updatedProject));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
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
}
