package com.locket.service;

import com.locket.dto.response.ApiResponse;
import com.locket.exception.ResourceNotFoundException;
import com.locket.model.Notification;
import com.locket.repository.NotificationRepository;
import com.locket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public Notification createNotification(Long userId, 
        Notification.NotificationType type,
        String content,
        Long refId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(type);
        notification.setContent(content);
        notification.setRefId(refId);
        notification.setIsRead(false);
        
        return notificationRepository.save(notification);
    }
    
    public List<Notification> getNotifications(String email) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
        
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<Notification> getUnreadNotifications(String email) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
        
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }
    
    public long getUnreadCount(String email) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
        
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
    
    @Transactional
    public void markAsRead(String email, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
        
        if (!notification.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Unauthorized");
        }
        
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
    
    @Transactional
    public void markAllAsRead(String email) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
        
        List<Notification> notifications = notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        
        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }
}