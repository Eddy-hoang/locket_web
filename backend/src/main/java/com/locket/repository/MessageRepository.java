package com.locket.repository;

import com.locket.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> { 
    @Query("SELECT m FROM Message m WHERE " +
           "(m.senderId = :userId1 AND m.receiverId = :userId2) OR " +
           "(m.senderId = :userId2 AND m.receiverId = :userId1) " +
           "ORDER BY m.createdAt ASC")
    Page<Message> findConversation(@Param("userId1") Long userId1, 
       @Param("userId2") Long userId2, 
       Pageable pageable);
    
    @Query("SELECT DISTINCT CASE " +
           "WHEN m.senderId = :userId THEN m.receiverId " +
           "ELSE m.senderId END " +
           "FROM Message m WHERE m.senderId = :userId OR m.receiverId = :userId")
    List<Long> findDistinctConversationPartners(@Param("userId") Long userId);
}
