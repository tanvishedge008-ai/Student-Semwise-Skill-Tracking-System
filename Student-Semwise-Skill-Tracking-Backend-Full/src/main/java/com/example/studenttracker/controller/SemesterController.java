package com.example.studenttracker.controller;

import com.example.studenttracker.model.SemesterRecord;
import com.example.studenttracker.repository.SemesterRecordRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/semesters")
public class SemesterController {
    private final SemesterRecordRepository repository;

    public SemesterController(SemesterRecordRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<SemesterRecord> all() { return repository.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<SemesterRecord> one(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public SemesterRecord create(@RequestBody SemesterRecord item) { return repository.save(item); }

    @PutMapping("/{id}")
    public ResponseEntity<SemesterRecord> update(@PathVariable Long id, @RequestBody SemesterRecord item) {
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
