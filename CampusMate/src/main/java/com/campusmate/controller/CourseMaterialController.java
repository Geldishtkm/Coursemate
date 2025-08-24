package com.campusmate.controller;

import com.campusmate.dto.response.ApiResponse;
import com.campusmate.dto.CourseMaterialSummaryDTO;
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
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    public ResponseEntity<ApiResponse<List<CourseMaterialSummaryDTO>>> getMaterials(@PathVariable String courseId) {
        try {
            List<Object[]> rawResults = materialRepository.findMaterialSummariesByCourseIdNative(courseId);
            
            List<CourseMaterialSummaryDTO> materials = rawResults.stream()
                .map(row -> new CourseMaterialSummaryDTO(
                    (String) row[0],  // id
                    (String) row[1],  // title
                    (String) row[2],  // description
                    (String) row[3],  // type
                    (String) row[4],  // fileName
                    ((Number) row[5]).longValue(), // fileSize
                    (Boolean) row[6], // isPublic
                    ((java.sql.Timestamp) row[7]).toLocalDateTime(), // createdAt
                    ((java.sql.Timestamp) row[8]).toLocalDateTime(), // updatedAt
                    (String) row[9]   // uploadedByName
                ))
                .collect(java.util.stream.Collectors.toList());
                
            return ResponseEntity.ok(ApiResponse.success("Materials retrieved successfully", materials));
        } catch (Exception e) {
            log.error("Error fetching materials for course {}: {}", courseId, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to fetch materials: " + e.getMessage()));
        }
    }

    /**
     * Add new material to a course (Admin only) - JSON for text materials
     */
    @PostMapping(value = "/{courseId}/materials", consumes = "application/json")
    public ResponseEntity<ApiResponse<CourseMaterial>> addTextMaterial(
            @PathVariable String courseId,
            @RequestBody MaterialRequest request) {
        return createMaterial(courseId, request.getTitle(), request.getDescription(), 
                             request.getType(), request.getFileName(), request.getContent(), null);
    }

    /**
     * Add new material to a course (Admin only) - FormData for file uploads
     */
    @PostMapping(value = "/{courseId}/materials", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<CourseMaterial>> addFileMaterial(
            @PathVariable String courseId,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("type") String type,
            @RequestParam("file") MultipartFile file) {
        return createMaterial(courseId, title, description, type, file.getOriginalFilename(), null, file);
    }

    /**
     * Common method to create materials
     */
    private ResponseEntity<ApiResponse<CourseMaterial>> createMaterial(
            String courseId, String title, String description, String type, 
            String fileName, String content, MultipartFile file) {
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
            material.setTitle(title);
            material.setDescription(description);
            material.setType(MaterialType.valueOf(type.toUpperCase()));
            material.setIsPublic(true);
            material.setCreatedAt(LocalDateTime.now());
            material.setUpdatedAt(LocalDateTime.now());

            if (file != null) {
                // Validate file type
                String originalFilename = file.getOriginalFilename();
                if (originalFilename == null || !isValidFileType(originalFilename)) {
                    return ResponseEntity.badRequest()
                        .body(ApiResponse.error("File type not supported. Only PDF, images (JPG/PNG/GIF), documents (DOC/DOCX), and text files (TXT) are allowed. You tried to upload: " + originalFilename));
                }
                
                // Handle file upload
                try {
                    material.setFileName(fileName);
                    material.setFileSize(file.getSize());
                    material.setFileData(file.getBytes());
                    // For files, set fileUrl to indicate it's a binary file
                    material.setFileUrl("binary://" + fileName);
                } catch (IOException e) {
                    log.error("Error reading file data: {}", e.getMessage());
                    throw new RuntimeException("Failed to read file data: " + e.getMessage());
                }
            } else {
                // Handle text-only material
                material.setFileName(fileName != null ? fileName : title + ".txt");
                material.setFileSize((long) (content != null ? content.length() : 0));
                // For text content, we can store it as base64 in fileUrl
                if (content != null) {
                    material.setFileUrl("data:text/plain;base64," + java.util.Base64.getEncoder().encodeToString(content.getBytes()));
                } else {
                    // Set a default fileUrl for text-only materials without content
                    material.setFileUrl("text://" + title + ".txt");
                }
            }

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
     * Download/view a material file
     */
    @GetMapping("/{courseId}/materials/{materialId}/download")
    public ResponseEntity<byte[]> downloadMaterial(
            @PathVariable String courseId,
            @PathVariable String materialId) {
        try {
            Optional<CourseMaterial> materialOpt = materialRepository.findById(materialId);
            if (materialOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            CourseMaterial material = materialOpt.get();
            
            if (material.getFileData() != null) {
                // Return binary file data
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(getMediaType(material.getFileName()));
                headers.setContentDispositionFormData("attachment", material.getFileName());
                
                return ResponseEntity.ok()
                    .headers(headers)
                    .body(material.getFileData());
            } else if (material.getFileUrl() != null && material.getFileUrl().startsWith("data:")) {
                // Return text content from base64
                String base64Data = material.getFileUrl().substring(material.getFileUrl().indexOf(",") + 1);
                byte[] decodedData = java.util.Base64.getDecoder().decode(base64Data);
                
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.TEXT_PLAIN);
                
                return ResponseEntity.ok()
                    .headers(headers)
                    .body(decodedData);
            } else if (material.getFileUrl() != null && material.getFileUrl().startsWith("text://")) {
                // Return text content for text-only materials
                String textContent = material.getDescription() != null ? material.getDescription() : material.getTitle();
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.TEXT_PLAIN);
                
                return ResponseEntity.ok()
                    .headers(headers)
                    .body(textContent.getBytes());
            }
            
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error downloading material {} from course {}: {}", materialId, courseId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    private MediaType getMediaType(String fileName) {
        if (fileName == null) return MediaType.APPLICATION_OCTET_STREAM;
        
        String extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        switch (extension) {
            case "pdf": return MediaType.APPLICATION_PDF;
            case "jpg":
            case "jpeg": return MediaType.IMAGE_JPEG;
            case "png": return MediaType.IMAGE_PNG;
            case "gif": return MediaType.IMAGE_GIF;
            case "txt": return MediaType.TEXT_PLAIN;
            case "doc":
            case "docx": return MediaType.valueOf("application/msword");
            default: return MediaType.APPLICATION_OCTET_STREAM;
        }
    }

    private boolean isValidFileType(String fileName) {
        if (fileName == null) return false;
        
        String extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        return extension.matches("(pdf|jpg|jpeg|png|gif|doc|docx|txt)");
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
