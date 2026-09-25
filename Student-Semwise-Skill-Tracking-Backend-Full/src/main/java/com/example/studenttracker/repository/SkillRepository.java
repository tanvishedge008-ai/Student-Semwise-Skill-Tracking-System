package com.example.studenttracker.repository;

import com.example.studenttracker.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Long> {}
