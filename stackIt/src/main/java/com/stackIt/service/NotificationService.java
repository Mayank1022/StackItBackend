package com.stackIt.service;

import com.stackIt.controller.NotificationBroadcaster;
import com.stackIt.entity.Notification;
import com.stackIt.entity.User;
import com.stackIt.repository.NotificationRepository;
import com.stackIt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepo;
    @Autowired private UserRepository userRepo;

    @Autowired private NotificationBroadcaster broadcaster;

    public List<Notification> getUnreadNotifications(String username) {
        User u = userRepo.findByUsername(username).orElseThrow();
        return notificationRepo.findByRecipient_IdAndReadFalse(u.getId());
    }

    public Notification markAsRead(Long id) {
        Notification n = notificationRepo.findById(id).orElseThrow();
        n.setRead(true);
        return notificationRepo.save(n);
    }

    public void notify(User recipient, String message) {
        Notification n = new Notification();
        n.setMessage(message);
        n.setRecipient(recipient);
        n.setTimestamp(LocalDateTime.now());
        n.setRead(false);
        notificationRepo.save(n);

        broadcaster.sendNotification(recipient.getUsername(), message);
    }
}
