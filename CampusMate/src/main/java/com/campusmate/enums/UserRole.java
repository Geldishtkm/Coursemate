package com.campusmate.enums;

/**
 * Enum representing user roles in the CourseMate system
 */
public enum UserRole {
    STUDENT("Student"),
    TUTOR("Tutor"),
    ADMIN("Administrator");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static UserRole fromString(String role) {
        try {
            return UserRole.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid user role: " + role);
        }
    }
}
