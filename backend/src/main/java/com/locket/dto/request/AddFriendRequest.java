package com.locket.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddFriendRequest {
    @NotNull(message = "Friend ID is required")
    private Long friendId;
}