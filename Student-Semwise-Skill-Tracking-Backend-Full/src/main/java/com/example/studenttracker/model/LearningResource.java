package com.example.studenttracker.model;

import jakarta.persistence.*;

@Entity
@Table(name="learning_resources")
public class LearningResource {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String skill;
    private String type;
    private String url;
    @Column(length=2000) private String description;

    public LearningResource() {}
    public Long getId(){return id;}
    public String getTitle(){return title;} public void setTitle(String v){title=v;}
    public String getSkill(){return skill;} public void setSkill(String v){skill=v;}
    public String getType(){return type;} public void setType(String v){type=v;}
    public String getUrl(){return url;} public void setUrl(String v){url=v;}
    public String getDescription(){return description;} public void setDescription(String v){description=v;}
}
