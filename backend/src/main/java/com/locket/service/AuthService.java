package com.locket.service;

import com.locket.dto.request.LoginRequest;
import com.locket.dto.request.SignUpRequest;
import com.locket.dto.response.AuthResponse;
import com.locket.dto.response.UserResponse;
import com.locket.exception.BadRequestException;
import com.locket.model.User;
import com.locket.repository.UserRepository;
import com.locket.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
 private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    
    @Transactional
    public AuthResponse signUp(SignUpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAvatar("default-avatar.png");
        
        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateTokenFromEmail(savedUser.getEmail());
         return new AuthResponse(token, UserResponse.fromUser(savedUser));
    }
    
    public AuthResponse signIn(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );
        String token = tokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));
        
        return new AuthResponse(token, UserResponse.fromUser(user));
    }
}