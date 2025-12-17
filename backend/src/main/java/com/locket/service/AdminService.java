package com.locket.service;

import com.locket.dto.request.BanUserRequest;
import com.locket.dto.request.DeletePhotoRequest;
import com.locket.dto.request.ReportPhotoRequest;
import com.locket.dto.response.*;
import com.locket.exception.BadRequestException;
import com.locket.exception.ResourceNotFoundException;
import com.locket.model.*;
import com.locket.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminService {
    
    private final UserRepository userRepository;
    private final PhotoRepository photoRepository;
    private final PhotoReportRepository photoReportRepository;
    private final AdminLogRepository adminLogRepository;
    
    public DashboardStatsResponse getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        
        stats.setTotalUsers(userRepository.countByRole(User.UserRole.USER));
        stats.setActiveUsers(userRepository.countByStatus(User.UserStatus.ACTIVE));
        stats.setBannedUsers(userRepository.countByStatus(User.UserStatus.BANNED));
        stats.setTotalPhotos(photoRepository.countByStatus(Photo.PhotoStatus.ACTIVE));
        stats.setReportedPhotos(photoReportRepository.countByStatus(PhotoReport.ReportStatus.PENDING));
        
        return stats;
    }
    
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findByRole(User.UserRole.USER, pageable)
                .map(UserResponse::fromUser);
    }
    
    public Page<UserResponse> searchUsers(String query, Pageable pageable) {
        return userRepository.searchUsers(query, pageable)
                .map(UserResponse::fromUser);
    }
    
    @Transactional
    public void banUser(String adminEmail, Long userId, BanUserRequest request) {
        User admin = getAdminByEmail(adminEmail);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (user.getRole() == User.UserRole.ADMIN) {
            throw new BadRequestException("Cannot ban admin user");
        }
        
        user.setStatus(User.UserStatus.BANNED);
        user.setBannedReason(request.getReason());
        user.setBannedAt(LocalDateTime.now());
        user.setBannedBy(admin.getUserId()); 
        userRepository.save(user);
        logAdminAction(admin.getUserId(), AdminLog.AdminAction.BAN_USER, 
                      AdminLog.TargetType.USER, userId, request.getReason());
    }
    
    @Transactional
    public void unbanUser(String adminEmail, Long userId) {
        User admin = getAdminByEmail(adminEmail);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setStatus(User.UserStatus.ACTIVE);
        user.setBannedReason(null);
        user.setBannedAt(null);
        user.setBannedBy(null);
        userRepository.save(user);
        logAdminAction(admin.getUserId(), AdminLog.AdminAction.UNBAN_USER,
                      AdminLog.TargetType.USER, userId, "Unbanned user");
    }
    
    @Transactional
    public void deleteUser(String adminEmail, Long userId, String reason) {
        User admin = getAdminByEmail(adminEmail);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (user.getRole() == User.UserRole.ADMIN) {
            throw new BadRequestException("Cannot delete admin user");
        }
        userRepository.delete(user);
        logAdminAction(admin.getUserId(), AdminLog.AdminAction.DELETE_USER,
                      AdminLog.TargetType.USER, userId, reason);
    }
    
    public Page<PhotoReportResponse> getReportedPhotos(Pageable pageable) {
        return photoReportRepository
                .findByStatus(PhotoReport.ReportStatus.PENDING, pageable)
                .map(PhotoReportResponse::fromPhotoReport);
    }
    
    @Transactional
    public void deletePhoto(String adminEmail, Long photoId, DeletePhotoRequest request) {
        User admin = getAdminByEmail(adminEmail);
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Photo not found"));
        
        photo.setStatus(Photo.PhotoStatus.DELETED);
        photo.setDeletedBy(admin.getUserId());
        photo.setDeletedReason(request.getReason());
        photo.setDeletedAt(LocalDateTime.now());
        photoRepository.save(photo);
        photoReportRepository.findByPhotoIdOrderByCreatedAtDesc(photoId)
                .forEach(report -> {
                    report.setStatus(PhotoReport.ReportStatus.RESOLVED);
                    report.setReviewedBy(admin.getUserId());
                    report.setReviewedAt(LocalDateTime.now());
                    photoReportRepository.save(report);
                });
        logAdminAction(admin.getUserId(), AdminLog.AdminAction.DELETE_PHOTO,
                      AdminLog.TargetType.PHOTO, photoId, request.getReason());
    }
    
    @Transactional
    public void dismissReport(String adminEmail, Long reportId, String reason) {
        User admin = getAdminByEmail(adminEmail);
        PhotoReport report = photoReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        
        report.setStatus(PhotoReport.ReportStatus.DISMISSED);
        report.setReviewedBy(admin.getUserId());
        report.setReviewedAt(LocalDateTime.now());
    
        photoReportRepository.save(report);
        Photo photo = photoRepository.findById(report.getPhotoId())
                .orElseThrow(() -> new ResourceNotFoundException("Photo not found"));
        photo.setReportCount(Math.max(0, photo.getReportCount() - 1));
        if (photo.getReportCount() == 0) {
            photo.setIsReported(false);
        }
        photoRepository.save(photo);
        logAdminAction(admin.getUserId(), AdminLog.AdminAction.DISMISS_REPORT,
                      AdminLog.TargetType.REPORT, reportId, reason);
    }
    @Transactional
    public void reportPhoto(String userEmail, Long photoId, ReportPhotoRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Photo not found"));
        if (photoReportRepository.existsByPhotoIdAndReporterId(photoId, user.getUserId())) {
            throw new BadRequestException("You have already reported this photo");
        }
        PhotoReport report = new PhotoReport();
        report.setPhotoId(photoId);
        report.setReporterId(user.getUserId());
        report.setReason(request.getReason());
        report.setDescription(request.getDescription());
        report.setStatus(PhotoReport.ReportStatus.PENDING);
        
        photoReportRepository.save(report);
        photo.setIsReported(true);
        photo.setReportCount(photo.getReportCount() + 1);
        photoRepository.save(photo);
    }
    public Page<AdminLogResponse> getAdminLogs(Pageable pageable) {
        return adminLogRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(AdminLogResponse::fromAdminLog);
    }
    
    private void logAdminAction(Long adminId, AdminLog.AdminAction action, 
                                AdminLog.TargetType targetType, Long targetId, String reason) {
        AdminLog log = new AdminLog();
        log.setAdminId(adminId);
        log.setAction(action);
        log.setTargetType(targetType);
        log.setTargetId(targetId);
        log.setReason(reason);
        
        adminLogRepository.save(log);
    }
    
    private User getAdminByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (user.getRole() != User.UserRole.ADMIN) {
            throw new BadRequestException("Access denied: Admin role required");
        }
        
        return user;
    }
}