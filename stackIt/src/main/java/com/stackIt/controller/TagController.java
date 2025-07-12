package com.stackIt.controller;

import com.stackIt.entity.Question;
import com.stackIt.entity.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public ResponseEntity<List<Tag>> all() {
        return ResponseEntity.ok(tagService.getAllTags());
    }

    @PostMapping("/questions/{id}/tags")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Question> assignTags(@PathVariable Long id, @RequestBody List<String> tagNames) {
        return ResponseEntity.ok(tagService.assignTags(id, tagNames));
    }
}
