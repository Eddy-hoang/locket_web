package com.locket.service;

import com.locket.dto.request.UpdateNameRequest;
import com.locket.dto.response.UserResponse;
import com.locket.exception.BadRequestException;
import com.locket.exception.ResourceNotFoundException;
import com.locket.model.User;
import com.locket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserResponse.fromUser(user);
    }
    
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserResponse.fromUser(user);
    }
    
    @Transactional
    public UserResponse updateName(String email, UpdateNameRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setName(request.getName());
        User updatedUser = userRepository.save(user);
        
        return UserResponse.fromUser(updatedUser);
    }
    
    @Transactional
    public UserResponse updateAvatar(String email, MultipartFile file) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        String fileName = fileStorageService.storeFile(file);
        if (!user.getAvatar().equals("default-avatar.png")) {
            fileStorageService.deleteFile(user.getAvatar());
        }
        
        user.setAvatar(fileName);
        User updatedUser = userRepository.save(user);
        
        return UserResponse.fromUser(updatedUser);
    }
    
    public List<UserResponse> searchUsers(String query) {
        List<User> users = userRepository.findAll().stream()
                .filter(user -> 
                    user.getName().toLowerCase().contains(query.toLowerCase()) ||
                    user.getEmail().toLowerCase().contains(query.toLowerCase())
                )
                .limit(20)
                .collect(Collectors.toList());
        
        return users.stream()
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
    }
}