package com.stackIt.entity;

import jakarta.persistence.*;

@Entity
public class Vote
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    User user;

    @ManyToOne
    Answer answer;

    boolean upvote;


    public Vote() {
    }

    public Vote(Long id, User user, Answer answer, boolean upvote) {
        this.id = id;
        this.user = user;
        this.answer = answer;
        this.upvote = upvote;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Answer getAnswer() {
        return answer;
    }

    public void setAnswer(Answer answer) {
        this.answer = answer;
    }

    public boolean isUpvote() {
        return upvote;
    }

    public void setUpvote(boolean upvote) {
        this.upvote = upvote;
    }
}
