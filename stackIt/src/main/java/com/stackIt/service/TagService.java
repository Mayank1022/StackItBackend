package com.stackIt.service;

import com.stackIt.entity.Question;
import com.stackIt.entity.Tag;
import com.stackIt.repository.QuestionRepository;
import com.stackIt.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepo;
    private final QuestionRepository questionRepo;

    /**
     * Get all available tags in the system.
     */
    public List<Tag> getAllTags() {
        return tagRepo.findAll();
    }

    /**
     * Assign tags to a question by question ID.
     * New tags will be created if they do not already exist.
     */
    public Question assignTags(Long questionId, List<String> tagNames) {
        Question question = questionRepo.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        List<Tag> tags = tagNames.stream()
                .map(name -> tagRepo.findByName(name)
                        .orElseGet(() -> tagRepo.save(new Tag(null, name, new ArrayList<>())))
                ).collect(Collectors.toList());

        question.setTags(tags);
        return questionRepo.save(question);
    }
}
