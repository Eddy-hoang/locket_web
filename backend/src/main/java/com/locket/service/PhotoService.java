package com.locket.service;

import com.locket.dto.response.PhotoResponse;
import com.locket.dto.response.ReactionResponse;
import com.locket.exception.BadRequestException;
import com.locket.exception.ResourceNotFoundException;
import com.locket.model.Photo;
import com.locket.model.Reaction;
import com.locket.repository.PhotoRepository;
import com.locket.repository.ReactionRepository;
import com.locket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhotoService {
    
    private final PhotoRepository photoRepository;
    private final ReactionRepository reactionRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    
    @Transactional
    public PhotoResponse uploadPhoto(String email, MultipartFile file) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }
       
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("File must be an image");
        }
        
        String fileName = fileStorageService.storeFile(file);
        Photo photo = new Photo();
        photo.setUserId(userId);
        photo.setImageUrl(fileName);
        Photo savedPhoto = photoRepository.save(photo);
        return PhotoResponse.fromPhoto(savedPhoto);
    }
    
    public List<PhotoResponse> getFeed(String email, int page, int size) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
        Pageable pageable = PageRequest.of(page, size);
        Page<Photo> photos = photoRepository.findFeedPhotos(userId, pageable);
        
        return photos.stream()
                .map(this::convertToPhotoResponseWithReactions)
                .collect(Collectors.toList());
    }
    
    public PhotoResponse getPhotoById(Long photoId) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Photo not found"));
        
        return convertToPhotoResponseWithReactions(photo);
    }
    
    public List<PhotoResponse> getPhotosByUser(Long userId) {
        List<Photo> photos = photoRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        return photos.stream()
                .map(this::convertToPhotoResponseWithReactions)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void deletePhoto(String email, Long photoId) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Photo not found"));
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
        
        if (!photo.getUserId().equals(userId)) {
            throw new BadRequestException("You don't have permission to delete this photo");
        }
        fileStorageService.deleteFile(photo.getImageUrl());
        photoRepository.delete(photo);
    }
    
    private PhotoResponse convertToPhotoResponseWithReactions(Photo photo) {
        PhotoResponse response = PhotoResponse.fromPhoto(photo);
        List<Reaction> reactions = reactionRepository.findByPhotoId(photo.getPhotoId());
        response.setReactions(
            reactions.stream()
                .map(ReactionResponse::fromReaction)
                .collect(Collectors.toList())
        );
        Map<String, Long> reactionCount = new HashMap<>();
        for (Reaction reaction : reactions) {
            reactionCount.put(
                reaction.getEmojiType(),
                reactionCount.getOrDefault(reaction.getEmojiType(), 0L) + 1
            );
        }
        response.setReactionCount(reactionCount);
        return response;
    }
}