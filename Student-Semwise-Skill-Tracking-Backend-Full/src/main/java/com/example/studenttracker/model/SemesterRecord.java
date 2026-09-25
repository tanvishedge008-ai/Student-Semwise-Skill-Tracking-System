package com.example.studenttracker.model;

import jakarta.persistence.*;

@Entity
@Table(name="semester_records")
public class SemesterRecord {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private Integer semester;
    private Integer totalSkills;
    private Integer verifiedSkills;
    private Integer projects;
    private Integer assessmentScore;
    private Integer progress;
    private Long studentId;

    public SemesterRecord() {}
    public Long getId(){return id;}
    public Integer getSemester(){return semester;} public void setSemester(Integer v){semester=v;}
    public Integer getTotalSkills(){return totalSkills;} public void setTotalSkills(Integer v){totalSkills=v;}
    public Integer getVerifiedSkills(){return verifiedSkills;} public void setVerifiedSkills(Integer v){verifiedSkills=v;}
    public Integer getProjects(){return projects;} public void setProjects(Integer v){projects=v;}
    public Integer getAssessmentScore(){return assessmentScore;} public void setAssessmentScore(Integer v){assessmentScore=v;}
    public Integer getProgress(){return progress;} public void setProgress(Integer v){progress=v;}
    public Long getStudentId(){return studentId;} public void setStudentId(Long v){studentId=v;}
}
