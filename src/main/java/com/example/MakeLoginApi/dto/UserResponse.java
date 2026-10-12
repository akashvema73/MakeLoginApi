package com.example.MakeLoginApi.dto;

import com.example.MakeLoginApi.entity.Role;
import com.example.MakeLoginApi.entity.Status;
import com.example.MakeLoginApi.entity.User;

import java.time.LocalDateTime;


public record UserResponse(Long id, String name, String email, String phone,
                           Role role, Status status, LocalDateTime createdAt) {
    public static UserResponse from(User u) {
        return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getPhone(),
                u.getRole(), u.getStatus(), u.getCreatedAt());
    }
}
