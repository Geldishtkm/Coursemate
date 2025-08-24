package com.campusmate.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * ProjectJoinRequest entity representing pending join requests for projects
 */
@Entity
@Table(name = "project_join_requests", indexes = {
    @Index(name = "idx_join_request_project", columnList = "project_id"),
    @Index(name = "idx_join_request_user", columnList = "user_id"),
    @Index(name = "idx_join_request_status", columnList = "status"),
    @Index(name = "idx_join_request_unique", columnList = "project_id, user_id", unique = true)
})
@EntityListeners(AuditingEntityListener.class)
@NamedEntityGraph(
    name = "ProjectJoinRequest.withUser",
    attributeNodes = {
        @NamedAttributeNode("user")
    }
)
public class ProjectJoinRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotNull(message = "Project is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnore
    private Project project;

    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message; // Optional message from user

    @Column(name = "response_message", columnDefinition = "TEXT")
    private String responseMessage; // Optional response from project leader

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responded_by")
    @JsonIgnore
    private User respondedBy; // Project leader who approved/rejected

    public enum RequestStatus {
        PENDING("Pending"),
        APPROVED("Approved"),
        REJECTED("Rejected");

        private final String displayName;

        RequestStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    // Constructors
    public ProjectJoinRequest() {}

    public ProjectJoinRequest(Project project, User user) {
        this.project = project;
        this.user = user;
        this.status = RequestStatus.PENDING;
    }

    public ProjectJoinRequest(Project project, User user, String message) {
        this(project, user);
        this.message = message;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getResponseMessage() { return responseMessage; }
    public void setResponseMessage(String responseMessage) { this.responseMessage = responseMessage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getRespondedAt() { return respondedAt; }
    public void setRespondedAt(LocalDateTime respondedAt) { this.respondedAt = respondedAt; }

    public User getRespondedBy() { return respondedBy; }
    public void setRespondedBy(User respondedBy) { this.respondedBy = respondedBy; }

    // Helper methods
    public boolean isPending() {
        return RequestStatus.PENDING.equals(this.status);
    }

    public boolean isApproved() {
        return RequestStatus.APPROVED.equals(this.status);
    }

    public boolean isRejected() {
        return RequestStatus.REJECTED.equals(this.status);
    }
}
