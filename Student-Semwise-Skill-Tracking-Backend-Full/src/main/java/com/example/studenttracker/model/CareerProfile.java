package com.example.studenttracker.model;

import jakarta.persistence.*;

@Entity
@Table(name="career_profiles")
public class CareerProfile {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(length=2000) private String requiredSkills;
    @Column(length=2000) private String description;

    public CareerProfile() {}
    public Long getId(){return id;}
    public String getTitle(){return title;} public void setTitle(String v){title=v;}
    public String getRequiredSkills(){return requiredSkills;} public void setRequiredSkills(String v){requiredSkills=v;}
    public String getDescription(){return description;} public void setDescription(String v){description=v;}
}
