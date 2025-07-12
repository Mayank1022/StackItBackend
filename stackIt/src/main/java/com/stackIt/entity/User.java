package com.stackIt.entity;

import com.stackIt.utils.Role;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class User {

    @Id
    Long id;
    String username, email, password;
    @Enumerated(EnumType.STRING)
    Role role;
    // GUEST, USER, ADMIN

    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Notification> notifications;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }

    public User(Long id, String username, String email, String password, Role role, List<Notification> notifications) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.notifications = notifications;
    }

    public User() {
    }
}
