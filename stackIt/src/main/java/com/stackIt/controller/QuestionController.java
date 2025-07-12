package com.stackIt.controller;

import com.stackIt.entity.Question;
import com.stackIt.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Question> create(@RequestBody Question question, Authentication auth) {
        return ResponseEntity.ok(questionService.create(question, auth.getName()));
    }

    @GetMapping
    public ResponseEntity<List<Question>> list(@RequestParam(required = false) String tag,
                                               @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(questionService.list(tag, keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Question> detail(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getDetails(id));
    }
}

