package com.example.MakeLoginApi.configuration;

import com.example.MakeLoginApi.entity.Role;
import com.example.MakeLoginApi.entity.Status;
import com.example.MakeLoginApi.entity.User;
import com.example.MakeLoginApi.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedUsers(UserRepository repo, PasswordEncoder enc) {
        return args -> {
            if (repo.count() > 0) return;
            LocalDateTime now = LocalDateTime.now();
            add(repo, enc, "Admin User", "admin@nexus.com", "Admin@123", "9876500001", Role.ADMIN, Status.ACTIVE, now.minusDays(45));
            add(repo, enc, "Rohit Sharma", "rohit.sharma@nexus.com", "User@123", "9876500002", Role.USER, Status.ACTIVE, now.minusDays(32));
            add(repo, enc, "Priya Singh", "priya.singh@nexus.com", "User@123", "9876500003", Role.ADMIN, Status.ACTIVE, now.minusDays(27));
            add(repo, enc, "Amit Verma", "amit.verma@nexus.com", "User@123", "9876500004", Role.USER, Status.ACTIVE, now.minusDays(21));
            add(repo, enc, "Neha Gupta", "neha.gupta@nexus.com", "User@123", "9876500005", Role.USER, Status.INACTIVE, now.minusDays(18));
            add(repo, enc, "Karan Mehta", "karan.mehta@nexus.com", "User@123", "9876500006", Role.USER, Status.ACTIVE, now.minusDays(12));
            add(repo, enc, "Sneha Patel", "sneha.patel@nexus.com", "User@123", "9876500007", Role.USER, Status.ACTIVE, now.minusDays(9));
            add(repo, enc, "Vikram Yadav", "vikram.yadav@nexus.com", "User@123", "9876500008", Role.USER, Status.INACTIVE, now.minusDays(5));
            add(repo, enc, "Anjali Mishra", "anjali.mishra@nexus.com", "User@123", "9876500009", Role.USER, Status.ACTIVE, now.minusDays(2));
            add(repo, enc, "Deepak Tiwari", "deepak.tiwari@nexus.com", "User@123", null, Role.USER, Status.ACTIVE, now.minusHours(6));
        };
    }

    private static void add(UserRepository repo, PasswordEncoder enc, String name, String email, String pass,
                            String phone, Role role, Status status, LocalDateTime createdAt) {
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPassword(enc.encode(pass));
        u.setPhone(phone);
        u.setRole(role);
        u.setStatus(status);
        u.setCreatedAt(createdAt);
        repo.save(u);
    }
}
