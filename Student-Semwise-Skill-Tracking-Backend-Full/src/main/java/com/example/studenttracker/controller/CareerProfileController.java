package com.example.studenttracker.controller;

import com.example.studenttracker.model.CareerProfile;
import com.example.studenttracker.repository.CareerProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/career-profiles")
public class CareerProfileController {
    private final CareerProfileRepository repository;

    public CareerProfileController(CareerProfileRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<CareerProfile> all() { return repository.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<CareerProfile> one(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public CareerProfile create(@RequestBody CareerProfile item) { return repository.save(item); }

    @PutMapping("/{id}")
    public ResponseEntity<CareerProfile> update(@PathVariable Long id, @RequestBody CareerProfile item) {
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
