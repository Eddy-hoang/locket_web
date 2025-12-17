package com.locket.controller;

import com.locket.dto.request.SendMessageRequest;
import com.locket.dto.response.ApiResponse;
import com.locket.dto.response.MessageResponse;
import com.locket.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/message")
@RequiredArgsConstructor
public class MessageController {
private final MessageService messageService;
    
    @PostMapping("/send")
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SendMessageRequest request) {
        MessageResponse message = messageService.sendMessage(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Message sent successfully", message));
    }
    
    @GetMapping("/conversation/{userId}")
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getConversation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        List<MessageResponse> messages = messageService.getConversation(
                userDetails.getUsername(), userId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Conversation fetched successfully", messages));
    }
    
    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getConversationList(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<Map<String, Object>> conversations = messageService.getConversationList(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Conversations fetched successfully", conversations));
    }
    
    @PutMapping("/read/{messageId}")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long messageId) {
        messageService.markAsRead(userDetails.getUsername(), messageId);
        return ResponseEntity.ok(ApiResponse.success("Message marked as read", null));
    }
    
    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long messageId) {
        messageService.deleteMessage(userDetails.getUsername(), messageId);
        return ResponseEntity.ok(ApiResponse.success("Message deleted successfully", null));
    }
}