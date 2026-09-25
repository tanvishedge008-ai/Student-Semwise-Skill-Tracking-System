package com.example.studenttracker.repository;

import com.example.studenttracker.model.SemesterRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SemesterRecordRepository extends JpaRepository<SemesterRecord, Long> {}
