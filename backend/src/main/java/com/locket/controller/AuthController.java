package com.locket.controller;

import com.locket.dto.request.LoginRequest;
import com.locket.dto.request.SignUpRequest;
import com.locket.dto.response.ApiResponse;
import com.locket.dto.response.AuthResponse;
import com.locket.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
private final AuthService authService;
    
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signUp(@Valid @RequestBody SignUpRequest request) {
        AuthResponse response = authService.signUp(request);
        return ResponseEntity.ok(ApiResponse.success("Sign up successful", response));
    }
    
    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<AuthResponse>> signIn(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.signIn(request);
        return ResponseEntity.ok(ApiResponse.success("Sign in successful", response));
    }
}