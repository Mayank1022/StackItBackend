package com.stackIt.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;

@Entity
public class Answer
{
    @Id
    Long id;
    @Lob
    String content;
    @ManyToOne
    User author;
    @ManyToOne
    Question question;

    int votes;
    boolean accepted;

    public Answer() {
    }

    public Answer(Long id, String content, User author, Question question, int votes, boolean accepted) {
        this.id = id;
        this.content = content;
        this.author = author;
        this.question = question;
        this.votes = votes;
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

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public int getVotes() {
        return votes;
    }

    public void setVotes(int votes) {
        this.votes = votes;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }
}
