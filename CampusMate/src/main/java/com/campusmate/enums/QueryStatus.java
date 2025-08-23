package com.campusmate.enums;

/**
 * Enum representing the status of discussion queries
 */
public enum QueryStatus {
    OPEN("Open"),
    ANSWERED("Answered"),
    CLOSED("Closed");

    private final String displayName;

    QueryStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static QueryStatus fromString(String status) {
        try {
            return QueryStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid query status: " + status);
        }
    }
}
