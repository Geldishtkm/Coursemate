package com.campusmate.dto.response;

import com.campusmate.entity.ProjectJoinRequest;
import java.time.LocalDateTime;

/**
 * DTO for project join request responses to avoid entity serialization issues
 */
public class ProjectJoinRequestResponseDto {
    
    private String id;
    private String userId;
    private String userFirstName;
    private String userLastName;
    private String userEmail;
    private String userDepartment;
    private String projectId;
    private String projectTitle;
    private String projectCategory;
    private String status;
    private String message;
    private String responseMessage;
    private LocalDateTime createdAt;
    private LocalDateTime respondedAt;
    
    // Constructors
    public ProjectJoinRequestResponseDto() {}
    
    public ProjectJoinRequestResponseDto(ProjectJoinRequest request) {
        this.id = request.getId();
        this.userId = request.getUser().getId();
        this.userFirstName = request.getUser().getFirstName();
        this.userLastName = request.getUser().getLastName();
        this.userEmail = request.getUser().getEmail();
        this.userDepartment = request.getUser().getDepartment();
        this.projectId = request.getProject().getId();
        this.projectTitle = request.getProject().getTitle();
        this.projectCategory = request.getProject().getCategory();
        this.status = request.getStatus().name();
        this.message = request.getMessage();
        this.responseMessage = request.getResponseMessage();
        this.createdAt = request.getCreatedAt();
        this.respondedAt = request.getRespondedAt();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getUserFirstName() { return userFirstName; }
    public void setUserFirstName(String userFirstName) { this.userFirstName = userFirstName; }
    
    public String getUserLastName() { return userLastName; }
    public void setUserLastName(String userLastName) { this.userLastName = userLastName; }
    
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    
    public String getUserDepartment() { return userDepartment; }
    public void setUserDepartment(String userDepartment) { this.userDepartment = userDepartment; }
    
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    
    public String getProjectTitle() { return projectTitle; }
    public void setProjectTitle(String projectTitle) { this.projectTitle = projectTitle; }
    
    public String getProjectCategory() { return projectCategory; }
    public void setProjectCategory(String projectCategory) { this.projectCategory = projectCategory; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getResponseMessage() { return responseMessage; }
    public void setResponseMessage(String responseMessage) { this.responseMessage = responseMessage; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getRespondedAt() { return respondedAt; }
    public void setRespondedAt(LocalDateTime respondedAt) { this.respondedAt = respondedAt; }
}
