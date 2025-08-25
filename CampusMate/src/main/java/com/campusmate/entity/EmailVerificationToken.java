package com.campusmate.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Entity for storing email verification tokens
 */
@Entity
@Table(name = "email_verification_tokens", indexes = {
    @Index(name = "idx_verification_token", columnList = "token", unique = true),
    @Index(name = "idx_verification_user", columnList = "user_id"),
    @Index(name = "idx_verification_expiry", columnList = "expiry")
})
@EntityListeners(AuditingEntityListener.class)
public class EmailVerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime expiry;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_used", nullable = false)
    private Boolean isUsed = false;

    // Constructors
    public EmailVerificationToken() {}

    public EmailVerificationToken(String token, User user, LocalDateTime expiry) {
        this.token = token;
        this.user = user;
        this.expiry = expiry;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDateTime getExpiry() { return expiry; }
    public void setExpiry(LocalDateTime expiry) { this.expiry = expiry; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Boolean getIsUsed() { return isUsed; }
    public void setIsUsed(Boolean isUsed) { this.isUsed = isUsed; }

    // Helper methods
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiry);
    }

    public boolean isValid() {
        return !isExpired() && !isUsed;
    }
}
