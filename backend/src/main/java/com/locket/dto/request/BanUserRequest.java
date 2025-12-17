package com.locket.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BanUserRequest {
    @NotBlank(message = "Reason is required")
    private String reason;
}