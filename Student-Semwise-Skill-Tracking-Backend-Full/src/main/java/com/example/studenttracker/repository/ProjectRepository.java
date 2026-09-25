package com.example.studenttracker.repository;

import com.example.studenttracker.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {}
