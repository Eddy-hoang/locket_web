package com.locket.dto.response;

import com.locket.model.Friendship;
import com.locket.model.Friendship.FriendshipStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendshipResponse {
    private Long id;
    private Long userId;
    private Long friendId;
    private FriendshipStatus status;
    private LocalDateTime createdAt;
    private UserResponse friend;
    
    public static FriendshipResponse fromFriendship(Friendship friendship) {
        FriendshipResponse response = new FriendshipResponse();
        response.setId(friendship.getId());
        response.setUserId(friendship.getUserId());
        response.setFriendId(friendship.getFriendId());
        response.setStatus(friendship.getStatus());
        response.setCreatedAt(friendship.getCreatedAt());
        if (friendship.getFriend() != null) {
            response.setFriend(UserResponse.fromUser(friendship.getFriend()));
        }
        return response;
    }
}