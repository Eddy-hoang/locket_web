package com.locket.dto.response;

import com.locket.model.Reaction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReactionResponse {
    private Long reactionId;
    private Long photoId;
    private Long userId;
    private String emojiType;
    private LocalDateTime createdAt;
    private UserResponse user;
    
    public static ReactionResponse fromReaction(Reaction reaction) {
        ReactionResponse response = new ReactionResponse();
        response.setReactionId(reaction.getReactionId());
        response.setPhotoId(reaction.getPhotoId());
        response.setUserId(reaction.getUserId());
        response.setEmojiType(reaction.getEmojiType());
        response.setCreatedAt(reaction.getCreatedAt());
        if (reaction.getUser() != null) {
            response.setUser(UserResponse.fromUser(reaction.getUser()));
        }
        return response;
    }
}
