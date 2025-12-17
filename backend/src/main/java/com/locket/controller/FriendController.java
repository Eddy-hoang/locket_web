package com.locket.controller;

import com.locket.dto.request.AddFriendRequest;
import com.locket.dto.response.ApiResponse;
import com.locket.dto.response.FriendshipResponse;
import com.locket.dto.response.UserResponse;
import com.locket.service.FriendService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friend")
@RequiredArgsConstructor
public class FriendController {
private final FriendService friendService;
    
    @PostMapping("/request")
    public ResponseEntity<ApiResponse<FriendshipResponse>> sendFriendRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AddFriendRequest request) {
        FriendshipResponse friendship = friendService.sendFriendRequest(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Friend request sent", friendship));
    }
    
    @PutMapping("/accept/{friendshipId}")
    public ResponseEntity<ApiResponse<FriendshipResponse>> acceptFriendRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long friendshipId) {
        FriendshipResponse friendship = friendService.acceptFriendRequest(userDetails.getUsername(), friendshipId);
        return ResponseEntity.ok(ApiResponse.success("Friend request accepted", friendship));
    }
    
    @PutMapping("/reject/{friendshipId}")
    public ResponseEntity<ApiResponse<Void>> rejectFriendRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long friendshipId) {
        friendService.rejectFriendRequest(userDetails.getUsername(), friendshipId);
        return ResponseEntity.ok(ApiResponse.success("Friend request rejected", null));
    }
    
    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getFriends(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<UserResponse> friends = friendService.getFriends(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Friends fetched successfully", friends));
    }
    
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<FriendshipResponse>>> getPendingRequests(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<FriendshipResponse> requests = friendService.getPendingRequests(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Pending requests fetched successfully", requests));
    }
    
    @DeleteMapping("/{friendId}")
    public ResponseEntity<ApiResponse<Void>> removeFriend(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long friendId) {
        friendService.removeFriend(userDetails.getUsername(), friendId);
        return ResponseEntity.ok(ApiResponse.success("Friend removed successfully", null));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<UserResponse>>> searchUsers(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false, defaultValue = "") String q) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.ok(ApiResponse.success("Users found", List.of()));
        }
        List<UserResponse> users = friendService.searchUsers(userDetails.getUsername(), q.trim());
        return ResponseEntity.ok(ApiResponse.success("Users found", users));
    }
}