package com.example.studenttracker.controller;

import com.example.studenttracker.model.Evidence;
import com.example.studenttracker.repository.EvidenceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/evidence")
public class EvidenceController {
    private final EvidenceRepository repository;
    public EvidenceController(EvidenceRepository repository){this.repository=repository;}

    @GetMapping public List<Evidence> all(){return repository.findAll();}

    @GetMapping("/{id}")
    public ResponseEntity<Evidence> one(@PathVariable Long id){
        return repository.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping public Evidence create(@RequestBody Evidence item){return repository.save(item);}

    @PutMapping("/{id}")
    public ResponseEntity<Evidence> update(@PathVariable Long id,@RequestBody Evidence item){
        return repository.findById(id).map(old -> {
            item.setStudentId(old.getStudentId());
            item.setSkillId(old.getSkillId());
            return ResponseEntity.ok(repository.save(item));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<Evidence> verify(@PathVariable Long id){
        return repository.findById(id).map(e -> {
            e.setStatus("Verified");
            e.setVerifiedAt(LocalDateTime.now());
            return ResponseEntity.ok(repository.save(e));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Evidence> reject(@PathVariable Long id,@RequestParam(required=false) String reason){
        return repository.findById(id).map(e -> {
            e.setStatus("Rejected");
            e.setVerificationReason(reason);
            e.setVerifiedAt(LocalDateTime.now());
            return ResponseEntity.ok(repository.save(e));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        if(!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
