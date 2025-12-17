package com.locket.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "photos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Photo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long photoId;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
    
    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;
    
    @Column(name = "is_reported", nullable = false)
    private Boolean isReported = false;
    
    @Column(name = "report_count", nullable = false)
    private Integer reportCount = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PhotoStatus status = PhotoStatus.ACTIVE;
    
    @Column(name = "deleted_by")
    private Long deletedBy;
    
    @Column(name = "deleted_reason", columnDefinition = "TEXT")
    private String deletedReason;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    public enum PhotoStatus {
        ACTIVE,
        HIDDEN,
        DELETED
    }
}