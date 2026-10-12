package com.example.MakeLoginApi.service;

import com.example.MakeLoginApi.dto.UserCreateRequest;
import com.example.MakeLoginApi.dto.UserPatchRequest;
import com.example.MakeLoginApi.dto.UserUpdateRequest;
import com.example.MakeLoginApi.entity.Role;
import com.example.MakeLoginApi.entity.Status;
import com.example.MakeLoginApi.entity.User;
import com.example.MakeLoginApi.exception.EmailAlreadyExistsException;
import com.example.MakeLoginApi.exception.ResourceNotFoundException;
import com.example.MakeLoginApi.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    private static String normEmail(String email) {
        return email.trim().toLowerCase();
    }

    private static String cleanPhone(String phone) {
        return (phone == null || phone.isBlank()) ? null : phone.trim();
    }

    public List<User> search(String search, Status status, Role role) {
        String q = search == null ? "" : search.trim().toLowerCase();
        return repo.findAll(Sort.by(Sort.Direction.DESC, "id")).stream()
                .filter(u -> q.isEmpty()
                        || u.getName().toLowerCase().contains(q)
                        || u.getEmail().toLowerCase().contains(q))
                .filter(u -> status == null || u.getStatus() == status)
                .filter(u -> role == null || u.getRole() == role)
                .toList();
    }

    public User get(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

    public boolean exists(Long id) {
        return repo.existsById(id);
    }

    public Optional<User> findByEmail(String email) {
        return repo.findByEmail(normEmail(email));
    }

    public User create(UserCreateRequest r) {
        String email = normEmail(r.email());
        if (repo.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("Email already registered");
        }
        User u = new User();
        u.setName(r.name().trim());
        u.setEmail(email);
        u.setPassword(encoder.encode(r.password()));
        u.setPhone(cleanPhone(r.phone()));
        u.setRole(r.role() != null ? r.role() : Role.USER);
        u.setStatus(r.status() != null ? r.status() : Status.ACTIVE);
        return repo.save(u);
    }

    // PUT: poora update
    public User update(Long id, UserUpdateRequest r) {
        User u = get(id);
        String email = normEmail(r.email());
        if (repo.existsByEmailAndIdNot(email, id)) {
            throw new EmailAlreadyExistsException("Email already registered");
        }
        u.setName(r.name().trim());
        u.setEmail(email);
        u.setPhone(cleanPhone(r.phone()));
        u.setRole(r.role());
        u.setStatus(r.status());
        return repo.save(u);
    }

    // PATCH: sirf bheje gaye fields
    public User patch(Long id, UserPatchRequest r) {
        User u = get(id);
        if (r.name() != null && !r.name().isBlank()) u.setName(r.name().trim());
        if (r.email() != null && !r.email().isBlank()) {
            String email = normEmail(r.email());
            if (repo.existsByEmailAndIdNot(email, id)) {
                throw new EmailAlreadyExistsException("Email already registered");
            }
            u.setEmail(email);
        }
        if (r.phone() != null) u.setPhone(cleanPhone(r.phone()));
        if (r.role() != null) u.setRole(r.role());
        if (r.status() != null) u.setStatus(r.status());
        return repo.save(u);
    }

    public void delete(Long id) {
        repo.delete(get(id));
    }

    public Map<String, Long> stats() {
        List<User> all = repo.findAll();
        Map<String, Long> m = new LinkedHashMap<>();
        m.put("total", (long) all.size());
        m.put("active", all.stream().filter(u -> u.getStatus() == Status.ACTIVE).count());
        m.put("inactive", all.stream().filter(u -> u.getStatus() == Status.INACTIVE).count());
        m.put("admins", all.stream().filter(u -> u.getRole() == Role.ADMIN).count());
        return m;
    }
}
