package com.locket.repository;

import com.locket.model.PhotoReport;
import com.locket.model.PhotoReport.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoReportRepository extends JpaRepository<PhotoReport, Long> {
    Page<PhotoReport> findByStatus(ReportStatus status, Pageable pageable);
    List<PhotoReport> findByPhotoIdOrderByCreatedAtDesc(Long photoId);
    @Query("SELECT pr FROM PhotoReport pr " +
           "JOIN pr.photo p " +
           "WHERE p.userId = :userId " +
           "ORDER BY pr.createdAt DESC")
    List<PhotoReport> findReportsByPhotoOwner(@Param("userId") Long userId);
    long countByStatus(ReportStatus status);
    boolean existsByPhotoIdAndReporterId(Long photoId, Long reporterId);
}