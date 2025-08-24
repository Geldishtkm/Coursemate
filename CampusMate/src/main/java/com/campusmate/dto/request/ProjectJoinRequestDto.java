package com.campusmate.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO for requesting to join a project
 */
public class ProjectJoinRequestDto {

    @NotNull(message = "Project ID is required")
    @NotBlank(message = "Project ID cannot be blank")
    private String projectId;

    @Size(max = 500, message = "Message must not exceed 500 characters")
    private String message; // Optional message from user

    // Constructors
    public ProjectJoinRequestDto() {}

    public ProjectJoinRequestDto(String projectId) {
        this.projectId = projectId;
    }

    public ProjectJoinRequestDto(String projectId, String message) {
        this.projectId = projectId;
        this.message = message;
    }

    // Getters and Setters
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
