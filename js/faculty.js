// ======================================================
// FACULTY DASHBOARD
// ======================================================

async function facultyDashboardPage() {
  try {
    const [studentsRes, skillsRes, assessmentsRes, evidenceRes] =
      await Promise.all([
        fetch(API_ENDPOINTS.students),
        fetch(API_ENDPOINTS.skills),
        fetch(API_ENDPOINTS.assessments),
        fetch(`${API_BASE_URL}/evidence`)
      ]);

    const students = studentsRes.ok ? await studentsRes.json() : [];
    const skills = skillsRes.ok ? await skillsRes.json() : [];
    const assessments = assessmentsRes.ok
      ? await assessmentsRes.json()
      : [];
    const evidence = evidenceRes.ok
      ? await evidenceRes.json()
      : [];

    const completedAssessments = assessments.filter(
      a =>
        String(a.status || "").toLowerCase() === "completed"
    ).length;

    const pendingEvidence = evidence.filter(
      e =>
        String(e.status || "").toLowerCase() === "pending"
    ).length;

    const averageProgress = skills.length
      ? Math.round(
          skills.reduce(
            (sum, skill) =>
              sum + Number(skill.progress || 0),
            0
          ) / skills.length
        )
      : 0;

    const values = document.querySelectorAll(
      ".stats .stat .value"
    );

    if (values[0]) {
      values[0].textContent = students.length;
    }

    if (values[1]) {
      values[1].textContent = pendingEvidence;
    }

    if (values[2]) {
      values[2].textContent = completedAssessments;
    }

    if (values[3]) {
      values[3].textContent = `${averageProgress}%`;
    }

  } catch (error) {
    console.error(
      "Faculty dashboard error:",
      error
    );
  }
}


// ======================================================
// FACULTY STUDENTS PAGE
// ======================================================

async function facultyStudentsPage() {
  try {

    const [studentsRes, skillsRes] =
      await Promise.all([
        fetch(API_ENDPOINTS.students),
        fetch(API_ENDPOINTS.skills)
      ]);

    if (!studentsRes.ok) {
      throw new Error("Failed to load students");
    }

    if (!skillsRes.ok) {
      throw new Error("Failed to load skills");
    }

    const students = await studentsRes.json();
    const skills = await skillsRes.json();

    // IMPORTANT:
    // This matches the new students.html
    const tableBody =
      document.querySelector("#facultyStudentsBody");

    if (!tableBody) {
      console.warn(
        "facultyStudentsBody not found."
      );
      return;
    }

    if (students.length === 0) {

      tableBody.innerHTML = `
        <tr>
          <td colspan="8">
            No students found.
          </td>
        </tr>
      `;

      return;
    }

    tableBody.innerHTML =
      students.map(student => {

        let studentSkills = skills.filter(
          skill =>
            String(skill.studentId) ===
            String(student.id)
        );

        /*
         * If a skill record has no studentId and
         * there is only one student, use that record.
         */
        if (
          students.length === 1 &&
          studentSkills.length === 0
        ) {
          studentSkills = skills.filter(
            skill =>
              skill.studentId === null ||
              skill.studentId === undefined
          );
        }

        const skillCount =
          studentSkills.length;

        const progress =
          skillCount > 0
            ? Math.round(
                studentSkills.reduce(
                  (sum, skill) =>
                    sum +
                    Number(skill.progress || 0),
                  0
                ) / skillCount
              )
            : 0;

        const status =
          student.active === false
            ? "Inactive"
            : "Active";

        return `
          <tr>

            <td>
              ${student.id ?? ""}
            </td>

            <td>
              ${student.name ?? ""}
            </td>

            <td>
              ${student.department ?? ""}
            </td>

            <td>
              ${student.semester ?? ""}
            </td>

            <td>
              ${skillCount}
            </td>

            <td>
              ${progress}%
            </td>

            <td>
              ${status}
            </td>

            <td>
              <button
                onclick="viewStudent(${student.id})"
              >
                View
              </button>
            </td>

          </tr>
        `;

      }).join("");

  } catch (error) {

    console.error(
      "Faculty students error:",
      error
    );

  }
}


// ======================================================
// FACULTY ANALYTICS
// ======================================================

async function facultyAnalyticsPage() {

  try {

    const [skillsRes, assessmentsRes] =
      await Promise.all([
        fetch(API_ENDPOINTS.skills),
        fetch(API_ENDPOINTS.assessments)
      ]);

    if (!skillsRes.ok ||
        !assessmentsRes.ok) {

      throw new Error(
        "Failed to load analytics data"
      );
    }

    const skills = await skillsRes.json();
    const assessments =
      await assessmentsRes.json();


    // -----------------------------
    // Semester Progress
    // -----------------------------

    const semesterAverages = {};

    for (let semester = 1;
         semester <= 8;
         semester++) {

      const semesterSkills =
        skills.filter(
          skill =>
            Number(skill.semester) ===
            semester
        );

      const average =
        semesterSkills.length
          ? Math.round(
              semesterSkills.reduce(
                (sum, skill) =>
                  sum +
                  Number(
                    skill.progress || 0
                  ),
                0
              ) /
              semesterSkills.length
            )
          : 0;

      semesterAverages[semester] =
        average;
    }


    const chart =
      document.querySelector(".chart");

    if (chart) {

      chart.innerHTML =
        Object.entries(
          semesterAverages
        )
        .map(
          ([semester, progress]) => `
            <div class="barwrap">

              <div
                class="bar"
                style="
                  height:${Math.max(
                    progress,
                    2
                  )}px
                "
              ></div>

              <small>
                Sem ${semester}
              </small>

            </div>
          `
        )
        .join("");

    }


    // -----------------------------
    // Verified Skills
    // -----------------------------

    const verifiedSkills =
      skills.filter(
        skill =>
          String(
            skill.status || ""
          ).toLowerCase() ===
          "verified"
          ||
          String(
            skill.verificationStatus ||
            ""
          ).toLowerCase() ===
          "verified"
      );

    const verifiedPercentage =
      skills.length
        ? Math.round(
            (
              verifiedSkills.length /
              skills.length
            ) * 100
          )
        : 0;


    const analyticsCards =
      document.querySelectorAll(
        ".grid3 .card"
      );


    if (analyticsCards[1]) {

      const value =
        analyticsCards[1]
          .querySelector(".value");

      const progress =
        analyticsCards[1]
          .querySelector(
            ".progress span"
          );

      if (value) {
        value.textContent =
          `${verifiedPercentage}%`;
      }

      if (progress) {
        progress.style.width =
          `${verifiedPercentage}%`;
      }

    }


    // -----------------------------
    // Assessment Performance
    // -----------------------------

    const completedAssessments =
      assessments.filter(
        assessment =>
          String(
            assessment.status || ""
          ).toLowerCase() ===
          "completed"
          &&
          assessment.score !== null
          &&
          assessment.score !== undefined
      );


    let average = 0;
    let highest = 0;
    let lowest = 0;


    if (
      completedAssessments.length >
      0
    ) {

      const scores =
        completedAssessments.map(
          assessment =>
            Number(
              assessment.score || 0
            )
        );


      average =
        Math.round(
          scores.reduce(
            (sum, score) =>
              sum + score,
            0
          ) /
          scores.length
        );


      highest =
        Math.max(...scores);

      lowest =
        Math.min(...scores);

    }


    if (analyticsCards[2]) {

      analyticsCards[2].innerHTML = `
        <h3>
          Assessment Performance
        </h3>

        <p>
          Average: ${average}%
        </p>

        <p>
          Highest: ${highest}%
        </p>

        <p>
          Lowest: ${lowest}%
        </p>
      `;

    }

  } catch (error) {

    console.error(
      "Faculty analytics error:",
      error
    );

  }

}


// ======================================================
// FACULTY SKILL ASSESSMENTS
// ======================================================

async function facultySkillAssessmentsPage() {

  try {

    const response =
      await fetch(
        API_ENDPOINTS.assessments
      );

    if (!response.ok) {
      throw new Error(
        "Failed to load assessments"
      );
    }

    const assessments =
      await response.json();


    const tableBody =
      document.querySelector(
        "#assessmentsTableBody"
      ) ||
      document.querySelector("tbody");


    if (!tableBody) {
      console.warn(
        "Assessment table body not found."
      );
      return;
    }


    if (assessments.length === 0) {

      tableBody.innerHTML = `
        <tr>
          <td colspan="100%">
            No assessments found.
          </td>
        </tr>
      `;

      return;
    }


    tableBody.innerHTML =
      assessments.map(
        assessment => {

          const status =
            assessment.status ||
            "Pending";

          const score =
            assessment.score !== null &&
            assessment.score !== undefined
              ? `${assessment.score}%`
              : "Not attempted";


          return `
            <tr>

              <td>
                ${assessment.id ?? ""}
              </td>

              <td>
                ${assessment.title ?? ""}
              </td>

              <td>
                ${assessment.skill ?? ""}
              </td>

              <td>
                ${assessment.questions ?? 0}
              </td>

              <td>
                ${assessment.durationMinutes ?? 0}
                min
              </td>

              <td>
                ${score}
              </td>

              <td>
                ${status}
              </td>

            </tr>
          `;

        }
      ).join("");

  } catch (error) {

    console.error(
      "Faculty assessments error:",
      error
    );

  }

}


// ======================================================
// EVIDENCE VERIFICATION
// ======================================================

async function facultyEvidenceVerificationPage() {

  try {

    const [
      evidenceRes,
      studentsRes,
      skillsRes
    ] = await Promise.all([
      fetch(`${API_BASE_URL}/evidence`),
      fetch(API_ENDPOINTS.students),
      fetch(API_ENDPOINTS.skills)
    ]);


    if (
      !evidenceRes.ok ||
      !studentsRes.ok ||
      !skillsRes.ok
    ) {

      throw new Error(
        "Failed to load evidence data"
      );

    }


    const evidence =
      await evidenceRes.json();

    const students =
      await studentsRes.json();

    const skills =
      await skillsRes.json();


    const tableBody =
      document.querySelector(
        "#evidenceTableBody"
      ) ||
      document.querySelector("tbody");


    if (!tableBody) {

      console.warn(
        "Evidence table body not found."
      );

      return;

    }


    if (evidence.length === 0) {

      tableBody.innerHTML = `
        <tr>
          <td colspan="100%">
            No evidence submitted.
          </td>
        </tr>
      `;

      return;

    }


    tableBody.innerHTML =
      evidence.map(item => {

        const student =
          students.find(
            s =>
              String(s.id) ===
              String(item.studentId)
          );


        const skill =
          skills.find(
            s =>
              String(s.id) ===
              String(item.skillId)
          );


        const status =
          item.status ||
          "Pending";


        return `
          <tr>

            <td>
              ${item.id ?? ""}
            </td>

            <td>
              ${
                student?.name ??
                `Student ${
                  item.studentId ?? ""
                }`
              }
            </td>

            <td>
              ${
                skill?.name ??
                `Skill ${
                  item.skillId ?? ""
                }`
              }
            </td>

            <td>
              ${item.description ?? ""}
            </td>

            <td>

              ${
                item.link
                  ? `
                    <a
                      href="${item.link}"
                      target="_blank"
                      rel="noopener"
                    >
                      View Evidence
                    </a>
                  `
                  : "No link"
              }

            </td>

            <td>
              ${status}
            </td>

            <td>

              ${
                String(status)
                  .toLowerCase() ===
                "pending"

                  ? `
                    <button
                      onclick="
                        verifyEvidence(
                          ${item.id}
                        )
                      "
                    >
                      Verify
                    </button>

                    <button
                      onclick="
                        rejectEvidence(
                          ${item.id}
                        )
                      "
                    >
                      Reject
                    </button>
                  `

                  : "—"
              }

            </td>

          </tr>
        `;

      }).join("");

  } catch (error) {

    console.error(
      "Faculty evidence error:",
      error
    );

  }

}


// ======================================================
// VERIFY EVIDENCE
// ======================================================

async function verifyEvidence(id) {

  try {

    const response =
      await fetch(
        `${API_BASE_URL}/evidence/${id}/verify`,
        {
          method: "POST"
        }
      );


    if (!response.ok) {
      throw new Error(
        "Verification failed"
      );
    }


    alert(
      "Evidence verified successfully."
    );


    facultyEvidenceVerificationPage();

  } catch (error) {

    console.error(error);

    alert(
      "Unable to verify evidence."
    );

  }

}


// ======================================================
// REJECT EVIDENCE
// ======================================================

async function rejectEvidence(id) {

  const reason =
    prompt(
      "Enter rejection reason:"
    );


  if (reason === null) {
    return;
  }


  try {

    const response =
      await fetch(
        `${API_BASE_URL}/evidence/${id}/reject?reason=${encodeURIComponent(
          reason
        )}`,
        {
          method: "POST"
        }
      );


    if (!response.ok) {
      throw new Error(
        "Rejection failed"
      );
    }


    alert(
      "Evidence rejected."
    );


    facultyEvidenceVerificationPage();

  } catch (error) {

    console.error(error);

    alert(
      "Unable to reject evidence."
    );

  }

}


// ======================================================
// FACULTY SEMESTERS
// ======================================================

async function facultySemestersPage() {

  try {

    const [
      studentsRes,
      skillsRes,
      projectsRes
    ] = await Promise.all([
      fetch(API_ENDPOINTS.students),
      fetch(API_ENDPOINTS.skills),
      fetch(API_ENDPOINTS.projects)
    ]);


    if (
      !studentsRes.ok ||
      !skillsRes.ok ||
      !projectsRes.ok
    ) {

      throw new Error(
        "Failed to load semester data"
      );

    }


    const students =
      await studentsRes.json();

    const skills =
      await skillsRes.json();

    const projects =
      await projectsRes.json();


    const selects =
      document.querySelectorAll(
        ".toolbar select"
      );


    if (selects.length < 3) {
      return;
    }


    const departmentSelect =
      selects[0];

    const semesterSelect =
      selects[1];

    const studentSelect =
      selects[2];


    // Departments

    const departments = [
      ...new Set(
        students
          .map(
            student =>
              student.department
          )
          .filter(Boolean)
      )
    ];


    departmentSelect.innerHTML = `
      <option value="">
        All Departments
      </option>

      ${
        departments
          .map(
            department => `
              <option
                value="${department}"
              >
                ${department}
              </option>
            `
          )
          .join("")
      }
    `;


    // Semesters

    semesterSelect.innerHTML = `
      <option value="">
        Select Semester
      </option>

      ${
        [1,2,3,4,5,6,7,8]
          .map(
            semester => `
              <option
                value="${semester}"
              >
                Semester ${semester}
              </option>
            `
          )
          .join("")
      }
    `;


    function updateStudents() {

      const selectedDepartment =
        departmentSelect.value;


      const filteredStudents =
        students.filter(
          student =>
            !selectedDepartment ||
            student.department ===
              selectedDepartment
        );


      studentSelect.innerHTML =
        filteredStudents.length

          ? `
              <option value="">
                Select Student
              </option>

              ${
                filteredStudents
                  .map(
                    student => `
                      <option
                        value="${student.id}"
                      >
                        ${student.name}
                      </option>
                    `
                  )
                  .join("")
              }
            `

          : `
              <option value="">
                No students
              </option>
            `;


      updateSemesterData();

    }


    function updateSemesterData() {

      const studentId =
        studentSelect.value;

      const semester =
        Number(
          semesterSelect.value
        );


      if (!studentId ||
          !semester) {

        return;

      }


      let studentSkills =
        skills.filter(
          skill =>
            Number(
              skill.semester
            ) === semester
        );


      let studentProjects =
        projects.filter(
          project =>
            Number(
              project.semester
            ) === semester
        );


      const skillsWithStudent =
        studentSkills.filter(
          skill =>
            skill.studentId !== null &&
            skill.studentId !== undefined
        );


      if (
        skillsWithStudent.length > 0
      ) {

        studentSkills =
          skillsWithStudent.filter(
            skill =>
              String(
                skill.studentId
              ) ===
              String(studentId)
          );

      }


      const projectsWithStudent =
        studentProjects.filter(
          project =>
            project.studentId !== null &&
            project.studentId !== undefined
        );


      if (
        projectsWithStudent.length > 0
      ) {

        studentProjects =
          projectsWithStudent.filter(
            project =>
              String(
                project.studentId
              ) ===
              String(studentId)
          );

      }


      const averageProgress =
        studentSkills.length

          ? Math.round(
              studentSkills.reduce(
                (sum, skill) =>
                  sum +
                  Number(
                    skill.progress || 0
                  ),
                0
              ) /
              studentSkills.length
            )

          : 0;


      const cards =
        document.querySelectorAll(
          ".grid3 .card"
        );


      if (cards[0]) {

        cards[0].innerHTML = `
          <h3>
            Skills
          </h3>

          ${
            studentSkills.length

              ? studentSkills
                  .map(
                    skill => `
                      <p>
                        ${
                          skill.name ||
                          "Skill"
                        }
                        —
                        ${
                          skill.progress ||
                          0
                        }%
                      </p>
                    `
                  )
                  .join("")

              : `
                  <p>
                    No skills recorded.
                  </p>
                `
          }
        `;

      }


      if (cards[1]) {

        cards[1].innerHTML = `
          <h3>
            Projects
          </h3>

          ${
            studentProjects.length

              ? studentProjects
                  .map(
                    project => `
                      <p>
                        ${
                          project.title ||
                          "Project"
                        }
                      </p>
                    `
                  )
                  .join("")

              : `
                  <p>
                    No projects recorded.
                  </p>
                `
          }
        `;

      }


      if (cards[2]) {

        cards[2].innerHTML = `
          <h3>
            Progress
          </h3>

          <div class="value">
            ${averageProgress}%
          </div>

          <div class="progress">
            <span
              style="
                width:${averageProgress}%
              "
            ></span>
          </div>
        `;

      }

    }


    departmentSelect.addEventListener(
      "change",
      updateStudents
    );

    semesterSelect.addEventListener(
      "change",
      updateSemesterData
    );

    studentSelect.addEventListener(
      "change",
      updateSemesterData
    );


    updateStudents();

  } catch (error) {

    console.error(
      "Faculty semester error:",
      error
    );

  }

}


// ======================================================
// FACULTY REPORTS
// ======================================================

async function facultyReportsPage() {

  try {

    const [
      studentsRes,
      skillsRes,
      projectsRes,
      assessmentsRes
    ] = await Promise.all([
      fetch(API_ENDPOINTS.students),
      fetch(API_ENDPOINTS.skills),
      fetch(API_ENDPOINTS.projects),
      fetch(API_ENDPOINTS.assessments)
    ]);


    if (
      !studentsRes.ok ||
      !skillsRes.ok ||
      !projectsRes.ok ||
      !assessmentsRes.ok
    ) {

      throw new Error(
        "Failed to load report data"
      );

    }


    const students =
      await studentsRes.json();

    const skills =
      await skillsRes.json();

    const projects =
      await projectsRes.json();

    const assessments =
      await assessmentsRes.json();


    const cards =
      document.querySelectorAll(
        ".grid3 .card"
      );


    if (!cards.length) {
      return;
    }


    // Student Overview

    if (cards[0]) {

      const muted =
        cards[0].querySelector(
          ".muted"
        );

      if (muted) {

        muted.textContent =
          `${students.length} student(s), ${skills.length} skill record(s).`;

      }

    }


    // Semester Summary

    if (cards[1]) {

      const muted =
        cards[1].querySelector(
          ".muted"
        );


      const semestersUsed = [
        ...new Set(
          skills
            .map(
              skill =>
                skill.semester
            )
            .filter(Boolean)
        )
      ];


      if (muted) {

        muted.textContent =
          `${semestersUsed.length} semester(s) currently have skill data.`;

      }

    }


    // Department Summary

    if (cards[2]) {

      const muted =
        cards[2].querySelector(
          ".muted"
        );


      const departments = [
        ...new Set(
          students
            .map(
              student =>
                student.department
            )
            .filter(Boolean)
        )
      ];


      if (muted) {

        muted.textContent =
          `${departments.length} department(s) represented.`;

      }

    }


    // Assessment Summary

    if (cards[3]) {

      const muted =
        cards[3].querySelector(
          ".muted"
        );


      const completed =
        assessments.filter(
          assessment =>
            String(
              assessment.status || ""
            ).toLowerCase() ===
            "completed"
        ).length;


      if (muted) {

        muted.textContent =
          `${assessments.length} assessment(s), ${completed} completed.`;

      }

    }


    // Skill Development

    if (cards[4]) {

      const muted =
        cards[4].querySelector(
          ".muted"
        );


      const developingSkills =
        skills.filter(
          skill =>
            Number(
              skill.progress || 0
            ) < 70
        ).length;


      if (muted) {

        muted.textContent =
          `${developingSkills} skill(s) currently below 70% progress.`;

      }

    }

  } catch (error) {

    console.error(
      "Faculty reports error:",
      error
    );

  }

}


// ======================================================
// PAGE INITIALIZATION
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    facultyDashboardPage();

    facultyStudentsPage();

    facultyAnalyticsPage();

    facultySkillAssessmentsPage();

    facultyEvidenceVerificationPage();

    facultySemestersPage();

    facultyReportsPage();

  }
);