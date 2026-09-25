package com.example.studenttracker.repository;

import com.example.studenttracker.model.LearningResource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearningResourceRepository extends JpaRepository<LearningResource, Long> {}
