package com.example.studenttracker.model;

import jakarta.persistence.*;

@Entity
@Table(name="projects")
public class Project {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false) private String title;
    @Column(length=2000) private String description;
    private String tech;
    private Integer semester;
    private String github;
    private String status;
    private String verification;
    private Long studentId;

    public Project() {}
    public Long getId(){return id;}
    public String getTitle(){return title;} public void setTitle(String v){title=v;}
    public String getDescription(){return description;} public void setDescription(String v){description=v;}
    public String getTech(){return tech;} public void setTech(String v){tech=v;}
    public Integer getSemester(){return semester;} public void setSemester(Integer v){semester=v;}
    public String getGithub(){return github;} public void setGithub(String v){github=v;}
    public String getStatus(){return status;} public void setStatus(String v){status=v;}
    public String getVerification(){return verification;} public void setVerification(String v){verification=v;}
    public Long getStudentId(){return studentId;} public void setStudentId(Long v){studentId=v;}
}
