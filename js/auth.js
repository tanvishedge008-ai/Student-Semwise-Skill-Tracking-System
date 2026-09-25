async function loginDemo(e) {
  e.preventDefault();

  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value;
  const selectedRole = document.querySelector("#role").value;
  const errorBox = document.querySelector("#loginError");

  errorBox.textContent = "";

  if (!username || password.length < 4) {
    errorBox.textContent =
      "Enter username and a password of at least 4 characters.";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    if (!response.ok) {
      errorBox.textContent = "Invalid username or password.";
      return;
    }

    const user = await response.json();

    const actualRole = String(user.role || "").toUpperCase();
    const chosenRole = String(selectedRole || "").toUpperCase();

    if (actualRole !== chosenRole) {
      errorBox.textContent =
        `This account is registered as ${actualRole}, not ${chosenRole}.`;
      return;
    }

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userId", user.id);
    localStorage.setItem("username", user.username);
    localStorage.setItem("userRole", actualRole);
    localStorage.setItem("userName", user.name || "");

    if (actualRole === "STUDENT") {
      window.location.href = "student/dashboard.html";
    } else if (actualRole === "FACULTY") {
      window.location.href = "faculty/dashboard.html";
    } else if (actualRole === "ADMIN") {
      window.location.href = "admin/dashboard.html";
    } else {
      errorBox.textContent = "User role is not configured.";
    }

  } catch (error) {
    console.error("Login error:", error);
    errorBox.textContent =
      "Unable to connect to the backend. Make sure Spring Boot is running.";
  }
}


async function registerDemo(e) {
  e.preventDefault();

  const form = e.target;

  const name = form.querySelector('input[type="text"]')?.value.trim();
  const email = form.querySelector('input[type="email"]')?.value.trim();
  const role = form.querySelector("select")?.value || "Student";
  const password = document.querySelector("#regPassword").value;

  if (!name || !email || password.length < 4) {
    alert("Please fill all fields. Password must contain at least 4 characters.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        username: email,
        password: password,
        role: role.toUpperCase(),
        email: email,
        active: true
      })
    });

    if (!response.ok) {
      const message = await response.text();
      console.error("Registration failed:", message);

      alert("Registration failed. This email/username may already exist.");
      return;
    }

    alert("Account created successfully.");

    window.location.href = "login.html";

  } catch (error) {
    console.error("Registration error:", error);

    alert(
      "Unable to connect to the backend. Make sure Spring Boot is running."
    );
  }
}
async function forgotPassword() {

    const email = prompt("Enter your registered email:");

    if (!email) {
        return;
    }

    const newPassword = prompt(
        "Enter your new password (minimum 4 characters):"
    );

    if (!newPassword || newPassword.length < 4) {
        alert("Password must be at least 4 characters.");
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/users/forgot-password`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    newPassword: newPassword
                })
            }
        );

        const message = await response.text();

        if (!response.ok) {
            alert(message);
            return;
        }

        alert(message);

    } catch (error) {

        console.error("Forgot password error:", error);

        alert("Could not connect to the backend.");
    }
}