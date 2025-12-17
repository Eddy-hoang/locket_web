package com.locket.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;
    
    @Column(name = "admin_id", nullable = false)
    private Long adminId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", insertable = false, updatable = false)
    private User admin;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdminAction action;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false)
    private TargetType targetType;
    
    @Column(name = "target_id", nullable = false)
    private Long targetId;
    
    @Column(columnDefinition = "TEXT")
    private String reason;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    public enum AdminAction {
        BAN_USER,
        UNBAN_USER,
        DELETE_PHOTO,
        DELETE_USER,
        DISMISS_REPORT,
        RESOLVE_REPORT
    }
    
    public enum TargetType {
        USER,
        PHOTO,
        REPORT
    }
}