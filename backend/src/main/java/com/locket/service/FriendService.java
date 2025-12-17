package com.locket.service;

import com.locket.dto.request.AddFriendRequest;
import com.locket.dto.response.FriendshipResponse;
import com.locket.dto.response.UserResponse;
import com.locket.exception.BadRequestException;
import com.locket.exception.ResourceNotFoundException;
import com.locket.model.Friendship;
import com.locket.model.Friendship.FriendshipStatus;
import com.locket.model.User;
import com.locket.repository.FriendshipRepository;
import com.locket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendService {
    
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public FriendshipResponse sendFriendRequest(String email, AddFriendRequest request) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Long userId = currentUser.getUserId();
        Long friendId = request.getFriendId();
        
        if (userId.equals(friendId)) {
            throw new BadRequestException("Cannot send friend request to yourself");
        }

        if (!userRepository.existsById(friendId)) {
            throw new ResourceNotFoundException("Friend not found");
        }
        if (friendshipRepository.findByUserIdAndFriendId(userId, friendId).isPresent()) {
            throw new BadRequestException("Friend request already exists");
        }
        Friendship friendship1 = new Friendship();
        friendship1.setUserId(userId);
        friendship1.setFriendId(friendId);
        friendship1.setStatus(FriendshipStatus.PENDING);
        
        Friendship friendship2 = new Friendship();
        friendship2.setUserId(friendId);
        friendship2.setFriendId(userId);
        friendship2.setStatus(FriendshipStatus.PENDING);
        
        Friendship saved1 = friendshipRepository.save(friendship1);
        friendshipRepository.save(friendship2);
        
        return FriendshipResponse.fromFriendship(saved1);
    }
    
    @Transactional
    public FriendshipResponse acceptFriendRequest(String email, Long friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Friendship not found"));
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
        
        // User nhận request (friendId) mới có thể accept, không phải user gửi (userId)
        if (!friendship.getFriendId().equals(userId)) {
            throw new BadRequestException("You don't have permission to accept this request");
        }
        
        // Kiểm tra status phải là PENDING
        if (friendship.getStatus() != FriendshipStatus.PENDING) {
            throw new BadRequestException("Friend request is not pending");
        }
        
        friendship.setStatus(FriendshipStatus.ACCEPTED);
        Friendship updated1 = friendshipRepository.save(friendship);
        
        // Cập nhật reverse friendship
        Friendship reverseFriendship = friendshipRepository
                .findByUserIdAndFriendId(friendship.getFriendId(), friendship.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Reverse friendship not found"));
        reverseFriendship.setStatus(FriendshipStatus.ACCEPTED);
        friendshipRepository.save(reverseFriendship);
        
        return FriendshipResponse.fromFriendship(updated1);
    }
    
    @Transactional
    public void rejectFriendRequest(String email, Long friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Friendship not found"));
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
        if (!friendship.getUserId().equals(userId)) {
            throw new BadRequestException("You don't have permission to reject this request");
        }
        friendshipRepository.delete(friendship);
        
        friendshipRepository.findByUserIdAndFriendId(friendship.getFriendId(), friendship.getUserId())
                .ifPresent(friendshipRepository::delete);
    }
    
    public List<UserResponse> getFriends(String email) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
        List<Friendship> friendships = friendshipRepository
                .findByUserIdAndStatus(userId, FriendshipStatus.ACCEPTED);
        return friendships.stream()
                .map(f -> userRepository.findById(f.getFriendId()).orElse(null))
                .filter(user -> user != null)
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
    }
    
    public List<FriendshipResponse> getPendingRequests(String email) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
        List<Friendship> pendingRequests = friendshipRepository
                .findByFriendIdAndStatus(userId, FriendshipStatus.PENDING);
        
        return pendingRequests.stream()
                .map(FriendshipResponse::fromFriendship)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void removeFriend(String email, Long friendId) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
        friendshipRepository.findByUserIdAndFriendId(userId, friendId)
                .ifPresent(friendshipRepository::delete);
        
        friendshipRepository.findByUserIdAndFriendId(friendId, userId)
                .ifPresent(friendshipRepository::delete);
    }
    
    public List<UserResponse> searchUsers(String email, String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        
        Long currentUserId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
        
        String searchQuery = query.trim().toLowerCase();
        
        // Search users by name or email, excluding current user
        // Using stream filter for now, can be optimized with custom query later
        List<User> users = userRepository.findAll().stream()
                .filter(user -> 
                    user != null &&
                    !user.getUserId().equals(currentUserId) &&
                    user.getStatus() != null &&
                    user.getStatus() == User.UserStatus.ACTIVE &&
                    user.getName() != null &&
                    user.getEmail() != null &&
                    (user.getName().toLowerCase().contains(searchQuery) ||
                     user.getEmail().toLowerCase().contains(searchQuery))
                )
                .limit(20)
                .collect(Collectors.toList());
        
        return users.stream()
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
    }
}