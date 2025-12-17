package com.locket.dto.response;

import lombok.Data;

@Data
public class DashboardStatsResponse {
    private Long totalUsers;
    private Long activeUsers;
    private Long bannedUsers;
    private Long totalPhotos;
    private Long reportedPhotos;
}

