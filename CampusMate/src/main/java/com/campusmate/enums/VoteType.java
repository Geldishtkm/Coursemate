package com.campusmate.enums;

/**
 * Enum representing types of votes and targets
 */
public enum VoteType {
    UPVOTE("Upvote"),
    DOWNVOTE("Downvote"),
    QUERY("Query"),
    RESPONSE("Response");

    private final String displayName;

    VoteType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static VoteType fromString(String type) {
        try {
            return VoteType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid vote type: " + type);
        }
    }
}
