package com.locket.dto.response;

import com.locket.model.Photo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhotoResponse {
    private Long photoId;
    private Long userId;
    private String imageUrl;
    private LocalDateTime createdAt;
    private UserResponse user;
    private List<ReactionResponse> reactions;
    private Map<String, Long> reactionCount;
    
    public static PhotoResponse fromPhoto(Photo photo) {
        PhotoResponse response = new PhotoResponse();
        response.setPhotoId(photo.getPhotoId());
        response.setUserId(photo.getUserId());
        response.setImageUrl(photo.getImageUrl());
        response.setCreatedAt(photo.getCreatedAt());
        if (photo.getUser() != null) {
            response.setUser(UserResponse.fromUser(photo.getUser()));
        }
        return response;
    }
}