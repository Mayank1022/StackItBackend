package com.stackIt.service;


import com.stackIt.entity.Question;
import com.stackIt.entity.Tag;
import com.stackIt.entity.User;
import com.stackIt.repository.QuestionRepository;
import com.stackIt.repository.TagRepository;
import com.stackIt.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepo;
    private final UserRepository userRepo;
    private final TagRepository tagRepo;


    public Question create(Question question, String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        question.setAuthor(user);

        // Persist new tags if not already in DB
        List<Tag> tags = question.getTags().stream()
                .map(tag -> tagRepo.findByName(tag.getName())
                        .orElseGet(() -> tagRepo.save(new Tag(null, tag.getName(), new ArrayList<>())))
                ).collect(Collectors.toList());

        question.setTags(tags);
        return questionRepo.save(question);
    }

    /**
     * List questions, optionally filtered by tag or keyword.
     */
    public List<Question> list(String tag, String keyword) {
        if (tag != null && !tag.isEmpty()) {
            return questionRepo.findByTags_Name(tag);
        }

        if (keyword != null && !keyword.isEmpty()) {
            return questionRepo.findAll().stream()
                    .filter(q ->
                            q.getTitle().toLowerCase().contains(keyword.toLowerCase()) ||
                                    q.getDescription().toLowerCase().contains(keyword.toLowerCase()))
                    .collect(Collectors.toList());
        }

        return questionRepo.findAll();
    }


    public Question getDetails(Long id) {
        return questionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }
}
