package com.locket.controller;

import com.locket.dto.response.ApiResponse;
import com.locket.dto.response.PhotoResponse;
import com.locket.service.PhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/photo")
@RequiredArgsConstructor
public class PhotoController {
     private final PhotoService photoService;
    
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<PhotoResponse>> uploadPhoto(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {
        PhotoResponse photo = photoService.uploadPhoto(userDetails.getUsername(), file);
        return ResponseEntity.ok(ApiResponse.success("Photo uploaded successfully", photo));
    }
    
    @GetMapping("/feed")
    public ResponseEntity<ApiResponse<List<PhotoResponse>>> getFeed(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<PhotoResponse> photos = photoService.getFeed(userDetails.getUsername(), page, size);
        return ResponseEntity.ok(ApiResponse.success("Feed fetched successfully", photos));
    }
    
    @GetMapping("/{photoId}")
    public ResponseEntity<ApiResponse<PhotoResponse>> getPhotoById(@PathVariable Long photoId) {
        PhotoResponse photo = photoService.getPhotoById(photoId);
        return ResponseEntity.ok(ApiResponse.success("Photo fetched successfully", photo));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<PhotoResponse>>> getPhotosByUser(@PathVariable Long userId) {
        List<PhotoResponse> photos = photoService.getPhotosByUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Photos fetched successfully", photos));
    }
    
    @DeleteMapping("/{photoId}")
    public ResponseEntity<ApiResponse<Void>> deletePhoto(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long photoId) {
        photoService.deletePhoto(userDetails.getUsername(), photoId);
        return ResponseEntity.ok(ApiResponse.success("Photo deleted successfully", null));
    }
}