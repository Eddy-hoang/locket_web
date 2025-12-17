package com.locket.dto.response;

import java.time.LocalDateTime;
import com.locket.model.PhotoReport;
import lombok.Data;
@Data
public class PhotoReportResponse {
    private Long reportId;
    private Long photoId;
    private String photoUrl;
    private Long reporterId;
    private String reporterName;
    private String reason;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    
    public static PhotoReportResponse fromPhotoReport(PhotoReport report) {
        PhotoReportResponse response = new PhotoReportResponse();
        response.setReportId(report.getReportId());
        response.setPhotoId(report.getPhotoId());
        if (report.getPhoto() != null) {
            response.setPhotoUrl(report.getPhoto().getImageUrl());
        }
        response.setReporterId(report.getReporterId());
        if (report.getReporter() != null) {
            response.setReporterName(report.getReporter().getName());
        }
        response.setReason(report.getReason().toString());
        response.setDescription(report.getDescription());
        response.setStatus(report.getStatus().toString());
        response.setCreatedAt(report.getCreatedAt());
        return response;
    }
}