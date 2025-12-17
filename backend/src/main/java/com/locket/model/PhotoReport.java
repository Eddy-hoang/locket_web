package com.locket.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "photo_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhotoReport {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;
    
    @Column(name = "photo_id", nullable = false)
    private Long photoId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "photo_id", insertable = false, updatable = false)
    private Photo photo;
    
    @Column(name = "reporter_id", nullable = false)
    private Long reporterId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", insertable = false, updatable = false)
    private User reporter;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportReason reason;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status = ReportStatus.PENDING;
    
    @Column(name = "reviewed_by")
    private Long reviewedBy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by", insertable = false, updatable = false)
    private User reviewer;
    
    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    public enum ReportReason {
        INAPPROPRIATE,
        SPAM,
        VIOLENCE,
        NUDITY,
        HATE_SPEECH,
        OTHER
    }
    
    public enum ReportStatus {
        PENDING,
        REVIEWED,
        RESOLVED,
        DISMISSED
    }
}