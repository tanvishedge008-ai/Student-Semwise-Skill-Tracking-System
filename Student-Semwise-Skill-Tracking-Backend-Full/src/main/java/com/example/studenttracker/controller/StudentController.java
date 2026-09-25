package com.example.studenttracker.controller;

import com.example.studenttracker.model.User;
import com.example.studenttracker.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class StudentController {

    private final UserRepository repository;

    public StudentController(UserRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<User> all() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> one(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public User create(@RequestBody User item) {
        return repository.save(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(
            @PathVariable Long id,
            @RequestBody User item
    ) {
        return repository.findById(id).map(old -> {

            old.setName(item.getName());
            old.setUsername(item.getUsername());
            old.setPassword(item.getPassword());
            old.setRole(item.getRole());
            old.setEmail(item.getEmail());
            old.setDepartment(item.getDepartment());
            old.setSemester(item.getSemester());
            old.setStudentId(item.getStudentId());
            old.setPhone(item.getPhone());
            old.setCollege(item.getCollege());
            old.setCgpa(item.getCgpa());
            old.setCareerObjective(item.getCareerObjective());
            old.setActive(item.isActive());

            return ResponseEntity.ok(repository.save(old));

        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(
            @RequestBody User request
    ) {

        return repository.findAll().stream()
                .filter(u ->
                        u.getUsername().equals(request.getUsername())
                                && u.getPassword().equals(request.getPassword())
                                && u.isActive()
                )
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {

        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("Student");
        }

        return repository.save(user);
    }

    // ==============================
    // FORGOT PASSWORD
    // ==============================

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequest request
    ) {

        if (request.getEmail() == null ||
                request.getEmail().isBlank() ||
                request.getNewPassword() == null ||
                request.getNewPassword().length() < 4) {

            return ResponseEntity.badRequest()
                    .body("Email and a password of at least 4 characters are required.");
        }

        return repository.findAll().stream()
                .filter(u ->
                        u.getEmail() != null &&
                                u.getEmail().equalsIgnoreCase(request.getEmail())
                )
                .findFirst()
                .map(user -> {

                    user.setPassword(request.getNewPassword());

                    repository.save(user);

                    return ResponseEntity.ok(
                            "Password reset successfully."
                    );
                })
                .orElse(
                        ResponseEntity.status(404)
                                .body("No account found with this email.")
                );
    }

    // Request data for Forgot Password
    public static class ForgotPasswordRequest {

        private String email;
        private String newPassword;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}