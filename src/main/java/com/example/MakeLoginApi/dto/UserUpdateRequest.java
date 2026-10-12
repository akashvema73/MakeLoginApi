package com.example.MakeLoginApi.dto;

import com.example.MakeLoginApi.entity.Role;
import com.example.MakeLoginApi.entity.Status;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;


public record UserUpdateRequest(
        @NotBlank(message = "Name is required") String name,
        @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email,
        @Pattern(regexp = "^$|^[0-9+\\-\\s]{7,15}$", message = "Invalid phone number") String phone,
        @NotNull(message = "Role is required") Role role,
        @NotNull(message = "Status is required") Status status) {
}
