package com.locket.dto.websocket;

import lombok.Data;

@Data
public class TypingNotificationRequest {
    private Long receiverId;
    private boolean typing;
}
