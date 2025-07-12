package com.stackIt.controller;

import com.stackIt.entity.Answer;
import com.stackIt.service.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;


    

    @PostMapping("/questions/{id}/answers")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Answer> addAnswer(@PathVariable Long id, @RequestBody Answer answer, Authentication auth) {
        return ResponseEntity.ok(answerService.addAnswer(id, answer, auth.getName()));
    }

    @PutMapping("/answers/{id}")
    @PreAuthorize("@answerService.isOwner(#id, authentication.name)")
    public ResponseEntity<Answer> editAnswer(@PathVariable Long id, @RequestBody Answer updated) {
        return ResponseEntity.ok(answerService.updateAnswer(id, updated));
    }

    @DeleteMapping("/answers/{id}")
    @PreAuthorize("hasRole('ADMIN') or @answerService.isOwner(#id, authentication.name)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        answerService.deleteAnswer(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/answers/{id}/vote")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> vote(@PathVariable Long id, @RequestParam boolean upvote, Authentication auth) {
        answerService.vote(id, auth.getName(), upvote);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/answers/{id}/accept")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> accept(@PathVariable Long id, Authentication auth) {
        answerService.acceptAnswer(id, auth.getName());
        return ResponseEntity.ok().build();
    }
}
