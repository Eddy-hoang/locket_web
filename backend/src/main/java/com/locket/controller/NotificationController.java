package com.locket.controller;

import com.locket.dto.response.ApiResponse;
import com.locket.model.Notification;
import com.locket.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
public class NotificationController {
 private final NotificationService notificationService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<Notification> notifications = notificationService.getNotifications(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched successfully", notifications));
    }
    
    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<Notification>>> getUnreadNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<Notification> notifications = notificationService.getUnreadNotifications(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Unread notifications fetched successfully", notifications));
    }
    
    @GetMapping("/unread/count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @AuthenticationPrincipal UserDetails userDetails) {
        long count = notificationService.getUnreadCount(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Unread count fetched successfully", count));
    }
    
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long notificationId) {
        notificationService.markAsRead(userDetails.getUsername(), notificationId);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }
    
    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.markAllAsRead(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }
}