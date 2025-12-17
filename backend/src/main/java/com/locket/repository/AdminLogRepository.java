package com.locket.repository;

import com.locket.model.AdminLog;
import com.locket.model.AdminLog.AdminAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AdminLogRepository extends JpaRepository<AdminLog, Long> {
    Page<AdminLog> findByAdminIdOrderByCreatedAtDesc(Long adminId, Pageable pageable);
    Page<AdminLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<AdminLog> findByActionOrderByCreatedAtDesc(AdminAction action);
    List<AdminLog> findByCreatedAtBetweenOrderByCreatedAtDesc(
        LocalDateTime start, 
        LocalDateTime end
    );
    List<AdminLog> findByTargetTypeAndTargetIdOrderByCreatedAtDesc(
        AdminLog.TargetType targetType, 
        Long targetId
    );
}