package com.example.studenttracker.controller;

import com.example.studenttracker.model.LearningResource;
import com.example.studenttracker.repository.LearningResourceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/learning-resources")
public class LearningResourceController {
    private final LearningResourceRepository repository;

    public LearningResourceController(LearningResourceRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<LearningResource> all() { return repository.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<LearningResource> one(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public LearningResource create(@RequestBody LearningResource item) { return repository.save(item); }

    @PutMapping("/{id}")
    public ResponseEntity<LearningResource> update(@PathVariable Long id, @RequestBody LearningResource item) {
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
