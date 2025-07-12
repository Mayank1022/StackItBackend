package com.stackIt.entity;

import jakarta.persistence.*;

@Entity
public class Answer
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Lob
    String content;
    @ManyToOne
    User author;
    @ManyToOne
    Question question;

     int upvotes;
     int downvotes;
     boolean accepted;

    public Answer() {
    }

    public Answer(Long id, String content, User author, Question question, int upvotes, int downvotes, boolean accepted) {
        this.id = id;
        this.content = content;
        this.author = author;
        this.question = question;
        this.upvotes = upvotes;
        this.downvotes = downvotes;
        this.accepted = accepted;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public User getUser() {
        return author;
    }

    public void setUser(User author) {
        this.author = author;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public int getUpvotes() {
        return upvotes;
    }

    public void setUpvotes(int upvotes) {
        this.upvotes = upvotes;
    }

    public int getDownvotes() {
        return downvotes;
    }

    public void setDownvotes(int downvotes) {
        this.downvotes = downvotes;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }
}
