package com.locket.repository;

import com.locket.model.Friendship;
import com.locket.model.Friendship.FriendshipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    Optional<Friendship> findByUserIdAndFriendId(Long userId, Long friendId);
    List<Friendship> findByUserIdAndStatus(Long userId, FriendshipStatus status);
    List<Friendship> findByFriendIdAndStatus(Long friendId, FriendshipStatus status);
    @Query("SELECT f FROM Friendship f WHERE " +
           "(f.userId = :userId OR f.friendId = :userId) AND f.status = :status")
    List<Friendship> findAllByUserIdAndStatus(@Param("userId") Long userId, 
    @Param("status") FriendshipStatus status);
    boolean existsByUserIdAndFriendIdAndStatus(Long userId, Long friendId, FriendshipStatus status);
}
