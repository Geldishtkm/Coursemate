package com.campusmate.entity;

import com.campusmate.enums.QueryStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Query entity representing discussion board questions
 */
@Entity
@Table(name = "queries", indexes = {
    @Index(name = "idx_query_author", columnList = "author_id"),
    @Index(name = "idx_query_course", columnList = "course_id"),
    @Index(name = "idx_query_category", columnList = "category"),
    @Index(name = "idx_query_status", columnList = "status"),
    @Index(name = "idx_query_created", columnList = "created_at")
})
@EntityListeners(AuditingEntityListener.class)
public class Query {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Content is required")
    @Size(max = 5000, message = "Content must not exceed 5000 characters")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category must not exceed 100 characters")
    @Column(nullable = false)
    private String category;

    @NotNull(message = "Author is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    @JsonBackReference
    private User author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QueryStatus status;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "query_tags", joinColumns = @JoinColumn(name = "query_id"))
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>();

    @Column(nullable = false)
    private Integer upvotes = 0;

    @Column(nullable = false)
    private Integer downvotes = 0;

    @Column(name = "response_count", nullable = false)
    private Integer responseCount = 0;

    @Column(name = "is_solved", nullable = false)
    private Boolean isSolved = false;

    @Column(name = "solved_at")
    private LocalDateTime solvedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solved_by")
    private User solvedBy;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Relationships
    @OneToMany(mappedBy = "query", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Response> responses = new HashSet<>();

    // Note: Votes are managed through targetId/targetType, not direct entity relationships
    // @OneToMany(mappedBy = "target", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // private Set<Vote> votes = new HashSet<>();

    // Constructors
    public Query() {
        this.upvotes = 0;
        this.downvotes = 0;
        this.responseCount = 0;
        this.isSolved = false;
        this.tags = new HashSet<>();
        this.responses = new HashSet<>();
        // this.votes = new HashSet<>(); // Removed - votes are managed through targetId/targetType
    }

    public Query(String title, String content, String category, User author, Course course, QueryStatus status) {
        this();
        this.title = title;
        this.content = content;
        this.category = category;
        this.author = author;
        this.course = course;
        this.status = status;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public QueryStatus getStatus() { return status; }
    public void setStatus(QueryStatus status) { this.status = status; }

    public Set<String> getTags() { return tags; }
    public void setTags(Set<String> tags) { this.tags = tags; }

    public Integer getUpvotes() { return upvotes; }
    public void setUpvotes(Integer upvotes) { this.upvotes = upvotes; }

    public Integer getDownvotes() { return downvotes; }
    public void setDownvotes(Integer downvotes) { this.downvotes = downvotes; }

    public Integer getResponseCount() { return responseCount; }
    public void setResponseCount(Integer responseCount) { this.responseCount = responseCount; }

    public Boolean getIsSolved() { return isSolved; }
    public void setIsSolved(Boolean isSolved) { this.isSolved = isSolved; }

    public LocalDateTime getSolvedAt() { return solvedAt; }
    public void setSolvedAt(LocalDateTime solvedAt) { this.solvedAt = solvedAt; }

    public User getSolvedBy() { return solvedBy; }
    public void setSolvedBy(User solvedBy) { this.solvedBy = solvedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Set<Response> getResponses() { return responses; }
    public void setResponses(Set<Response> responses) { this.responses = responses; }

    // Note: Votes are managed through targetId/targetType, not direct entity relationships
    // public Set<Vote> getVotes() { return votes; }
    // public void setVotes(Set<Vote> votes) { this.votes = votes; }

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
