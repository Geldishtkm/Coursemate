package com.campusmate.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.List;

public class CreateCourseRequest {

    @NotBlank(message = "Course code is required")
    @Size(max = 20, message = "Course code must not exceed 20 characters")
    private String code;

    @NotBlank(message = "Course title is required")
    @Size(max = 200, message = "Course title must not exceed 200 characters")
    private String title;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotBlank(message = "Professor name is required")
    private String professorName;

    @NotBlank(message = "Subject name is required")
    private String subjectName;

    @Size(max = 20, message = "Semester must not exceed 20 characters")
    private String semester;

    @Size(max = 10, message = "Year must not exceed 10 characters")
    private String year;

    @Positive(message = "Credits must be positive")
    private Integer credits;

    @Positive(message = "Maximum students must be positive")
    private Integer maxStudents;

    @NotBlank(message = "Difficulty level is required")
    @Size(max = 20, message = "Difficulty level must not exceed 20 characters")
    private String difficultyLevel;

    private List<String> topics;
    private List<String> prerequisites;
    private List<CourseResourceRequest> resources;

    // Nested class for resources
    public static class CourseResourceRequest {
        private String type;
        private String title;
        private String description;
        private String url;
        private String fileType;

        // Getters and Setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }

        public String getFileType() { return fileType; }
        public void setFileType(String fileType) { this.fileType = fileType; }
    }

    // Default constructor
    public CreateCourseRequest() {}

    // Getters and Setters
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getProfessorName() { return professorName; }
    public void setProfessorName(String professorName) { this.professorName = professorName; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }

    public Integer getMaxStudents() { return maxStudents; }
    public void setMaxStudents(Integer maxStudents) { this.maxStudents = maxStudents; }

    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }

    public List<String> getTopics() { return topics; }
    public void setTopics(List<String> topics) { this.topics = topics; }

    public List<String> getPrerequisites() { return prerequisites; }
    public void setPrerequisites(List<String> prerequisites) { this.prerequisites = prerequisites; }

    public List<CourseResourceRequest> getResources() { return resources; }
    public void setResources(List<CourseResourceRequest> resources) { this.resources = resources; }
}
