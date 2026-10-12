package com.example.MakeLoginApi.controller;

import com.example.MakeLoginApi.dto.AuthResponse;
import com.example.MakeLoginApi.dto.LoginRequest;
import com.example.MakeLoginApi.dto.RegisterRequest;
import com.example.MakeLoginApi.dto.UserResponse;
import com.example.MakeLoginApi.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        var user = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse("Registered successfully", UserResponse.from(user)));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        var user = authService.login(request);
        return ResponseEntity.ok(new AuthResponse("Login successful", UserResponse.from(user)));
    }
}
