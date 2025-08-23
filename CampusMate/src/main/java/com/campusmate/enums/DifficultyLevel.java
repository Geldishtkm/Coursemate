package com.campusmate.enums;

/**
 * Enum representing difficulty levels for subjects and courses
 */
public enum DifficultyLevel {
    BEGINNER("Beginner"),
    INTERMEDIATE("Intermediate"),
    ADVANCED("Advanced");

    private final String displayName;

    DifficultyLevel(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static DifficultyLevel fromString(String difficulty) {
        try {
            return DifficultyLevel.valueOf(difficulty.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid difficulty level: " + difficulty);
        }
    }
}
