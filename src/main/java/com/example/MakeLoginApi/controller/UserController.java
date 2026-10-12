package com.example.MakeLoginApi.controller;

import com.example.MakeLoginApi.dto.*;
import com.example.MakeLoginApi.entity.Role;
import com.example.MakeLoginApi.entity.Status;
import com.example.MakeLoginApi.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponse> list(@RequestParam(required = false) String search,
                                   @RequestParam(required = false) Status status,
                                   @RequestParam(required = false) Role role) {
        return userService.search(search, status, role).stream().map(UserResponse::from).toList();
    }

    @GetMapping("/stats")
    public Map<String, Long> stats() {
        return userService.stats();
    }

    @GetMapping("/{id}")
    public UserResponse getById(@PathVariable Long id) {
        return UserResponse.from(userService.get(id));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.HEAD)
    public ResponseEntity<Void> exists(@PathVariable Long id) {
        return userService.exists(id) ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody UserCreateRequest request) {
        UserResponse created = UserResponse.from(userService.create(request));
        return ResponseEntity.created(URI.create("/api/users/" + created.id())).body(created);   // 201
    }

    @PutMapping("/{id}")
    public UserResponse update(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        return UserResponse.from(userService.update(id, request));
    }

    @PatchMapping("/{id}")
    public UserResponse patch(@PathVariable Long id, @Valid @RequestBody UserPatchRequest request) {
        return UserResponse.from(userService.patch(id, request));
    }

    @DeleteMapping("/{id}")
    public Map<String, String> delete(@PathVariable Long id) {
        userService.delete(id);
        return Map.of("message", "User deleted successfully");
    }
}
