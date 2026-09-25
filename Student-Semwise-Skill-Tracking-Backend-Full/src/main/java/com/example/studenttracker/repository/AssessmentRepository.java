package com.example.studenttracker.repository;

import com.example.studenttracker.model.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {}
