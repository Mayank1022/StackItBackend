package com.stackIt.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Notification
{
    @Id
    Long id;
    String message;

    @Column(name = "`read`")
    boolean read;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    User recipient;
    LocalDateTime timestamp;

    public Notification() {
    }

    public Notification(Long id, String message, boolean read, User recipient, LocalDateTime timestamp) {
        this.id = id;
        this.message = message;
        this.read = read;
        this.recipient = recipient;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public User getRecipient() {
        return recipient;
    }

    public void setRecipient(User recipient) {
        this.recipient = recipient;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
