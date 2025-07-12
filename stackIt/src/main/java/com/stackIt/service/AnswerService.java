package com.stackIt.service;


import com.stackIt.entity.Answer;
import com.stackIt.entity.Question;
import com.stackIt.entity.User;
import com.stackIt.Exception.ResourceNotFoundException;
import com.stackIt.repository.AnswerRepository;
import com.stackIt.repository.QuestionRepository;
import com.stackIt.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    @Transactional
    public Answer addAnswer(Long questionId, Answer answer, String username) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id " + questionId));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username " + username));

        answer.setQuestion(question);
        answer.setUser(user);
        answer.setUpvotes(0);
        answer.setDownvotes(0);
        answer.setAccepted(false);

        return answerRepository.save(answer);
    }

    @Transactional
    public Answer updateAnswer(Long answerId, Answer updatedAnswer) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer not found with id " + answerId));

        answer.setContent(updatedAnswer.getContent());
        return answerRepository.save(answer);
    }

    @Transactional
    public void deleteAnswer(Long answerId) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer not found with id " + answerId));
        answerRepository.delete(answer);
    }

    @Transactional
    public void vote(Long answerId, String username, boolean upvote) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer not found with id " + answerId));

        if (upvote) {
            answer.setUpvotes(answer.getUpvotes() + 1);
        } else {
            answer.setDownvotes(answer.getDownvotes() + 1);
        }
        answerRepository.save(answer);
    }

    @Transactional
    public void acceptAnswer(Long answerId, String username) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new ResourceNotFoundException("Answer not found with id " + answerId));

        Question question = answer.getQuestion();
        if (!question.getUser().getUsername().equals(username)) {
            throw new SecurityException("Only question owner can accept an answer.");
        }

        // Un-accept previously accepted answer for the question, if any
        answerRepository.findByQuestionId(question.getId()).stream()
                .filter(Answer::isAccepted)
                .forEach(a -> {
                    a.setAccepted(false);
                    answerRepository.save(a);
                });

        answer.setAccepted(true);
        answerRepository.save(answer);
    }

    public boolean isOwner(Long answerId, String username) {
        Optional<Answer> answerOpt = answerRepository.findById(answerId);
        return answerOpt.map(answer -> answer.getUser().getUsername().equals(username)).orElse(false);
    }
}

