package com.campusmate.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO for responding to a project join request
 */
public class ProjectJoinResponseDto {

    @NotNull(message = "Request ID is required")
    @NotBlank(message = "Request ID cannot be blank")
    private String requestId;

    @NotNull(message = "Action is required")
    @NotBlank(message = "Action cannot be blank")
    private String action; // "approve" or "reject"

    @Size(max = 500, message = "Response message must not exceed 500 characters")
    private String responseMessage; // Optional response message

    // Constructors
    public ProjectJoinResponseDto() {}

    public ProjectJoinResponseDto(String requestId, String action) {
        this.requestId = requestId;
        this.action = action;
    }

    public ProjectJoinResponseDto(String requestId, String action, String responseMessage) {
        this.requestId = requestId;
        this.action = action;
        this.responseMessage = responseMessage;
    }

    // Getters and Setters
    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getResponseMessage() { return responseMessage; }
    public void setResponseMessage(String responseMessage) { this.responseMessage = responseMessage; }

    // Helper methods
    public boolean isApprove() {
        return "approve".equalsIgnoreCase(this.action);
    }

    public boolean isReject() {
        return "reject".equalsIgnoreCase(this.action);
    }
}
