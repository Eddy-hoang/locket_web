package com.locket.controller;

import com.locket.dto.request.ReportPhotoRequest;
import com.locket.dto.response.*;
import com.locket.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/report")
@RequiredArgsConstructor
public class ReportController {
private final AdminService adminService;
    
 @PostMapping("/photo/{photoId}")
    public ResponseEntity<ApiResponse<Void>> reportPhoto(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long photoId,
            @Valid @RequestBody ReportPhotoRequest request) {
        adminService.reportPhoto(userDetails.getUsername(), photoId, request);
        return ResponseEntity.ok(ApiResponse.success("Photo reported successfully", null));
    }
}