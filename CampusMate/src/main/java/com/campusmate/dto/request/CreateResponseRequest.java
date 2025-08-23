package com.campusmate.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateResponseRequest {

    @NotBlank(message = "Content is required")
    @Size(max = 5000, message = "Content must not exceed 5000 characters")
    private String content;

    // Constructors
    public CreateResponseRequest() {}

    public CreateResponseRequest(String content) {
        this.content = content;
    }

    // Getters and Setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
