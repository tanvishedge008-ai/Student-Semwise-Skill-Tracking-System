package com.example.studenttracker.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="evidence")
public class Evidence {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private Long studentId;
    private Long skillId;
    @Column(length=1000) private String link;
    @Column(length=2000) private String description;
    private String status = "Pending";
    private String verificationReason;
    private LocalDateTime verifiedAt;

    public Evidence() {}
    public Long getId(){return id;}
    public Long getStudentId(){return studentId;} public void setStudentId(Long v){studentId=v;}
    public Long getSkillId(){return skillId;} public void setSkillId(Long v){skillId=v;}
    public String getLink(){return link;} public void setLink(String v){link=v;}
    public String getDescription(){return description;} public void setDescription(String v){description=v;}
    public String getStatus(){return status;} public void setStatus(String v){status=v;}
    public String getVerificationReason(){return verificationReason;} public void setVerificationReason(String v){verificationReason=v;}
    public LocalDateTime getVerifiedAt(){return verifiedAt;} public void setVerifiedAt(LocalDateTime v){verifiedAt=v;}
}
