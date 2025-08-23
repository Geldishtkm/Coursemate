package com.campusmate.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class CreateProjectRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;
    
    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category;
    
    @NotNull(message = "Spots (max members) is required")
    @Positive(message = "Spots must be a positive number")
    private Integer spots;
    
    private String courseId;
    
    // Default constructor
    public CreateProjectRequest() {}
    
    // Constructor with all fields
    public CreateProjectRequest(String title, String description, String category, Integer spots, String courseId) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.spots = spots;
        this.courseId = courseId;
    }
    
    // Getters and Setters
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public Integer getSpots() {
        return spots;
    }
    
    public void setSpots(Integer spots) {
        this.spots = spots;
    }
    
    public String getCourseId() {
        return courseId;
    }
    
    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }
}
