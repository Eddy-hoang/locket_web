package com.locket.repository;

import com.locket.model.Photo;
import com.locket.model.Photo.PhotoStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    
    List<Photo> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT p FROM Photo p WHERE p.userId IN " +
           "(SELECT f.friendId FROM Friendship f WHERE f.userId = :userId AND f.status = 'ACCEPTED') " +
           "AND p.status = 'ACTIVE' " +
           "ORDER BY p.createdAt DESC")
    Page<Photo> findFeedPhotos(@Param("userId") Long userId, Pageable pageable);
    Page<Photo> findByIsReportedTrueAndStatusOrderByReportCountDescCreatedAtDesc(
        PhotoStatus status, 
        Pageable pageable
    );
    Page<Photo> findByStatusOrderByCreatedAtDesc(PhotoStatus status, Pageable pageable);
    long countByIsReportedTrueAndStatus(PhotoStatus status);
    long countByStatus(PhotoStatus status);
}