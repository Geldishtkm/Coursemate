package com.campusmate.entity;

import com.campusmate.enums.DifficultyLevel;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
 * Subject entity representing academic subjects/departments
 */
@Entity
@Table(name = "subjects", indexes = {
    @Index(name = "idx_subject_code", columnList = "code", unique = true),
    @Index(name = "idx_subject_department", columnList = "department"),
    @Index(name = "idx_subject_difficulty", columnList = "difficulty")
})
@EntityListeners(AuditingEntityListener.class)
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank(message = "Subject code is required")
    @Size(max = 20, message = "Subject code must not exceed 20 characters")
    @Column(unique = true, nullable = false)
    private String code;

    @NotBlank(message = "Subject name is required")
    @Size(max = 200, message = "Subject name must not exceed 200 characters")
    @Column(nullable = false)
    private String name;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Department is required")
    @Size(max = 100, message = "Department must not exceed 100 characters")
    @Column(nullable = false)
    private String department;

    @NotNull(message = "Credits are required")
    @Positive(message = "Credits must be positive")
    @Column(nullable = false)
    private Integer credits;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DifficultyLevel difficulty;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "subject_prerequisites", joinColumns = @JoinColumn(name = "subject_id"))
    @Column(name = "prerequisite")
    private Set<String> prerequisites = new HashSet<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "subject_topics", joinColumns = @JoinColumn(name = "subject_id"))
    @Column(name = "topic")
    private Set<String> topics = new HashSet<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Relationships
    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Course> courses = new HashSet<>();

    // Constructors
    public Subject() {
        this.prerequisites = new HashSet<>();
        this.topics = new HashSet<>();
        this.courses = new HashSet<>();
    }

    public Subject(String code, String name, String description, String department, Integer credits, DifficultyLevel difficulty) {
        this();
        this.code = code;
        this.name = name;
        this.description = description;
        this.department = department;
        this.credits = credits;
        this.difficulty = difficulty;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }

    public DifficultyLevel getDifficulty() { return difficulty; }
    public void setDifficulty(DifficultyLevel difficulty) { this.difficulty = difficulty; }

    public Set<String> getPrerequisites() { return prerequisites; }
    public void setPrerequisites(Set<String> prerequisites) { this.prerequisites = prerequisites; }

    public Set<String> getTopics() { return topics; }
    public void setTopics(Set<String> topics) { this.topics = topics; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Set<Course> getCourses() { return courses; }
    public void setCourses(Set<Course> courses) { this.courses = courses; }

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
