package com.campusmate.enums;

/**
 * Enum representing the status of collaborative projects
 */
public enum ProjectStatus {
    RECRUITING("Recruiting"),
    ACTIVE("Active"),
    COMPLETED("Completed"),
    PAUSED("Paused");

    private final String displayName;

    ProjectStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static ProjectStatus fromString(String status) {
        try {
            return ProjectStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid project status: " + status);
        }
    }
}
