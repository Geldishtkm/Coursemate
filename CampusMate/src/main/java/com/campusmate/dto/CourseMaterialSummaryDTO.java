package com.campusmate.dto;

import com.campusmate.enums.MaterialType;
import java.time.LocalDateTime;

/**
 * DTO for course material summary (without binary data)
 */
public class CourseMaterialSummaryDTO {
    private String id;
    private String title;
    private String description;
    private MaterialType type;
    private String fileName;
    private Long fileSize;
    private Boolean isPublic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String uploadedByName;

    // Default constructor
    public CourseMaterialSummaryDTO() {}

    // Constructor for query results
    public CourseMaterialSummaryDTO(String id, String title, String description, String type, 
                                   String fileName, Long fileSize, Boolean isPublic, 
                                   LocalDateTime createdAt, LocalDateTime updatedAt, String uploadedByName) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = MaterialType.valueOf(type);
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.isPublic = isPublic;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.uploadedByName = uploadedByName;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public MaterialType getType() { return type; }
    public void setType(MaterialType type) { this.type = type; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getUploadedByName() { return uploadedByName; }
    public void setUploadedByName(String uploadedByName) { this.uploadedByName = uploadedByName; }
}
