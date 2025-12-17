package com.locket.controller;

import com.locket.dto.request.AddReactionRequest;
import com.locket.dto.response.ApiResponse;
import com.locket.dto.response.ReactionResponse;
import com.locket.service.ReactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reaction")
@RequiredArgsConstructor
public class ReactionController {
 private final ReactionService reactionService;
    
 @PostMapping("/add")
    public ResponseEntity<ApiResponse<ReactionResponse>> addReaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AddReactionRequest request) {
        ReactionResponse reaction = reactionService.addReaction(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Reaction added successfully", reaction));
    }
    
    @DeleteMapping("/{reactionId}")
    public ResponseEntity<ApiResponse<Void>> removeReaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long reactionId) {
        reactionService.removeReaction(userDetails.getUsername(), reactionId);
        return ResponseEntity.ok(ApiResponse.success("Reaction removed successfully", null));
    }
    
    @GetMapping("/photo/{photoId}")
    public ResponseEntity<ApiResponse<List<ReactionResponse>>> getReactionsByPhoto(@PathVariable Long photoId) {
        List<ReactionResponse> reactions = reactionService.getReactionsByPhoto(photoId);
        return ResponseEntity.ok(ApiResponse.success("Reactions fetched successfully", reactions));
    }
    
    @PostMapping("/toggle")
    public ResponseEntity<ApiResponse<ReactionResponse>> toggleReaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AddReactionRequest request) {
        ReactionResponse reaction = reactionService.toggleReaction(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Reaction toggled successfully", reaction));
    }
}