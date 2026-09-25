package com.example.studenttracker.controller;

import com.example.studenttracker.model.User;
import com.example.studenttracker.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentAliasController {
    private final UserRepository repository;
    public StudentAliasController(UserRepository repository){this.repository=repository;}

    @GetMapping
    public List<User> students(){
        return repository.findAll().stream()
                .filter(u -> "Student".equalsIgnoreCase(u.getRole()))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> one(@PathVariable Long id){
        return repository.findById(id).filter(u -> "Student".equalsIgnoreCase(u.getRole()))
                .map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public User create(@RequestBody User user){
        user.setRole("Student");
        return repository.save(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id,@RequestBody User data){
        return repository.findById(id).filter(u -> "Student".equalsIgnoreCase(u.getRole())).map(u -> {
            u.setName(data.getName()); u.setUsername(data.getUsername());
            u.setEmail(data.getEmail()); u.setDepartment(data.getDepartment());
            u.setSemester(data.getSemester()); u.setActive(data.isActive());
            return ResponseEntity.ok(repository.save(u));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        if(!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
