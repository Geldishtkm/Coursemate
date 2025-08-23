package com.campusmate.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
 * Response entity representing answers to discussion queries
 */
@Entity
@Table(name = "responses", indexes = {
    @Index(name = "idx_response_query", columnList = "query_id"),
    @Index(name = "idx_response_author", columnList = "author_id"),
    @Index(name = "idx_response_accepted", columnList = "is_accepted")
})
@EntityListeners(AuditingEntityListener.class)
public class Response {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotNull(message = "Query is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "query_id", nullable = false)
    @JsonBackReference
    private Query query;

    @NotNull(message = "Author is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    @JsonBackReference
    private User author;

    @NotBlank(message = "Content is required")
    @Size(max = 5000, message = "Content must not exceed 5000 characters")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "is_accepted", nullable = false)
    private Boolean isAccepted = false;

    @Column(nullable = false)
    private Integer upvotes = 0;

    @Column(nullable = false)
    private Integer downvotes = 0;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Relationships
    // Note: Votes are managed through targetId/targetType, not direct entity relationships
    // @OneToMany(mappedBy = "target", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // private Set<Vote> votes = new HashSet<>();

    // Constructors
    public Response() {
        this.isAccepted = false;
        this.upvotes = 0;
        this.downvotes = 0;
        // this.votes = new HashSet<>(); // Removed - votes are managed through targetId/targetType
    }

    public Response(Query query, User author, String content) {
        this();
        this.query = query;
        this.author = author;
        this.content = content;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Query getQuery() { return query; }
    public void setQuery(Query query) { this.query = query; }

    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Boolean getIsAccepted() { return isAccepted; }
    public void setIsAccepted(Boolean isAccepted) { this.isAccepted = isAccepted; }

    public Integer getUpvotes() { return upvotes; }
    public void setUpvotes(Integer upvotes) { this.upvotes = upvotes; }

    public Integer getDownvotes() { return downvotes; }
    public void setDownvotes(Integer downvotes) { this.downvotes = downvotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

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
