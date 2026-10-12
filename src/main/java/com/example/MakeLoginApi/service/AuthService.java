package com.example.MakeLoginApi.service;

import com.example.MakeLoginApi.dto.LoginRequest;
import com.example.MakeLoginApi.dto.RegisterRequest;
import com.example.MakeLoginApi.dto.UserCreateRequest;
import com.example.MakeLoginApi.entity.Status;
import com.example.MakeLoginApi.entity.User;
import com.example.MakeLoginApi.exception.AccountInactiveException;
import com.example.MakeLoginApi.exception.InvalidCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserService userService;
    private final PasswordEncoder encoder;

    public AuthService(UserService userService, PasswordEncoder encoder) {
        this.userService = userService;
        this.encoder = encoder;
    }

    public User register(RegisterRequest r) {
        return userService.create(new UserCreateRequest(r.name(), r.email(), r.password(), null, null, null));
    }

    public User login(LoginRequest r) {
        User user = userService.findByEmail(r.email())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));
        if (!encoder.matches(r.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }
        if (user.getStatus() == Status.INACTIVE) {
            throw new AccountInactiveException("Your account is inactive. Contact administrator.");
        }
        return user;
    }
}
