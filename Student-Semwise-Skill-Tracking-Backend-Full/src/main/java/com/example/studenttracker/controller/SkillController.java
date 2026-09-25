package com.example.studenttracker.controller;

import com.example.studenttracker.model.Skill;
import com.example.studenttracker.repository.SkillRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {
    private final SkillRepository repository;

    public SkillController(SkillRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Skill> all() { return repository.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Skill> one(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Skill create(@RequestBody Skill item) { return repository.save(item); }

    @PutMapping("/{id}")
    public ResponseEntity<Skill> update(@PathVariable Long id, @RequestBody Skill item) {
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
