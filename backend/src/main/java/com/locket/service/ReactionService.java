package com.locket.service;

import com.locket.dto.request.AddReactionRequest;
import com.locket.dto.response.ReactionResponse;
import com.locket.exception.ResourceNotFoundException;
import com.locket.model.Reaction;
import com.locket.repository.PhotoRepository;
import com.locket.repository.ReactionRepository;
import com.locket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReactionService {
    
    private final ReactionRepository reactionRepository;
    private final PhotoRepository photoRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public ReactionResponse addReaction(String email, AddReactionRequest request) {
   
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
        
        if (!photoRepository.existsById(request.getPhotoId())) {
            throw new ResourceNotFoundException("Photo not found");
        }
        
        Optional<Reaction> existingReaction = reactionRepository
                .findByPhotoIdAndUserIdAndEmojiType(request.getPhotoId(), userId, request.getEmojiType());
        
        if (existingReaction.isPresent()) {
         
            return ReactionResponse.fromReaction(existingReaction.get());
        }
        
        Reaction reaction = new Reaction();
        reaction.setPhotoId(request.getPhotoId());
        reaction.setUserId(userId);
        reaction.setEmojiType(request.getEmojiType());
        
        Reaction savedReaction = reactionRepository.save(reaction);
        
        return ReactionResponse.fromReaction(savedReaction);
    }
    
    @Transactional
    public void removeReaction(String email, Long reactionId) {
        Reaction reaction = reactionRepository.findById(reactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Reaction not found"));
     
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
 
        if (!reaction.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("You don't have permission to remove this reaction");
        }
        
        reactionRepository.delete(reaction);
    }
    
    public List<ReactionResponse> getReactionsByPhoto(Long photoId) {
        if (!photoRepository.existsById(photoId)) {
            throw new ResourceNotFoundException("Photo not found");
        }
        
        List<Reaction> reactions = reactionRepository.findByPhotoId(photoId);
        
        return reactions.stream()
                .map(ReactionResponse::fromReaction)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ReactionResponse toggleReaction(String email, AddReactionRequest request) {
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getUserId();
    
        if (!photoRepository.existsById(request.getPhotoId())) {
            throw new ResourceNotFoundException("Photo not found");
        }
   
        Optional<Reaction> existingReaction = reactionRepository
                .findByPhotoIdAndUserId(request.getPhotoId(), userId);
        
        if (existingReaction.isPresent()) {
            Reaction existing = existingReaction.get();
      
            if (existing.getEmojiType().equals(request.getEmojiType())) {
                reactionRepository.delete(existing);
                return null; 
            } else {
            
                existing.setEmojiType(request.getEmojiType());
                Reaction updated = reactionRepository.save(existing);
                return ReactionResponse.fromReaction(updated);
            }
        } else {
        
            Reaction reaction = new Reaction();
            reaction.setPhotoId(request.getPhotoId());
            reaction.setUserId(userId);
            reaction.setEmojiType(request.getEmojiType());
            
            Reaction savedReaction = reactionRepository.save(reaction);
            return ReactionResponse.fromReaction(savedReaction);
        }
    }
}