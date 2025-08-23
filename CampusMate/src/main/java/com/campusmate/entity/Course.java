package com.campusmate.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
 * Course entity representing university courses
 */
@Entity
@Table(name = "courses", indexes = {
    @Index(name = "idx_course_code", columnList = "code", unique = true),
    @Index(name = "idx_course_subject", columnList = "subject_id"),
    @Index(name = "idx_course_professor", columnList = "professor_id"),
    @Index(name = "idx_course_semester_year", columnList = "semester, year")
})
@EntityListeners(AuditingEntityListener.class)
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank(message = "Course code is required")
    @Size(max = 20, message = "Course code must not exceed 20 characters")
    @Column(unique = true, nullable = false)
    private String code;

    @NotBlank(message = "Course title is required")
    @Size(max = 200, message = "Course title must not exceed 200 characters")
    @Column(nullable = false)
    private String title;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Subject is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    @JsonBackReference
    private Subject subject;

    @NotNull(message = "Professor is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id", nullable = false)
    @JsonBackReference
    private User professor;

    @NotBlank(message = "Semester is required")
    @Size(max = 20, message = "Semester must not exceed 20 characters")
    @Column(nullable = false)
    private String semester;

    @NotBlank(message = "Year is required")
    @Size(max = 10, message = "Year must not exceed 10 characters")
    @Column(nullable = false)
    private String year;

    @NotNull(message = "Credits are required")
    @Positive(message = "Credits must be positive")
    @Column(nullable = false)
    private Integer credits;

    @NotNull(message = "Maximum students is required")
    @Positive(message = "Maximum students must be positive")
    @Column(name = "max_students", nullable = false)
    private Integer maxStudents;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Relationships
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Enrollment> enrollments = new HashSet<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<CourseMaterial> materials = new HashSet<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Query> queries = new HashSet<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Project> projects = new HashSet<>();

    // Constructors
    public Course() {
        this.isActive = true;
        this.enrollments = new HashSet<>();
        this.materials = new HashSet<>();
        this.queries = new HashSet<>();
        this.projects = new HashSet<>();
    }

    public Course(String code, String title, String description, Subject subject, User professor, String semester, String year, Integer credits, Integer maxStudents) {
        this();
        this.code = code;
        this.title = title;
        this.description = description;
        this.subject = subject;
        this.professor = professor;
        this.semester = semester;
        this.year = year;
        this.credits = credits;
        this.maxStudents = maxStudents;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }

    public User getProfessor() { return professor; }
    public void setProfessor(User professor) { this.professor = professor; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }

    public Integer getMaxStudents() { return maxStudents; }
    public void setMaxStudents(Integer maxStudents) { this.maxStudents = maxStudents; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Set<Enrollment> getEnrollments() { return enrollments; }
    public void setEnrollments(Set<Enrollment> enrollments) { this.enrollments = enrollments; }

    public Set<CourseMaterial> getMaterials() { return materials; }
    public void setMaterials(Set<CourseMaterial> materials) { this.materials = materials; }

    public Set<Query> getQueries() { return queries; }
    public void setQueries(Set<Query> queries) { this.queries = queries; }

    public Set<Project> getProjects() { return projects; }
    public void setProjects(Set<Project> projects) { this.projects = projects; }

    // Helper methods
    public int getCurrentEnrollmentCount() {
        return (int) enrollments.stream()
                .filter(Enrollment::getIsActive)
                .count();
    }

    public boolean hasAvailableSpots() {
        return getCurrentEnrollmentCount() < maxStudents;
    }

    public String getFullCode() {
        return code + " - " + title;
    }

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
