package com.locket.dto.request;
import com.locket.model.PhotoReport;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReportPhotoRequest {
    @NotNull(message = "Reason is required")
    private PhotoReport.ReportReason reason;
    private String description;
}