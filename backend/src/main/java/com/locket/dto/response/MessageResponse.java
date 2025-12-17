package com.locket.dto.response;

import com.locket.model.Message;
import com.locket.model.Message.MessageType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private Long messageId;
    private Long senderId;
    private Long receiverId;
    private String content;
    private MessageType messageType;
    private Long refPhotoId;
    private LocalDateTime createdAt;
    private Boolean isRead;
    private UserResponse sender;
    private PhotoResponse photo;
    
    public static MessageResponse fromMessage(Message message) {
        MessageResponse response = new MessageResponse();
        response.setMessageId(message.getMessageId());
        response.setSenderId(message.getSenderId());
        response.setReceiverId(message.getReceiverId());
        response.setContent(message.getContent());
        response.setMessageType(message.getMessageType());
        response.setRefPhotoId(message.getRefPhotoId());
        response.setCreatedAt(message.getCreatedAt());
        response.setIsRead(message.getIsRead());
        if (message.getSender() != null) {
            response.setSender(UserResponse.fromUser(message.getSender()));
        }
        if (message.getPhoto() != null) {
            response.setPhoto(PhotoResponse.fromPhoto(message.getPhoto()));
        }
        return response;
    }
}
