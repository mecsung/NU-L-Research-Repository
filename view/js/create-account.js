document.addEventListener("DOMContentLoaded", () => {
  const formWrapper = document.getElementById("form-wrapper");

  // Add a small delay for a smoother effect (optional)
  setTimeout(() => {
    formWrapper.classList.add("show");
  }, 100);

  document.getElementById("sign-in-btn").addEventListener("click", () => {
    window.location.href = baseURL + "sign-in";
  });

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = baseURL;
  });

  const roleSelection = document.getElementById("role-selection");
  const subtypeSelection = document.getElementById("subtype-selection");
  roleSelection.addEventListener("change", async function () {
    subtypeSelection.options.length = 1; // Clear previous options except the first
    let link;
    if (this.value === "faculty") {
      link = "controller/get-department-list.php";
    } else {
      link = "controller/get-program-list.php";
    }
    const data = await fetch(baseURL + link);
    const programs = await data.json();
    programs.forEach(({ id, name, acronym }) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = `${name} (${acronym})`;
      subtypeSelection.appendChild(option);
    });
  });

  formWrapper.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const formData = {
      schoolId: document.getElementById("school-id").value,
      email: document.getElementById("email").value,
      firstname: document.getElementById("firstname").value,
      lastname: document.getElementById("lastname").value,
      password: document.getElementById("password").value,
      role: document.getElementById("role-selection").value,
      program_id: document.getElementById("subtype-selection").value,
    };

    // Validate role is selected

    if (!formData.role || formData.role === "" || formData.role === null) {
      alert("Please select a role");
      document.getElementById("role-selection").focus(); // Focus on the select
      return false;
    }

    if (
      !formData.program_id ||
      formData.program_id === "" ||
      formData.program_id === null
    ) {
      alert("Please select a proram");
      document.getElementById("subtype-selection").focus(); // Focus on the select
      return false;
    }

    // Send POST request
    fetch(baseURL + "controller/authentication/process-account.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(data.message);
          window.location.href = baseURL + "sign-in";
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  });
});
