package com.locket.dto.response;

import java.time.LocalDateTime;

import com.locket.model.AdminLog;

import lombok.Data;
@Data
public class AdminLogResponse {
    private Long logId;
    private String adminName;
    private String action;
    private String targetType;
    private Long targetId;
    private String reason;
    private LocalDateTime createdAt;
    
    public static AdminLogResponse fromAdminLog(AdminLog log) {
        AdminLogResponse response = new AdminLogResponse();
        response.setLogId(log.getLogId());
        if (log.getAdmin() != null) {
            response.setAdminName(log.getAdmin().getName());
        }
        response.setAction(log.getAction().toString());
        response.setTargetType(log.getTargetType().toString());
        response.setTargetId(log.getTargetId());
        response.setReason(log.getReason());
        response.setCreatedAt(log.getCreatedAt());
        return response;
    }
}