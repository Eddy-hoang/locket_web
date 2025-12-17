package com.locket.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long messageId;
    
    @Column(name = "sender_id", nullable = false)
    private Long senderId;
    
    @Column(name = "receiver_id", nullable = false)
    private Long receiverId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", insertable = false, updatable = false)
    private User sender;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", insertable = false, updatable = false)
    private User receiver;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "message_type", nullable = false)
    private MessageType messageType = MessageType.NORMAL;
    
    @Column(name = "ref_photo_id")
    private Long refPhotoId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ref_photo_id", insertable = false, updatable = false)
    private Photo photo;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;
    
    public enum MessageType {
        NORMAL,
        PHOTO_REPLY
    }
}