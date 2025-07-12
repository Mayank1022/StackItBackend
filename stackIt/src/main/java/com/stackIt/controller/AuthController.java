package com.stackIt.controller;

import com.stackIt.dto.LoginRequest;
import com.stackIt.service.AuthService;
import com.stackIt.utils.Role;
import com.stackIt.entity.User;
import com.stackIt.repository.UserRepository;
import com.stackIt.utils.JwtUtil;
import jakarta.servlet.annotation.MultipartConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@MultipartConfig
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthService authService;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already taken");
        }
        user.setRole(Role.USER);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                String token = JwtUtil.generateToken(user.getUsername());
                return ResponseEntity.ok(Map.of("token", token));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/update")
    public ResponseEntity<?> updateUsernamePassword(Authentication auth,
                                                    @RequestParam(required = false) String newUsername,
                                                    @RequestParam(required = false) String newPassword) {
        User updated = authService.updateUsernamePassword(auth.getName(), newUsername, newPassword);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/upload-profile")
    public ResponseEntity<?> uploadProfile(@RequestParam MultipartFile file, Authentication auth) {
        try {
            String url = authService.uploadProfilePicture(auth.getName(), file);
            return ResponseEntity.ok(Map.of("url", url));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed");
        }
    }
}

