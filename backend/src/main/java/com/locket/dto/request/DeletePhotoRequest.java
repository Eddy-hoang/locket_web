package com.locket.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeletePhotoRequest {
    @NotBlank(message = "Reason is required")
    private String reason;
}