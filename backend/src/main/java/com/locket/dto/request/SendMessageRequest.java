package com.locket.dto.request;

import com.locket.model.Message.MessageType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SendMessageRequest {
    @NotNull(message = "Receiver ID is required")
    private Long receiverId; 
    @NotBlank(message = "Content is required")
    private String content;
    private MessageType messageType = MessageType.NORMAL;
     private Long refPhotoId;
}