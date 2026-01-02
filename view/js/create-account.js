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
  document
    .getElementById("form-wrapper")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const formData = {
        schoolId: document.getElementById("school-id").value,
        email: document.getElementById("email").value,
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value,
        password: document.getElementById("password").value,
        role: document.getElementById("role-selection").value,
        program_id: document.getElementById("program-selection").value,
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
        document.getElementById("program-selection").focus(); // Focus on the select
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
            alert("Account created successfully!");
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

  const programSelect = document.getElementById("program-selection");
  const programs = [
    { id: 1, name: "Master in Management", code: "MM" },
    { id: 2, name: "BS Accounting Information System", code: "BSAIS" },
    { id: 3, name: "BS Accountancy", code: "BSA" },
    {
      id: 4,
      name: "BS Business Administration major in Marketing and Advertising",
      code: "BSBA-MA",
    },
    { id: 5, name: "BS Tourism Management", code: "BSTM" },
    { id: 6, name: "BS Information Technology", code: "BSIT" },
    { id: 7, name: "BS Computer Science", code: "BSCS" },
    { id: 8, name: "BS Information Systems", code: "BSIS" },
    { id: 9, name: "BS Criminology", code: "BSCrim" },
    {
      id: 10,
      name: "Bachelor of Science in Exercise and Sports Science",
      code: "BSESS",
    },
    { id: 11, name: "BS Psychology", code: "BSPsy" },
    { id: 12, name: "Bachelor of Multimedia Arts", code: "BMMA" },
    { id: 13, name: "BA Communication", code: "BACOMM" },
    { id: 14, name: "BS Architecture", code: "BSArch" },
    { id: 15, name: "BS Computer Engineering", code: "BSCpE" },
    { id: 16, name: "BS Civil Engineering", code: "BSCE" },
    { id: 17, name: "Master in Information Technology", code: "MIT" },
    { id: 18, name: "MA in Education, Major in English", code: "MAEd-Eng" },
    { id: 19, name: "MA in Education, Major in Filipino", code: "MAEd-Fil" },
    {
      id: 20,
      name: "MA in Education, Major in Special Education",
      code: "MAEd-SPED",
    },
    {
      id: 21,
      name: "MA in Education, Major in Educational Management",
      code: "MAEd-EM",
    },
    {
      id: 22,
      name: "Doctor of Education, Major in Educational Management",
      code: "EdD-EM",
    },
  ];

  programs.forEach(({ id, name, code }) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = `${name} (${code})`;
    programSelect.appendChild(option);
  });
});
