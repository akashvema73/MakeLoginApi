package com.example.MakeLoginApi.dto;

import com.example.MakeLoginApi.entity.Role;
import com.example.MakeLoginApi.entity.Status;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// POST /api/users
public record UserCreateRequest(
        @NotBlank(message = "Name is required") String name,
        @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email,
        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters") String password,
        @Pattern(regexp = "^$|^[0-9+\\-\\s]{7,15}$", message = "Invalid phone number") String phone,
        Role role,
        Status status) {
}
