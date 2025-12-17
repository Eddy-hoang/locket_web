package com.locket.dto.response;

import com.locket.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long userId;
    private String name;
    private String email;
    private String avatar;
    private LocalDateTime createdAt;
    
    public static UserResponse fromUser(User user) {
        return new UserResponse(
            user.getUserId(),
            user.getName(),
            user.getEmail(),
            user.getAvatar(),
            user.getCreatedAt()
        );
    }
}
