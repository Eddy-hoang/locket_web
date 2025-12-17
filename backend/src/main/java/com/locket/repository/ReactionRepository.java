package com.locket.repository;

import com.locket.model.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    
    List<Reaction> findByPhotoId(Long photoId);
    
    Optional<Reaction> findByPhotoIdAndUserIdAndEmojiType(Long photoId, Long userId, String emojiType);
    
    Optional<Reaction> findByPhotoIdAndUserId(Long photoId, Long userId);
    
    void deleteByPhotoIdAndUserId(Long photoId, Long userId);
}