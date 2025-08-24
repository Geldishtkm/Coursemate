package com.campusmate.entity;

import com.campusmate.enums.ProjectStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Project entity representing collaborative projects
 */
@Entity
@Table(name = "projects", indexes = {
    @Index(name = "idx_project_leader", columnList = "leader_id"),
    @Index(name = "idx_project_course", columnList = "course_id"),
    @Index(name = "idx_project_category", columnList = "category"),
    @Index(name = "idx_project_status", columnList = "status"),
    @Index(name = "idx_project_deadline", columnList = "deadline")
})
@EntityListeners(AuditingEntityListener.class)
@NamedEntityGraph(
    name = "Project.withLeader",
    attributeNodes = {
        @NamedAttributeNode("leader"),
        @NamedAttributeNode("members"),
        @NamedAttributeNode("joinRequests")
    }
)
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category must not exceed 100 characters")
    @Column(nullable = false)
    private String category;

    @NotNull(message = "Leader is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leader_id", nullable = false)
    @JsonIgnore
    private User leader;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    @JsonBackReference
    private Course course;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status;

    @NotNull(message = "Maximum members is required")
    @Positive(message = "Maximum members must be positive")
    @Column(name = "max_members", nullable = false)
    private Integer maxMembers;

    @Column(name = "current_members", nullable = false)
    private Integer currentMembers = 1;

    @Column(nullable = false)
    private Integer progress = 0;

    @NotNull(message = "Deadline is required")
    @Column(nullable = false)
    private LocalDateTime deadline;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "project_skills", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "skill")
    private Set<String> skillsRequired = new HashSet<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Relationships
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<ProjectMember> members = new HashSet<>();
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<ProjectJoinRequest> joinRequests = new HashSet<>();

    // Constructors
    public Project() {
        this.currentMembers = 1;
        this.progress = 0;
        this.skillsRequired = new HashSet<>();
        this.members = new HashSet<>();
        this.joinRequests = new HashSet<>();
    }

    public Project(String title, String description, String category, User leader, Course course, ProjectStatus status, Integer maxMembers, LocalDateTime deadline) {
        this();
        this.title = title;
        this.description = description;
        this.category = category;
        this.leader = leader;
        this.course = course;
        this.status = status;
        this.maxMembers = maxMembers;
        this.deadline = deadline;
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

    public User getLeader() { return leader; }
    public void setLeader(User leader) { this.leader = leader; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

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

    public Set<ProjectMember> getMembers() { return members; }
    public void setMembers(Set<ProjectMember> members) { this.members = members; }
    
    public Set<ProjectJoinRequest> getJoinRequests() { return joinRequests; }
    public void setJoinRequests(Set<ProjectJoinRequest> joinRequests) { this.joinRequests = joinRequests; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
