async function adminDashboardPage() {
  try {
    const [
      usersRes,
      studentsRes,
      departmentsRes,
      skillsRes,
      careerProfilesRes
    ] = await Promise.all([
      fetch(API_ENDPOINTS.users),
      fetch(API_ENDPOINTS.students),
      fetch(`${API_BASE_URL}/departments`),
      fetch(API_ENDPOINTS.skills),
      fetch(`${API_BASE_URL}/career-profiles`)
    ]);

    const users = await usersRes.json();
    const students = await studentsRes.json();
    const departments = await departmentsRes.json();
    const skills = await skillsRes.json();
    const careerProfiles = await careerProfilesRes.json();

    const stats = document.querySelectorAll(
      ".stats .stat .value"
    );

    if (stats[0]) {
      stats[0].textContent = users.length;
    }

    if (stats[1]) {
      stats[1].textContent = students.length;
    }

    const facultyCount = users.filter(
      user =>
        String(user.role || "").toUpperCase() === "FACULTY"
    ).length;

    if (stats[2]) {
      stats[2].textContent = facultyCount;
    }

    if (stats[3]) {
      stats[3].textContent = departments.length;
    }

    const cards = document.querySelectorAll(
      ".grid3 .card"
    );

    if (cards[0]) {
      const value = cards[0].querySelector(".value");

      if (value) {
        value.textContent = skills.length;
      }
    }

    if (cards[1]) {
      const value = cards[1].querySelector(".value");

      if (value) {
        value.textContent = careerProfiles.length;
      }
    }

    if (cards[2]) {
      const badge = cards[2].querySelector(".badge");

      if (badge) {
        badge.textContent = "Operational";
      }
    }

  } catch (error) {
    console.error(
      "Admin dashboard error:",
      error
    );
  }
}


/* ================================================= */
/* ADMIN USERS */
/* ================================================= */

async function adminUsersPage() {
  try {
    const response = await fetch(
      API_ENDPOINTS.users
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load users"
      );
    }

    const users = await response.json();

    console.log(
      "Admin users loaded:",
      users
    );

  } catch (error) {
    console.error(
      "Admin users error:",
      error
    );
  }
}


/* ================================================= */
/* ADMIN DEPARTMENTS */
/* ================================================= */

async function adminDepartmentsPage() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/departments`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load departments"
      );
    }

    const departments =
      await response.json();

    console.log(
      "Admin departments loaded:",
      departments
    );

  } catch (error) {
    console.error(
      "Admin departments error:",
      error
    );
  }
}


/* ================================================= */
/* ADMIN SEMESTERS */
/* ================================================= */

async function adminSemestersPage() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/semesters`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load semesters"
      );
    }

    const semesters =
      await response.json();

    console.log(
      "Admin semesters loaded:",
      semesters
    );

    const cards =
      document.querySelectorAll(
        ".grid.grid4 .card"
      );

    semesters.forEach(
      (semester, index) => {

        const card = cards[index];

        if (!card) {
          return;
        }

        const title =
          card.querySelector("h3");

        const badge =
          card.querySelector(".badge");

        if (title) {
          title.textContent =
            `Semester ${semester.semester}`;
        }

        if (badge) {

          if (semester.semester <= 3) {

            badge.textContent =
              "Active";

            badge.className =
              "badge success";

          } else {

            badge.textContent =
              "Inactive";

            badge.className =
              "badge warning";

          }

        }

      }
    );

  } catch (error) {
    console.error(
      "Admin semesters error:",
      error
    );
  }
}


/* ================================================= */
/* ADMIN SKILLS */
/* ================================================= */

async function adminSkillsPage() {
  try {

    const response =
      await fetch(
        API_ENDPOINTS.skills
      );

    if (!response.ok) {
      throw new Error(
        "Failed to load skills"
      );
    }

    const skills =
      await response.json();

    console.log(
      "Admin skills loaded:",
      skills
    );

    const tableBody =
      document.querySelector(
        ".table tbody"
      );

    if (!tableBody) {
      return;
    }

    tableBody.innerHTML = "";

    skills.forEach(
      skill => {

        const row =
          document.createElement(
            "tr"
          );

        row.innerHTML = `
          <td>${skill.name || "-"}</td>

          <td>${skill.category || "-"}</td>

          <td>
            ${
              skill.description ||
              "Skill used for student development"
            }
          </td>

          <td>${skill.level || "-"}</td>

          <td>-</td>

          <td>
            <button class="btn secondary">
              Edit
            </button>

            <button class="btn danger">
              Delete
            </button>
          </td>
        `;

        tableBody.appendChild(row);

      }
    );

  } catch (error) {

    console.error(
      "Admin skills error:",
      error
    );

  }
}


/* ================================================= */
/* SYSTEM ANALYTICS */
/* ================================================= */

async function adminSystemAnalyticsPage() {

  try {

    const [
      usersRes,
      skillsRes,
      projectsRes,
      assessmentsRes,
      careerProfilesRes,
      resourcesRes
    ] = await Promise.all([

      fetch(
        API_ENDPOINTS.users
      ),

      fetch(
        API_ENDPOINTS.skills
      ),

      fetch(
        API_ENDPOINTS.projects
      ),

      fetch(
        API_ENDPOINTS.assessments
      ),

      fetch(
        `${API_BASE_URL}/career-profiles`
      ),

      fetch(
        `${API_BASE_URL}/learning-resources`
      )

    ]);


    /* ================= DATA ================= */

    const users =
      await usersRes.json();

    const skills =
      await skillsRes.json();

    const projects =
      await projectsRes.json();

    const assessments =
      await assessmentsRes.json();

    const careerProfiles =
      await careerProfilesRes.json();

    const resources =
      await resourcesRes.json();


    console.log(
      "System analytics data:",
      {
        users,
        skills,
        projects,
        assessments,
        careerProfiles,
        resources
      }
    );


    /* ================= ACTIVE USERS ================= */

    const activeUsers =
      users.filter(
        user => user.active !== false
      ).length;


    const activeUsersElement =
      document.querySelector(
        "#analyticsActiveUsers"
      );

    if (activeUsersElement) {

      activeUsersElement.textContent =
        activeUsers;

    }


    /* ================= SKILLS ADDED ================= */

    const skillsElement =
      document.querySelector(
        "#analyticsSkillsAdded"
      );

    if (skillsElement) {

      skillsElement.textContent =
        skills.length;

    }


    /* ================= SKILLS VERIFIED ================= */

    /*
      The current Skill model does not contain
      a verified field.

      Therefore we count verified skills only
      when the backend actually provides such
      a field.
    */

    const verifiedSkills =
      skills.filter(
        skill =>
          skill.verified === true ||
          skill.status === "VERIFIED"
      ).length;


    const verifiedSkillsElement =
      document.querySelector(
        "#analyticsSkillsVerified"
      );

    if (verifiedSkillsElement) {

      verifiedSkillsElement.textContent =
        verifiedSkills;

    }


    /* ================= RESUME GENERATIONS ================= */

    /*
      There is currently no dedicated
      resume-generation table/endpoint.

      Career profiles are therefore used as
      the available backend-based count.
    */

    const resumeElement =
      document.querySelector(
        "#analyticsResumeGenerations"
      );

    if (resumeElement) {

      resumeElement.textContent =
        careerProfiles.length;

    }


    /* ================= PROJECTS ================= */

    const projectsElement =
      document.querySelector(
        "#projectsAdded"
      );

    if (projectsElement) {

      projectsElement.textContent =
        projects.length;

    }


    /* ================= ASSESSMENTS ================= */

    const completedAssessments =
      assessments.filter(
        assessment =>
          String(
            assessment.status || ""
          ).toUpperCase() ===
          "COMPLETED"
      ).length;


    const completedElement =
      document.querySelector(
        "#completedAssessments"
      );

    if (completedElement) {

      completedElement.textContent =
        completedAssessments;

    }


    /* ================= DEPARTMENT STATISTICS ================= */

    const departmentContainer =
      document.querySelector(
        "#departmentStatistics"
      );


    if (departmentContainer) {

      departmentContainer.innerHTML =
        "";


      const departmentCounts = {};


      users.forEach(
        user => {

          const department =
            user.department ||
            "Other";

          departmentCounts[
            department
          ] =
            (departmentCounts[
              department
            ] || 0) + 1;

        }
      );


      const totalUsers =
        users.length;


      const departments =
        Object.entries(
          departmentCounts
        );


      if (
        departments.length === 0 ||
        totalUsers === 0
      ) {

        departmentContainer.innerHTML =
          "<p>No department data available.</p>";

      } else {

        departments.forEach(
          ([department, count]) => {

            const percentage =
              Math.round(
                (count / totalUsers) * 100
              );


            const label =
              document.createElement(
                "p"
              );

            label.textContent =
              `${department} — ${percentage}%`;


            const progress =
              document.createElement(
                "div"
              );

            progress.className =
              "progress";


            const bar =
              document.createElement(
                "span"
              );

            bar.style.width =
              `${percentage}%`;


            progress.appendChild(
              bar
            );


            departmentContainer.appendChild(
              label
            );

            departmentContainer.appendChild(
              progress
            );

          }
        );

      }

    }


    /* ================= SEMESTER STATISTICS ================= */

    const semesterElement =
      document.querySelector(
        "#semesterStatistics"
      );


    if (semesterElement) {

      const semesterCounts =
        {};


      users.forEach(
        user => {

          if (
            user.semester !== null &&
            user.semester !== undefined
          ) {

            const semester =
              Number(
                user.semester
              );

            semesterCounts[
              semester
            ] =
              (semesterCounts[
                semester
              ] || 0) + 1;

          }

        }
      );


      const semesterEntries =
        Object.entries(
          semesterCounts
        );


      if (
        semesterEntries.length === 0
      ) {

        semesterElement.textContent =
          "No semester data available.";

      } else {

        semesterEntries.sort(
          (a, b) =>
            Number(b[1]) -
            Number(a[1])
        );


        const highest =
          semesterEntries[0];


        semesterElement.textContent =
          `Semester ${highest[0]} has ${highest[1]} active user record(s).`;

      }

    }


  } catch (error) {

    console.error(
      "System analytics error:",
      error
    );

  }

}


/* ================================================= */
/* INITIALIZE ADMIN PAGES */
/* ================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    adminDashboardPage();

    adminUsersPage();

    adminDepartmentsPage();

    adminSemestersPage();

    adminSkillsPage();

    adminSystemAnalyticsPage();

  }
);