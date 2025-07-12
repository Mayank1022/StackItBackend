package com.stackIt.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.stackIt.config.CloudinaryConfig;
import com.stackIt.entity.User;
import com.stackIt.repository.UserRepository;
import com.stackIt.utils.JwtUtil;
import com.stackIt.utils.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    private final Cloudinary cloudinary;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public User register(User user) {
        if (userRepo.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        user.setRole(Role.USER);
        return userRepo.save(user);
    }

    public String login(String username, String password) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return JwtUtil.generateToken(user.getUsername());
    }

    public User updateUsernamePassword(String currentUsername, String newUsername, String newPassword) {
        User user = userRepo.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (newUsername != null && !newUsername.isBlank()) {
            user.setUsername(newUsername);
        }

        if (newPassword != null && !newPassword.isBlank()) {
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        return userRepo.save(user);
    }

    public String uploadProfilePicture(String username, MultipartFile file) throws IOException {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("folder", "stackit_profiles"));

        String imageUrl = (String) uploadResult.get("secure_url");

        user.setProfilePicture(imageUrl);
        userRepo.save(user);

        return imageUrl;
    }

}
