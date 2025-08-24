package com.campusmate.enums;

/**
 * Enum representing types of course materials
 */
public enum MaterialType {
    LECTURE("Lecture"),
    ASSIGNMENT("Assignment"),
    READING("Reading"),
    VIDEO("Video"),
    QUIZ("Quiz"),
    DOCUMENT("Document"),
    CODE("Code"),
    IMAGE("Image"),
    OTHER("Other");

    private final String displayName;

    MaterialType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static MaterialType fromString(String type) {
        try {
            return MaterialType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid material type: " + type);
        }
    }
}
