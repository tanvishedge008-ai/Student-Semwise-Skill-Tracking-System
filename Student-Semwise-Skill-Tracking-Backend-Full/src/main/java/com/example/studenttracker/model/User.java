package com.example.studenttracker.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    private String email;
    private String department;
    private Integer semester;

    // Profile fields
    private String studentId;
    private String phone;
    private String college;
    private Double cgpa;
    private String careerObjective;

    private boolean active = true;

    public User() {}

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String v) {
        name = v;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String v) {
        username = v;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String v) {
        password = v;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String v) {
        role = v;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String v) {
        email = v;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String v) {
        department = v;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer v) {
        semester = v;
    }

    // Student ID
    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String v) {
        studentId = v;
    }

    // Phone
    public String getPhone() {
        return phone;
    }

    public void setPhone(String v) {
        phone = v;
    }

    // College
    public String getCollege() {
        return college;
    }

    public void setCollege(String v) {
        college = v;
    }

    // CGPA
    public Double getCgpa() {
        return cgpa;
    }

    public void setCgpa(Double v) {
        cgpa = v;
    }
    // Career Objective
    public String getCareerObjective() {
        return careerObjective;
    }

    public void setCareerObjective(String v) {
        careerObjective = v;
    }
    public boolean isActive() {
        return active;
    }

    public void setActive(boolean v) {
        active = v;
    }
}