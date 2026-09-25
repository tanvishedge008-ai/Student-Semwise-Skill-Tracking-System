const DB = {
  get(k, d) {
    let x = localStorage.getItem("sst_" + k);
    if (x) return JSON.parse(x);
    localStorage.setItem("sst_" + k, JSON.stringify(d));
    return d;
  },

  set(k, v) {
    localStorage.setItem("sst_" + k, JSON.stringify(v));
  }
};

const profile = {
  name: "Tanvi",
  id: "IT2024XXX",
  email: "tanvi@example.com",
  phone: "+91 98765 43210",
  department: "Information Technology",
  college: "ABC College of Engineering",
  semester: 3,
  cgpa: "8.6"
};

const defaultSkills = [
  ["HTML", "Web Development", "Advanced", 90, 1, "Verified"],
  ["CSS", "Web Development", "Intermediate", 75, 1, "Verified"],
  ["JavaScript", "Web Development", "Intermediate", 70, 2, "Verified"],
  ["Java", "Programming", "Beginner", 40, 3, "Pending"],
  ["Python", "Programming", "Intermediate", 65, 2, "Verified"],
  ["SQL", "Database", "Intermediate", 60, 2, "Verified"],
  ["PostgreSQL", "Database", "Beginner", 45, 3, "Pending"],
  ["Git", "Other", "Beginner", 35, 3, "Pending"]
].map((x, i) => ({
  id: i + 1,
  name: x[0],
  category: x[1],
  level: x[2],
  progress: x[3],
  semester: x[4],
  status: x[5]
}));

const defaultProjects = [
  {
    title: "Student Skill Tracking System",
    description:
      "Semester-wise skill tracking and faculty verification project.",
    tech: "HTML, CSS, JavaScript, Spring Boot, PostgreSQL",
    semester: 3,
    github: "#",
    status: "In Progress",
    verification: "Pending"
  },
  {
    title: "Electricity Billing System",
    description: "Java JDBC billing application.",
    tech: "Java, JDBC, PostgreSQL",
    semester: 3,
    github: "#",
    status: "Completed",
    verification: "Verified"
  }
];

/* =========================================================
   BASIC HELPERS
========================================================= */

function getLoggedInUserId() {
  return localStorage.getItem("userId");
}

async function getLoggedInUser() {
  const userId = getLoggedInUserId();

  if (!userId) {
    return null;
  }

  const response = await fetch(API_ENDPOINTS.users);

  if (!response.ok) {
    throw new Error("Failed to load users");
  }

  const users = await response.json();

  return (
    users.find(
      user => String(user.id) === String(userId)
    ) || null
  );
}

function init() {
  DB.get("profile", profile);
  DB.get("skills", defaultSkills);
  DB.get("projects", defaultProjects);

  const p = DB.get("profile", profile);

  document.querySelectorAll("[data-name]").forEach(e => {
    e.textContent = p.name;
  });

  document.querySelectorAll("[data-avatar]").forEach(e => {
    e.textContent = p.name ? p.name[0] : "";
  });

  const sidebar = document.querySelector("#sidebar");
  const menu = document.querySelector("#menu");

  if (sidebar && menu) {
    menu.onclick = () => sidebar.classList.toggle("open");
  }

  document.querySelectorAll(".side-link").forEach(a => {
    if (a.href === location.href) {
      a.classList.add("active");
    }
  });
}

function toast(message) {
  const t = document.querySelector("#toast");

  if (!t) return;

  t.textContent = message;
  t.classList.add("show");

  setTimeout(() => {
    t.classList.remove("show");
  }, 2200);
}

function openModal(id) {
  document.getElementById(id)?.classList.add("show");
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove("show");
}

function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");

  location.href = "../login.html";
}

/* =========================================================
   DASHBOARD
========================================================= */

async function dashboard() {
  try {
    const userId = getLoggedInUserId();

    if (!userId) {
      console.error("No logged-in user found.");
      return;
    }

    const [
      usersResponse,
      skillsResponse,
      projectsResponse
    ] = await Promise.all([
      fetch(API_ENDPOINTS.users),
      fetch(API_ENDPOINTS.skills),
      fetch(API_ENDPOINTS.projects)
    ]);

    if (
      !usersResponse.ok ||
      !skillsResponse.ok ||
      !projectsResponse.ok
    ) {
      throw new Error("Failed to load dashboard data");
    }

    const users = await usersResponse.json();
    const allSkills = await skillsResponse.json();
    const allProjects = await projectsResponse.json();

    const currentUser = users.find(
      user => String(user.id) === String(userId)
    );

    if (!currentUser) {
      console.error("Logged-in user not found.");
      return;
    }

    const studentSkills = allSkills.filter(
      skill =>
        String(skill.studentId) === String(currentUser.id)
    );

    const studentProjects = allProjects.filter(
      project =>
        String(project.studentId) === String(currentUser.id)
    );

    const verifiedSkills = studentSkills.filter(
      skill => skill.status === "Verified"
    ).length;

    const inProgressSkills = studentSkills.filter(
      skill => skill.status !== "Verified"
    ).length;

    const overallProgress =
      studentSkills.length > 0
        ? Math.round(
            studentSkills.reduce(
              (sum, skill) =>
                sum + (Number(skill.progress) || 0),
              0
            ) / studentSkills.length
          )
        : 0;

    const values = [
      ["#totalSkills", studentSkills.length],
      ["#verifiedSkills", verifiedSkills],
      ["#inProgress", inProgressSkills],
      ["#projects", studentProjects.length],
      ["#semester", currentUser.semester || 0],
      ["#overall", overallProgress + "%"]
    ];

    values.forEach(([selector, value]) => {
      const element = document.querySelector(selector);

      if (element) {
        element.textContent = value;
      }
    });

    const nameElement = document.querySelector("#studentName");

    if (nameElement) {
      nameElement.textContent = currentUser.name || "";
    }

  } catch (error) {
    console.error("Error loading dashboard:", error);
  }
}

/* =========================================================
   SKILLS
========================================================= */

async function skillsPage() {
  const box = document.querySelector("#skillsRows");

  if (!box) return;

  try {
    const user = await getLoggedInUser();

    if (!user) {
      box.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;">
            User not found.
          </td>
        </tr>
      `;
      return;
    }

    const response = await fetch(API_ENDPOINTS.skills);

    if (!response.ok) {
      throw new Error("Failed to load skills");
    }

    const allSkills = await response.json();

    const skills = allSkills.filter(
      skill =>
        String(skill.studentId) === String(user.id)
    );

    if (skills.length === 0) {
      box.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;">
            No skills added yet.
          </td>
        </tr>
      `;
      return;
    }

    box.innerHTML = skills.map(s => `
      <tr>
        <td><b>${s.name || ""}</b></td>

        <td>${s.category || ""}</td>

        <td>${s.level || ""}</td>

        <td>
          <div class="progress">
            <span style="width:${s.progress || 0}%"></span>
          </div>
          ${s.progress || 0}%
        </td>

        <td>${s.semester || ""}</td>

        <td>
          <span class="badge ${
            s.status === "Verified"
              ? "success"
              : "warning"
          }">
            ${s.status || "Pending"}
          </span>
        </td>
      </tr>
    `).join("");

  } catch (error) {
    console.error("Error loading skills:", error);

    box.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;">
          Could not connect to backend.
        </td>
      </tr>
    `;
  }
}

async function addSkill(e) {
  e.preventDefault();

  const userId = getLoggedInUserId();

  if (!userId) {
    alert("Please login first.");
    return;
  }

  const skill = {
    name: document.getElementById("skillName").value,
    category: document.getElementById("skillCategory").value,
    level: document.getElementById("skillLevel").value,
    progress:
      Number(document.getElementById("skillProgress").value) || 10,
    semester:
      Number(document.getElementById("skillSemester").value),
    evidenceLink:
      document.getElementById("skillEvidence").value,
    status: "Pending",
    studentId: Number(userId)
  };

  try {
    const response = await fetch(API_ENDPOINTS.skills, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(skill)
    });

    if (!response.ok) {
      throw new Error("Failed to save skill");
    }

    closeModal("skillModal");
    e.target.reset();

    toast("Skill added successfully");

    await skillsPage();
    await dashboard();

  } catch (error) {
    console.error(error);

    alert(
      "Could not save skill. Make sure the Java backend is running."
    );
  }
}

/* =========================================================
   PROJECTS
========================================================= */

async function projectsPage() {
  const box = document.querySelector("#projectRows");

  if (!box) return;

  try {
    const user = await getLoggedInUser();

    if (!user) {
      return;
    }

    const response = await fetch(API_ENDPOINTS.projects);

    if (!response.ok) {
      throw new Error("Failed to load projects");
    }

    const allProjects = await response.json();

    const projects = allProjects.filter(
      project =>
        String(project.studentId) === String(user.id)
    );

    if (projects.length === 0) {
      box.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;">
            No projects added yet.
          </td>
        </tr>
      `;
      return;
    }

    box.innerHTML = projects.map(p => `
      <tr>
        <td>
          <b>${p.title || ""}</b><br>
          <small>${p.description || ""}</small>
        </td>

        <td>${p.tech || ""}</td>

        <td>${p.semester || ""}</td>

        <td>${p.status || "In Progress"}</td>

        <td>
          <span class="badge ${
            p.verification === "Verified"
              ? "success"
              : "warning"
          }">
            ${p.verification || "Pending"}
          </span>
        </td>
      </tr>
    `).join("");

  } catch (error) {
    console.error("Error loading projects:", error);

    box.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;">
          Could not connect to backend.
        </td>
      </tr>
    `;
  }
}

async function addProject(e) {
  e.preventDefault();

  const userId = getLoggedInUserId();

  if (!userId) {
    alert("Please login first.");
    return;
  }

  const project = {
    title:
      document.getElementById("projectTitle").value,

    description:
      document.getElementById("projectDescription").value,

    tech:
      document.getElementById("projectTech").value,

    semester:
      Number(document.getElementById("projectSemester").value),

    github:
      document.getElementById("projectGithub").value || "#",

    status: "In Progress",

    verification: "Pending",

    studentId: Number(userId)
  };

  try {
    const response = await fetch(API_ENDPOINTS.projects, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(project)
    });

    if (!response.ok) {
      throw new Error("Failed to save project");
    }

    closeModal("projectModal");
    e.target.reset();

    toast("Project added successfully");

    await projectsPage();
    await dashboard();

  } catch (error) {
    console.error(error);

    alert(
      "Could not save project. Make sure the Java backend is running."
    );
  }
}

/* =========================================================
   PROFILE
========================================================= */

async function profilePage() {
  const form = document.querySelector("#profileForm");

  if (!form) return;

  try {
    const userId = getLoggedInUserId();

    if (!userId) {
      console.error("No logged-in user.");
      return;
    }

    const response = await fetch(API_ENDPOINTS.users);

    if (!response.ok) {
      throw new Error("Failed to load profile");
    }

    const users = await response.json();

    const user = users.find(
      u => String(u.id) === String(userId)
    );

    if (!user) {
      console.error("Profile user not found.");
      return;
    }

    const setValue = (name, value) => {
      const element =
        document.querySelector(`[data-profile="${name}"]`);

      if (element) {
        element.value = value ?? "";
      }
    };

    setValue("name", user.name);
    setValue("studentId", user.studentId);
    setValue("email", user.email);
    setValue("phone", user.phone);
    setValue("department", user.department);
    setValue("college", user.college);
    setValue("semester", user.semester);
    setValue("cgpa", user.cgpa);
    setValue("careerObjective", user.careerObjective);

  } catch (error) {
    console.error("Error loading profile:", error);
  }

  form.onsubmit = async function(e) {
    e.preventDefault();

    try {
      const userId = getLoggedInUserId();

      if (!userId) {
        alert("Please login first.");
        return;
      }

      const usersResponse =
        await fetch(API_ENDPOINTS.users);

      const users = await usersResponse.json();

      const existingUser = users.find(
        u => String(u.id) === String(userId)
      );

      if (!existingUser) {
        alert("User not found.");
        return;
      }

      const getValue = name => {
        const element =
          document.querySelector(`[data-profile="${name}"]`);

        return element ? element.value : "";
      };

      const user = {
        id: existingUser.id,

        name: getValue("name"),

        studentId: getValue("studentId"),

        email: getValue("email"),

        phone: getValue("phone"),

        department: getValue("department"),

        college: getValue("college"),

        semester:
          Number(getValue("semester")) || existingUser.semester,

        cgpa:
          Number(getValue("cgpa")) || existingUser.cgpa,

        careerObjective:
          getValue("careerObjective"),

        username: existingUser.username,

        password: existingUser.password,

        role: existingUser.role,

        active: existingUser.active
      };

      const response = await fetch(
        `${API_ENDPOINTS.users}/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      localStorage.setItem(
        "userName",
        user.name
      );

      toast("Profile updated successfully");

    } catch (error) {
      console.error(error);

      alert(
        "Could not save profile. Make sure the Java backend is running."
      );
    }
  };
}
/* =========================================================
   SEMESTER HISTORY
========================================================= */

async function semesterPage() {
  const box = document.querySelector("#semesterRows");

  if (!box) return;

  try {
    const user = await getLoggedInUser();

    if (!user) return;

    const [
      skillsResponse,
      projectsResponse,
      assessmentsResponse
    ] = await Promise.all([
      fetch(API_ENDPOINTS.skills),
      fetch(API_ENDPOINTS.projects),
      fetch(API_ENDPOINTS.assessments)
    ]);

    if (
      !skillsResponse.ok ||
      !projectsResponse.ok ||
      !assessmentsResponse.ok
    ) {
      throw new Error("Failed to load semester data");
    }

    const allSkills = await skillsResponse.json();
    const allProjects = await projectsResponse.json();
    const allAssessments = await assessmentsResponse.json();

    const skills = allSkills.filter(
      s => String(s.studentId) === String(user.id)
    );

    const projects = allProjects.filter(
      p => String(p.studentId) === String(user.id)
    );

    const assessments = allAssessments.filter(
      a => String(a.studentId) === String(user.id)
    );

    const rows = [];

    for (let semester = 1; semester <= 8; semester++) {

      const semesterSkills = skills.filter(
        s => Number(s.semester) === semester
      );

      const semesterProjects = projects.filter(
        p => Number(p.semester) === semester
      );

      const semesterAssessments = assessments.filter(
        a => Number(a.semester) === semester
      );

      const verified =
        semesterSkills.filter(
          s => s.status === "Verified"
        ).length;

      const scores =
        semesterAssessments
          .filter(
            a =>
              a.score !== null &&
              a.score !== undefined
          )
          .map(a => Number(a.score));

      const averageScore =
        scores.length > 0
          ? Math.round(
              scores.reduce(
                (sum, score) => sum + score,
                0
              ) / scores.length
            )
          : null;

      const progress =
        semesterSkills.length > 0
          ? Math.round(
              semesterSkills.reduce(
                (sum, skill) =>
                  sum + (Number(skill.progress) || 0),
                0
              ) / semesterSkills.length
            )
          : 0;

      rows.push(`
        <tr>
          <td>Semester ${semester}</td>
          <td>${semesterSkills.length}</td>
          <td>${verified}</td>
          <td>${semesterProjects.length}</td>
          <td>
            ${
              averageScore !== null
                ? averageScore + "%"
                : "Not available"
            }
          </td>
          <td>${progress}%</td>
        </tr>
      `);
    }

    box.innerHTML = rows.join("");

  } catch (error) {
    console.error(
      "Error loading semester history:",
      error
    );

    box.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;">
          Could not connect to backend.
        </td>
      </tr>
    `;
  }
}

/* =========================================================
   RESUME
========================================================= */
async function resume() {

  const name = document.querySelector("#rname");
  const contact = document.querySelector("#rcontact");
  const objective = document.querySelector("#robjective");
  const education = document.querySelector("#reducation");
  const skillsBox = document.querySelector("#rskills");
  const projectsBox = document.querySelector("#rprojects");

  if (
    !name ||
    !contact ||
    !objective ||
    !education ||
    !skillsBox ||
    !projectsBox
  ) {
    return;
  }

  try {

    const userId = getLoggedInUserId();

    if (!userId) {
      console.error("No logged-in user found.");
      return;
    }

    const [
      usersResponse,
      skillsResponse,
      projectsResponse
    ] = await Promise.all([
      fetch(API_ENDPOINTS.users),
      fetch(API_ENDPOINTS.skills),
      fetch(API_ENDPOINTS.projects)
    ]);

    if (
      !usersResponse.ok ||
      !skillsResponse.ok ||
      !projectsResponse.ok
    ) {
      throw new Error("Failed to load resume data");
    }

    const users = await usersResponse.json();
    const allSkills = await skillsResponse.json();
    const allProjects = await projectsResponse.json();

    const user = users.find(
      u => String(u.id) === String(userId)
    );

    if (!user) {
      throw new Error("Student profile not found");
    }

    const studentSkills = allSkills.filter(
      skill =>
        String(skill.studentId) === String(userId)
    );

    const studentProjects = allProjects.filter(
      project =>
        String(project.studentId) === String(userId)
    );


    // =========================
    // NAME
    // =========================

    name.textContent =
      user.name || "Student";


    // =========================
    // CONTACT INFORMATION
    // =========================

    const contactParts = [];

    if (user.email) {
      contactParts.push(user.email);
    }

    if (user.phone) {
      contactParts.push(user.phone);
    }

    if (user.department) {
      contactParts.push(user.department);
    }

    contact.textContent =
      contactParts.length > 0
        ? contactParts.join(" | ")
        : "Contact information not provided";


    // =========================
    // CAREER OBJECTIVE
    // =========================

    objective.textContent =
      user.careerObjective ||
      "Career objective not provided.";


    // =========================
    // EDUCATION
    // =========================

    const educationParts = [];

    if (user.department) {

      educationParts.push(
        `BE — ${user.department}`
      );

    } else {

      educationParts.push(
        "Degree / Department not provided"
      );

    }

    if (user.college) {

      educationParts.push(
        user.college
      );

    }

    if (user.semester) {

      educationParts.push(
        `Current Semester: ${user.semester}`
      );

    }

    if (
      user.cgpa !== null &&
      user.cgpa !== undefined &&
      user.cgpa !== ""
    ) {

      educationParts.push(
        `CGPA: ${user.cgpa}`
      );

    }

    education.innerHTML =
      educationParts.join("<br>");


    // =========================
    // SKILLS
    // =========================

    if (studentSkills.length === 0) {

      skillsBox.innerHTML =
        "<li>No skills added yet.</li>";

    } else {

      skillsBox.innerHTML =
        studentSkills
          .map(
            skill =>
              `<li>${skill.name || "Unnamed Skill"} — ${
                skill.level || "Level not provided"
              }</li>`
          )
          .join("");

    }


    // =========================
    // PROJECTS
    // =========================

    if (studentProjects.length === 0) {

      projectsBox.innerHTML =
        "<li>No projects added yet.</li>";

    } else {

      projectsBox.innerHTML =
        studentProjects
          .map(
            project =>
              `<li><b>${
                project.title || "Untitled Project"
              }</b> — ${
                project.tech || "Technology not provided"
              }</li>`
          )
          .join("");

    }

  } catch (error) {

    console.error(
      "Error loading resume:",
      error
    );

  }
}


// =========================
// PRINT / SAVE AS PDF
// =========================

function printResume() {
  window.print();
}
/* =========================================================
   ASSESSMENTS
========================================================= */

async function assessmentsPage() {
  try {
    const user = await getLoggedInUser();

    if (!user) return;

    const response =
      await fetch(API_ENDPOINTS.assessments);

    if (!response.ok) {
      throw new Error(
        "Failed to load assessments"
      );
    }

    const allAssessments =
      await response.json();

    const assessments =
      allAssessments.filter(
        a =>
          String(a.studentId) ===
          String(user.id)
      );

    console.log(
      "Student assessments:",
      assessments
    );

    const completed =
      assessments.filter(
        a => a.status === "Completed"
      );

    const pending =
      assessments.filter(
        a => a.status === "Pending"
      );

    const scores =
      completed
        .filter(
          a =>
            a.score !== null &&
            a.score !== undefined
        )
        .map(a => Number(a.score));

    const average =
      scores.length > 0
        ? Math.round(
            scores.reduce(
              (sum, score) =>
                sum + score,
              0
            ) / scores.length
          )
        : 0;

    const completedBox =
      document.querySelector(
        "#completedCount"
      );

    const pendingBox =
      document.querySelector(
        "#pendingCount"
      );

    const averageBox =
      document.querySelector(
        "#averageScore"
      );

    if (completedBox) {
      completedBox.textContent =
        `Completed: ${completed.length}`;
    }

    if (pendingBox) {
      pendingBox.textContent =
        `Pending: ${pending.length}`;
    }

    if (averageBox) {
      averageBox.textContent =
        `Average Score: ${average}%`;
    }

  } catch (error) {
    console.error(
      "Error loading assessments:",
      error
    );
  }
}

async function startAssessment(
  title,
  skill
) {
  const userId =
    getLoggedInUserId();

  if (!userId) {
    alert("Please login first.");
    return;
  }

  const assessment = {
    title: title,
    skill: skill,
    questions: 10,
    durationMinutes: 15,
    score: null,
    status: "Pending",
    studentId: Number(userId)
  };

  try {
    const response =
      await fetch(
        API_ENDPOINTS.assessments,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body:
            JSON.stringify(assessment)
        }
      );

    if (!response.ok) {
      throw new Error(
        "Failed to save assessment"
      );
    }

    toast(
      "Assessment started successfully"
    );

    await assessmentsPage();

  } catch (error) {
    console.error(error);

    alert(
      "Could not save assessment. Make sure the Java backend is running."
    );
  }
}

/* =========================================================
   EVIDENCE
========================================================= */

function verify(button) {
  const row =
    button.closest("tr");

  if (!row) return;

  const status =
    row.querySelector(".status");

  if (status) {
    status.innerHTML =
      '<span class="badge success">Verified</span>';
  }

  button.disabled = true;

  toast("Evidence verified");
}

function reject(button) {
  const reason =
    prompt("Enter rejection reason:");

  if (reason) {
    const row =
      button.closest("tr");

    if (!row) return;

    const status =
      row.querySelector(".status");

    if (status) {
      status.innerHTML =
        '<span class="badge danger">Rejected</span>';
    }

    toast("Evidence rejected");
  }
}

/* =========================================================
   SKILL PROGRESS
========================================================= */

async function skillProgressPage() {
  const box =
    document.querySelector(
      "#categoryProgress"
    );

  const semesterBox =
    document.querySelector(
      "#semesterProgress"
    );

  if (!box) return;

  try {
    const user =
      await getLoggedInUser();

    if (!user) return;

    const response =
      await fetch(
        API_ENDPOINTS.skills
      );

    if (!response.ok) {
      throw new Error(
        "Failed to load skills"
      );
    }

    const allSkills =
      await response.json();

    const userId =
      getLoggedInUserId();

    const skills =
      allSkills.filter(
        skill =>
          String(skill.studentId) ===
          String(userId)
      );

    if (semesterBox) {

      const semesterProgress = [];

      for (
        let semester = 1;
        semester <= 8;
        semester++
      ) {

        const semesterSkills =
          skills.filter(
            skill =>
              Number(skill.semester) ===
              semester
          );

        const progress =
          semesterSkills.length > 0
            ? Math.round(
                semesterSkills.reduce(
                  (sum, skill) =>
                    sum +
                    (Number(
                      skill.progress
                    ) || 0),
                  0
                ) /
                  semesterSkills.length
              )
            : 0;

        semesterProgress.push({
          semester,
          progress
        });
      }

      semesterBox.innerHTML =
        semesterProgress
          .map(
            item => `
              <div class="barwrap">
                <div
                  class="bar"
                  style="height:${Math.max(
                    item.progress,
                    5
                  )}px"
                ></div>

                <small>
                  Sem ${item.semester}
                </small>
              </div>
            `
          )
          .join("");
    }

    if (skills.length === 0) {
      box.innerHTML =
        "<p>No skills added yet.</p>";
    } else {

      const categories = {};

      skills.forEach(skill => {

        const category =
          skill.category || "Other";

        if (!categories[category]) {
          categories[category] = {
            total: 0,
            count: 0
          };
        }

        categories[category].total +=
          Number(skill.progress) || 0;

        categories[category].count++;
      });

      box.innerHTML =
        Object.entries(categories)
          .map(
            ([category, data]) => {

              const progress =
                Math.round(
                  data.total /
                    data.count
                );

              return `
                <p>
                  ${category} —
                  ${progress}%
                </p>

                <div class="progress">
                  <span
                    style="width:${progress}%"
                  ></span>
                </div>
              `;
            }
          )
          .join("");
    }

    const assessmentBox =
      document.querySelector(
        "#assessmentScores"
      );

    if (assessmentBox) {

      const assessmentResponse =
        await fetch(
          API_ENDPOINTS.assessments
        );

      if (!assessmentResponse.ok) {
        throw new Error(
          "Failed to load assessments"
        );
      }

      const allAssessments =
        await assessmentResponse.json();

      const assessments =
        allAssessments.filter(
          a =>
            String(a.studentId) ===
            String(userId)
        );

      const completed =
        assessments.filter(
          a =>
            a.score !== null &&
            a.score !== undefined
        );

      if (completed.length === 0) {

        assessmentBox.innerHTML =
          "<p>No completed assessments yet.</p>";

      } else {

        assessmentBox.innerHTML =
          completed
            .map(
              a =>
                `<p>${a.title} — ${a.score}%</p>`
            )
            .join("");
      }
    }

  } catch (error) {

    console.error(
      "Error loading skill progress:",
      error
    );

    box.innerHTML =
      "<p>Could not connect to backend.</p>";
  }
}

/* =========================================================
   SKILL GAP
========================================================= */

async function skillGapPage() {
  const box =
    document.querySelector(
      "#currentSkills"
    );

  if (!box) return;

  try {

    const userId =
      getLoggedInUserId();

    if (!userId) return;

    const response =
      await fetch(
        API_ENDPOINTS.skills
      );

    if (!response.ok) {
      throw new Error(
        "Failed to load skills"
      );
    }

    const allSkills =
      await response.json();

    const skills =
      allSkills.filter(
        skill =>
          String(skill.studentId) ===
          String(userId)
      );

    const gapBox =
      document.querySelector(
        "#skillGaps"
      );

    if (gapBox) {

      const developingSkills =
        skills.filter(
          skill =>
            Number(skill.progress) < 70
        );

      if (
        developingSkills.length === 0
      ) {

        gapBox.innerHTML =
          "<p>No major skill gaps found.</p>";

      } else {

        gapBox.innerHTML =
          developingSkills
            .map(skill => {

              const progress =
                Number(
                  skill.progress
                ) || 0;

              return `
                <p>
                  <b>
                    ${skill.name} —
                    ${progress}%
                  </b>
                </p>

                <div class="progress">
                  <span
                    style="width:${progress}%"
                  ></span>
                </div>
              `;
            })
            .join("<br />");
      }
    }

    if (skills.length === 0) {

      box.innerHTML =
        "<p>No skills added yet.</p>";

      return;
    }

    box.innerHTML =
      skills
        .map(
          skill =>
            `<p>${skill.name}</p>`
        )
        .join("");

  } catch (error) {

    console.error(
      "Error loading current skills:",
      error
    );

    box.innerHTML =
      "<p>Could not connect to backend.</p>";
  }
}

/* =========================================================
   LEARNING ROADMAP
========================================================= */

async function learningRoadmapPage() {
  const roadmapSkills = [
    {
      name: "HTML",
      progressId: "roadmapHTMLProgress",
      statusId: "roadmapHTMLStatus"
    },
    {
      name: "CSS",
      progressId: "roadmapCSSProgress",
      statusId: "roadmapCSSStatus"
    },
    {
      name: "JavaScript",
      progressId: "roadmapJavaScriptProgress",
      statusId: "roadmapJavaScriptStatus"
    },
    {
      name: "Java",
      progressId: "roadmapJavaProgress",
      statusId: "roadmapJavaStatus"
    },
    {
      name: "SQL",
      progressId: "roadmapSQLProgress",
      statusId: "roadmapSQLStatus"
    },
    {
      name: "Spring Boot",
      progressId: "roadmapSpringBootProgress",
      statusId: "roadmapSpringBootStatus"
    },
    {
      name: "REST API",
      progressId: "roadmapRESTAPIProgress",
      statusId: "roadmapRESTAPIStatus"
    },
    {
      name: "Full Stack Java",
      progressId: "roadmapFullStackJavaProgress",
      statusId: "roadmapFullStackJavaStatus"
    }
  ];

  try {
    const userId = getLoggedInUserId();

    if (!userId) {
      return;
    }

    const response = await fetch(API_ENDPOINTS.skills);

    if (!response.ok) {
      throw new Error("Failed to load roadmap data");
    }

    const allSkills = await response.json();

    // Only skills belonging to the logged-in student
    const studentSkills = allSkills.filter(
      skill => String(skill.studentId) === String(userId)
    );

    roadmapSkills.forEach(item => {
      const progressBox = document.querySelector(
        `#${item.progressId}`
      );

      const statusBox = document.querySelector(
        `#${item.statusId}`
      );

      if (!progressBox || !statusBox) {
        return;
      }

      const matchingSkill = studentSkills.find(
        skill =>
          String(skill.name || "")
            .trim()
            .toLowerCase() === item.name.toLowerCase()
      );

      // Student does not have this skill yet
      if (!matchingSkill) {
        progressBox.style.width = "0%";
        statusBox.textContent = "Not Started • 0%";
        return;
      }

      const progress = Math.max(
        0,
        Math.min(100, Number(matchingSkill.progress) || 0)
      );

      progressBox.style.width = progress + "%";

      let status;

      if (progress >= 100) {
        status = "Completed";
      } else if (progress > 0) {
        status = "In Progress";
      } else {
        status = "Not Started";
      }

      statusBox.textContent =
        `${status} • ${progress}%`;
    });

  } catch (error) {
    console.error(
      "Error loading learning roadmap:",
      error
    );

    roadmapSkills.forEach(item => {
      const statusBox = document.querySelector(
        `#${item.statusId}`
      );

      if (statusBox) {
        statusBox.textContent =
          "Could not connect to backend";
      }
    });
  }
}

/* =========================================================
   START EVERYTHING
========================================================= */
async function loadProfileMini() {
  const nameElements = document.querySelectorAll("[data-name]");
  const avatarElements = document.querySelectorAll("[data-avatar]");

  if (nameElements.length === 0) return;

  try {
    const userId = getLoggedInUserId();

    if (!userId) return;

    const response = await fetch(API_ENDPOINTS.users);

    if (!response.ok) {
      throw new Error("Failed to load user");
    }

    const users = await response.json();

    const user = users.find(
      u => String(u.id) === String(userId)
    );

    if (!user) return;

    const name = user.name || "Student";
    const initial = name.charAt(0).toUpperCase();

    nameElements.forEach(element => {
      element.textContent = name;
    });

    avatarElements.forEach(element => {
      element.textContent = initial;
    });

  } catch (error) {
    console.error("Error loading profile mini:", error);
  }
}
document.addEventListener(
  "DOMContentLoaded",
  () => {

    init();

    dashboard();

    skillsPage();

    projectsPage();

    profilePage();

    semesterPage();

    resume();

    assessmentsPage();

    skillProgressPage();

    skillGapPage();

    learningRoadmapPage();

    loadProfileMini();
  }
);