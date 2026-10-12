package com.example.MakeLoginApi.dto;

import com.example.MakeLoginApi.entity.Role;
import com.example.MakeLoginApi.entity.Status;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
public record UserPatchRequest(
        String name,
        @Email(message = "Invalid email format") String email,
        @Pattern(regexp = "^$|^[0-9+\\-\\s]{7,15}$", message = "Invalid phone number") String phone,
        Role role,
        Status status) {
}
