package com.locket.controller;

import com.locket.dto.request.BanUserRequest;
import com.locket.dto.request.DeletePhotoRequest;
import com.locket.dto.response.*;
import com.locket.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") 
public class AdminController {
 private final AdminService adminService;
    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Stats fetched successfully", stats));
    }
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserResponse> users = adminService.getAllUsers(pageable);
        return ResponseEntity.ok(ApiResponse.success("Users fetched successfully", users));
    }
    
    @GetMapping("/users/search")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> searchUsers(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserResponse> users = adminService.searchUsers(query, pageable);
        return ResponseEntity.ok(ApiResponse.success("Users found", users));
    }
    
    @PostMapping("/users/{userId}/ban")
    public ResponseEntity<ApiResponse<Void>> banUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long userId,
            @Valid @RequestBody BanUserRequest request) {
        adminService.banUser(userDetails.getUsername(), userId, request);
        return ResponseEntity.ok(ApiResponse.success("User banned successfully", null));
    }
    
    @PostMapping("/users/{userId}/unban")
    public ResponseEntity<ApiResponse<Void>> unbanUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long userId) {
        adminService.unbanUser(userDetails.getUsername(), userId);
        return ResponseEntity.ok(ApiResponse.success("User unbanned successfully", null));
    }
    
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long userId,
            @RequestParam(required = false) String reason) {
        adminService.deleteUser(userDetails.getUsername(), userId, reason);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }
    
    // ==================== PHOTO MANAGEMENT ====================
    
    @GetMapping("/photos/reported")
    public ResponseEntity<ApiResponse<Page<PhotoReportResponse>>> getReportedPhotos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PhotoReportResponse> reports = adminService.getReportedPhotos(pageable);
        return ResponseEntity.ok(ApiResponse.success("Reported photos fetched successfully", reports));
    }
    
    @DeleteMapping("/photos/{photoId}")
    public ResponseEntity<ApiResponse<Void>> deletePhoto(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long photoId,
            @Valid @RequestBody DeletePhotoRequest request) {
        adminService.deletePhoto(userDetails.getUsername(), photoId, request);
        return ResponseEntity.ok(ApiResponse.success("Photo deleted successfully", null));
    }
    
    @PostMapping("/reports/{reportId}/dismiss")
    public ResponseEntity<ApiResponse<Void>> dismissReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long reportId,
            @RequestParam(required = false) String reason) {
        adminService.dismissReport(userDetails.getUsername(), reportId, reason);
        return ResponseEntity.ok(ApiResponse.success("Report dismissed successfully", null));
    }
    
    // ==================== LOGS ====================
    
    @GetMapping("/logs")
    public ResponseEntity<ApiResponse<Page<AdminLogResponse>>> getAdminLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AdminLogResponse> logs = adminService.getAdminLogs(pageable);
        return ResponseEntity.ok(ApiResponse.success("Logs fetched successfully", logs));
    }
}