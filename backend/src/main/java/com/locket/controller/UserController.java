package com.locket.controller;

import com.locket.dto.request.UpdateNameRequest;
import com.locket.dto.response.ApiResponse;
import com.locket.dto.response.UserResponse;
import com.locket.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        UserResponse user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("User fetched successfully", user));
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long userId) {
        UserResponse user = userService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.success("User fetched successfully", user));
    }
    
    @PutMapping("/update-name")
    public ResponseEntity<ApiResponse<UserResponse>> updateName(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateNameRequest request) {
        UserResponse user = userService.updateName(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Name updated successfully", user));
    }
    
    @PostMapping("/avatar")
    public ResponseEntity<ApiResponse<UserResponse>> updateAvatar(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {
        UserResponse user = userService.updateAvatar(userDetails.getUsername(), file);
        return ResponseEntity.ok(ApiResponse.success("Avatar updated successfully", user));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<UserResponse>>> searchUsers(
            @RequestParam("q") String query) {
        List<UserResponse> users = userService.searchUsers(query);
        return ResponseEntity.ok(ApiResponse.success("Users fetched successfully", users));
    }
}