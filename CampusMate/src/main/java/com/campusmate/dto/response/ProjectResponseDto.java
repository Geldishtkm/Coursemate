package com.campusmate.dto.response;

import com.campusmate.entity.Project;
import com.campusmate.entity.User;
import com.campusmate.enums.ProjectStatus;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

public class ProjectResponseDto {
    private String id;
    private String title;
    private String description;
    private String category;
    private ProjectStatus status;
    private Integer maxMembers;
    private Integer currentMembers;
    private Integer progress;
    private LocalDateTime deadline;
    private Set<String> skillsRequired;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Leader info (simplified)
    private String leaderId;
    private String leaderEmail;
    private String leaderFirstName;
    private String leaderLastName;
    
    // Course info (simplified)
    private String courseId;
    private String courseName;

    public ProjectResponseDto(Project project) {
        this.id = project.getId();
        this.title = project.getTitle();
        this.description = project.getDescription();
        this.category = project.getCategory();
        this.status = project.getStatus();
        this.maxMembers = project.getMaxMembers();
        this.currentMembers = project.getCurrentMembers();
        this.progress = project.getProgress();
        this.deadline = project.getDeadline();
        this.skillsRequired = project.getSkillsRequired();
        this.createdAt = project.getCreatedAt();
        this.updatedAt = project.getUpdatedAt();
        
        // Extract leader info safely
        if (project.getLeader() != null) {
            User leader = project.getLeader();
            this.leaderId = leader.getId();
            this.leaderEmail = leader.getEmail();
            this.leaderFirstName = leader.getFirstName();
            this.leaderLastName = leader.getLastName();
        }
        
        // Extract course info safely
        if (project.getCourse() != null) {
            this.courseId = project.getCourse().getId();
            this.courseName = project.getCourse().getTitle();
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }

    public Integer getMaxMembers() { return maxMembers; }
    public void setMaxMembers(Integer maxMembers) { this.maxMembers = maxMembers; }

    public Integer getCurrentMembers() { return currentMembers; }
    public void setCurrentMembers(Integer currentMembers) { this.currentMembers = currentMembers; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }

    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }

    public Set<String> getSkillsRequired() { return skillsRequired; }
    public void setSkillsRequired(Set<String> skillsRequired) { this.skillsRequired = skillsRequired; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getLeaderId() { return leaderId; }
    public void setLeaderId(String leaderId) { this.leaderId = leaderId; }

    public String getLeaderEmail() { return leaderEmail; }
    public void setLeaderEmail(String leaderEmail) { this.leaderEmail = leaderEmail; }

    public String getLeaderFirstName() { return leaderFirstName; }
    public void setLeaderFirstName(String leaderFirstName) { this.leaderFirstName = leaderFirstName; }

    public String getLeaderLastName() { return leaderLastName; }
    public void setLeaderLastName(String leaderLastName) { this.leaderLastName = leaderLastName; }

    public String getCourseId() { return courseId; }
    public void setCourseId(String courseId) { this.courseId = courseId; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
}
