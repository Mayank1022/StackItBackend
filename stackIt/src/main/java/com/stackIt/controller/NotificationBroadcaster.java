package com.stackIt.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class NotificationBroadcaster {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendNotification(String username, String message) {
        messagingTemplate.convertAndSendToUser(
                username,
                "/topic/notifications",
                message
        );
    }
}

