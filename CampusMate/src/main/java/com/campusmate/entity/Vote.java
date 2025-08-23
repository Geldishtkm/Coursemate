package com.campusmate.entity;

import com.campusmate.enums.VoteType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Vote entity representing upvotes and downvotes on queries and responses
 */
@Entity
@Table(name = "votes", indexes = {
    @Index(name = "idx_vote_user", columnList = "user_id"),
    @Index(name = "idx_vote_target", columnList = "target_type, target_id"),
    @Index(name = "idx_vote_unique", columnList = "user_id, target_type, target_id", unique = true)
})
@EntityListeners(AuditingEntityListener.class)
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @NotNull(message = "Target type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false)
    private VoteType targetType;

    @NotNull(message = "Target ID is required")
    @Column(name = "target_id", nullable = false)
    private String targetId;

    @NotNull(message = "Vote type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "vote_type", nullable = false)
    private VoteType voteType;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Constructors
    public Vote() {}

    public Vote(User user, VoteType targetType, String targetId, VoteType voteType) {
        this.user = user;
        this.targetType = targetType;
        this.targetId = targetId;
        this.voteType = voteType;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public VoteType getTargetType() { return targetType; }
    public void setTargetType(VoteType targetType) { this.targetType = targetType; }

    public String getTargetId() { return targetId; }
    public void setTargetId(String targetId) { this.targetId = targetId; }

    public VoteType getVoteType() { return voteType; }
    public void setVoteType(VoteType voteType) { this.voteType = voteType; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
