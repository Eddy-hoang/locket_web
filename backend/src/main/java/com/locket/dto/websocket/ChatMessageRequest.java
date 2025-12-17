package com.locket.dto.websocket;

import com.locket.model.Message.MessageType;
import lombok.Data;

@Data
public class ChatMessageRequest {
    private Long receiverId;
    private String content;
    private MessageType messageType;
    private Long refPhotoId;
}
