package com.example.studenttracker.model;

import jakarta.persistence.*;

@Entity
@Table(name="skills")
public class Skill {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false) private String name;
    private String category;
    private String level;
    private Integer progress;
    private Integer semester;
    private String status;
    @Column(length=1000) private String evidenceLink;
    @Column(length=2000) private String description;
    private Long studentId;

    public Skill() {}
    public Long getId(){return id;}
    public String getName(){return name;} public void setName(String v){name=v;}
    public String getCategory(){return category;} public void setCategory(String v){category=v;}
    public String getLevel(){return level;} public void setLevel(String v){level=v;}
    public Integer getProgress(){return progress;} public void setProgress(Integer v){progress=v;}
    public Integer getSemester(){return semester;} public void setSemester(Integer v){semester=v;}
    public String getStatus(){return status;} public void setStatus(String v){status=v;}
    public String getEvidenceLink(){return evidenceLink;} public void setEvidenceLink(String v){evidenceLink=v;}
    public String getDescription(){return description;} public void setDescription(String v){description=v;}
    public Long getStudentId(){return studentId;} public void setStudentId(Long v){studentId=v;}
}
