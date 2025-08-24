package com.campusmate.controller;

import com.campusmate.dto.response.ApiResponse;
import com.campusmate.entity.CourseMaterial;
import com.campusmate.entity.Course;
import com.campusmate.entity.User;
import com.campusmate.enums.MaterialType;
import com.campusmate.repository.CourseMaterialRepository;
import com.campusmate.repository.CourseRepository;
import com.campusmate.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Course Materials controller for managing course resources
 */
@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "*")
public class CourseMaterialController {

    private static final Logger log = LoggerFactory.getLogger(CourseMaterialController.class);

    @Autowired
    private CourseMaterialRepository materialRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private UserRepository userRepository;

    /**
     * Get all materials for a course
     */
    @GetMapping("/{courseId}/materials")
    public ResponseEntity<ApiResponse<List<CourseMaterial>>> getMaterials(@PathVariable String courseId) {
        try {
            List<CourseMaterial> materials = materialRepository.findByCourseIdOrderByCreatedAtDesc(courseId);
            return ResponseEntity.ok(ApiResponse.success("Materials retrieved successfully", materials));
        } catch (Exception e) {
            log.error("Error fetching materials for course {}: {}", courseId, e.getMessage());
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to fetch materials: " + e.getMessage()));
        }
    }

    /**
     * Add new material to a course (Admin only)
     */
    @PostMapping("/{courseId}/materials")
    public ResponseEntity<ApiResponse<CourseMaterial>> addMaterial(
            @PathVariable String courseId,
            @RequestBody MaterialRequest request) {
        try {
            log.info("Adding material to course {}", courseId);

            // Get course
            Optional<Course> courseOpt = courseRepository.findById(courseId);
            if (courseOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Course not found"));
            }

            Course course = courseOpt.get();

            // Create material
            CourseMaterial material = new CourseMaterial();
            material.setCourse(course);
            material.setTitle(request.getTitle());
            material.setDescription(request.getDescription());
            material.setType(MaterialType.valueOf(request.getType().toUpperCase()));
            material.setFileName(request.getFileName() != null ? request.getFileName() : "text-content");
            material.setFileSize((long) (request.getContent() != null ? request.getContent().length() : 0));
            material.setFileUrl(request.getContent() != null ? "data:text/plain;base64," + java.util.Base64.getEncoder().encodeToString(request.getContent().getBytes()) : "");
            material.setIsPublic(true);
            material.setCreatedAt(LocalDateTime.now());
            material.setUpdatedAt(LocalDateTime.now());

            // Find or create an admin user for uploadedBy
            Optional<User> adminOpt = userRepository.findByEmail("orazovgeldymurad@gmail.com");
            if (adminOpt.isEmpty()) {
                // Try to find any admin user
                List<User> adminUsers = userRepository.findAll().stream()
                    .filter(u -> u.getRole() != null && u.getRole().toString().equals("ADMIN"))
                    .toList();
                if (!adminUsers.isEmpty()) {
                    material.setUploadedBy(adminUsers.get(0));
                } else {
                    // Create a minimal admin user that gets saved to DB
                    User adminUser = new User();
                    adminUser.setEmail("admin@system.com");
                    adminUser.setFirstName("Admin");
                    adminUser.setLastName("System");
                    adminUser.setRole(com.campusmate.enums.UserRole.ADMIN);
                    adminUser.setIsActive(true);
                    adminUser.setCreatedAt(LocalDateTime.now());
                    adminUser.setUpdatedAt(LocalDateTime.now());
                    User savedAdmin = userRepository.save(adminUser);
                    material.setUploadedBy(savedAdmin);
                }
            } else {
                material.setUploadedBy(adminOpt.get());
            }

            CourseMaterial savedMaterial = materialRepository.save(material);
            log.info("Material {} added to course {} successfully", savedMaterial.getId(), courseId);

            return ResponseEntity.ok(ApiResponse.success("Material added successfully", savedMaterial));
        } catch (Exception e) {
            log.error("Error adding material to course {}: {}", courseId, e.getMessage());
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to add material: " + e.getMessage()));
        }
    }

    /**
     * Delete a material (Admin only)
     */
    @DeleteMapping("/{courseId}/materials/{materialId}")
    public ResponseEntity<ApiResponse<String>> deleteMaterial(
            @PathVariable String courseId,
            @PathVariable String materialId) {
        try {
            Optional<CourseMaterial> materialOpt = materialRepository.findById(materialId);
            if (materialOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            materialRepository.deleteById(materialId);
            log.info("Material {} deleted from course {} successfully", materialId, courseId);

            return ResponseEntity.ok(ApiResponse.success("Material deleted successfully", null));
        } catch (Exception e) {
            log.error("Error deleting material {} from course {}: {}", materialId, courseId, e.getMessage());
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to delete material: " + e.getMessage()));
        }
    }

    /**
     * Request class for adding materials
     */
    public static class MaterialRequest {
        private String title;
        private String description;
        private String type;
        private String fileName;
        private String content;

        // Getters and setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
        
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }
}
