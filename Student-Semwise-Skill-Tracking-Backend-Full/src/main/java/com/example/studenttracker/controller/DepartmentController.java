package com.example.studenttracker.controller;

import com.example.studenttracker.model.Department;
import com.example.studenttracker.repository.DepartmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {
    private final DepartmentRepository repository;

    public DepartmentController(DepartmentRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Department> all() { return repository.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Department> one(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Department create(@RequestBody Department item) { return repository.save(item); }

    @PutMapping("/{id}")
    public ResponseEntity<Department> update(@PathVariable Long id, @RequestBody Department item) {
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
