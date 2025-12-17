package com.locket.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddReactionRequest {
    @NotNull(message = "Photo ID is required")
    private Long photoId;
    @NotBlank(message = "Emoji type is required")
    private String emojiType;
}