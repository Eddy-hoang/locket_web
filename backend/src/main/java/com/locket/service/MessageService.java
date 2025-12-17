package com.locket.service;

import com.locket.dto.request.SendMessageRequest;
import com.locket.dto.response.MessageResponse;
import com.locket.dto.response.UserResponse;
import com.locket.exception.BadRequestException;
import com.locket.exception.ResourceNotFoundException;
import com.locket.model.Message;
import com.locket.repository.MessageRepository;
import com.locket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public MessageResponse sendMessage(String email, SendMessageRequest request) {
        Long senderId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
        if (!userRepository.existsById(request.getReceiverId())) {
            throw new ResourceNotFoundException("Receiver not found");
        }
        Message message = new Message();
        message.setSenderId(senderId);
        message.setReceiverId(request.getReceiverId());
        message.setContent(request.getContent());
        message.setMessageType(request.getMessageType() != null ? 
            request.getMessageType() : Message.MessageType.NORMAL);
        message.setRefPhotoId(request.getRefPhotoId());
        message.setIsRead(false);
        
        Message savedMessage = messageRepository.save(message);
        
        return MessageResponse.fromMessage(savedMessage);
    }
    
    public List<MessageResponse> getConversation(String email, Long otherUserId, int page, int size) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
        if (!userRepository.existsById(otherUserId)) {
            throw new ResourceNotFoundException("User not found");
        }
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageRepository.findConversation(userId, otherUserId, pageable);
        
        return messages.stream()
                .map(MessageResponse::fromMessage)
                .collect(Collectors.toList());
    }
    
    public List<Map<String, Object>> getConversationList(String email) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
        List<Long> partnerIds = messageRepository.findDistinctConversationPartners(userId);
        
        return partnerIds.stream()
                .map(partnerId -> {
                    Map<String, Object> conversation = new HashMap<>();
                    userRepository.findById(partnerId).ifPresent(partner -> {
                        conversation.put("user", UserResponse.fromUser(partner));
                    });
                    Pageable pageable = PageRequest.of(0, 1);
                    Page<Message> lastMessages = messageRepository.findConversation(userId, partnerId, pageable);
                    if (!lastMessages.isEmpty()) {
                        conversation.put("lastMessage", MessageResponse.fromMessage(lastMessages.getContent().get(0)));
                    }
                    
                    return conversation;
                })
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void markAsRead(String email, Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
        if (!message.getReceiverId().equals(userId)) {
            throw new BadRequestException("You don't have permission to mark this message as read");
        }
        
        message.setIsRead(true);
        messageRepository.save(message);
    }
    
    @Transactional
    public void deleteMessage(String email, Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
        if (!message.getSenderId().equals(userId)) {
            throw new BadRequestException("You don't have permission to delete this message");
        }
        
        messageRepository.delete(message);
    }
}