package com.example.studenttracker.model;

import jakarta.persistence.*;

@Entity
@Table(name="assessments")
public class Assessment {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false) private String title;
    private String skill;
    private Integer questions = 10;
    private Integer durationMinutes = 15;
    private Integer score;
    private String status = "Pending";
    private Long studentId;

    public Assessment() {}
    public Long getId(){return id;}
    public String getTitle(){return title;} public void setTitle(String v){title=v;}
    public String getSkill(){return skill;} public void setSkill(String v){skill=v;}
    public Integer getQuestions(){return questions;} public void setQuestions(Integer v){questions=v;}
    public Integer getDurationMinutes(){return durationMinutes;} public void setDurationMinutes(Integer v){durationMinutes=v;}
    public Integer getScore(){return score;} public void setScore(Integer v){score=v;}
    public String getStatus(){return status;} public void setStatus(String v){status=v;}
    public Long getStudentId(){return studentId;} public void setStudentId(Long v){studentId=v;}
}
