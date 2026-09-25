package com.example.studenttracker.controller;

import com.example.studenttracker.model.Assessment;
import com.example.studenttracker.repository.AssessmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {
    private final AssessmentRepository repository;

    public AssessmentController(AssessmentRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Assessment> all() { return repository.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Assessment> one(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Assessment create(@RequestBody Assessment item) { return repository.save(item); }

    @PutMapping("/{id}")
    public ResponseEntity<Assessment> update(@PathVariable Long id, @RequestBody Assessment item) {
        return repository.findById(id).map(old -> {
            // The frontend prototype currently does not use PUT yet.
            // Keeping this endpoint makes the API ready for integration.
            return ResponseEntity.ok(repository.save(item));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
