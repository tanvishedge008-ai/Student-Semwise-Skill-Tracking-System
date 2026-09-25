package com.example.studenttracker.repository;

import com.example.studenttracker.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {}
