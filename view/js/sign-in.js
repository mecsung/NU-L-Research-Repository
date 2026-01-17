document.addEventListener("DOMContentLoaded", () => {
  const formWrapper = document.getElementById("form-wrapper");

  // Add a small delay for a smoother effect (optional)
  setTimeout(() => {
    formWrapper.classList.add("show");
  }, 100);

  document.getElementById("create-btn").addEventListener("click", () => {
    window.location.href = baseURL + "create-account";
  });

  // document.getElementById("back-btn").addEventListener("click", () => {
  //   window.location.href = baseURL;
  // });

  const form = document.getElementById("form-wrapper");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const school_id = document.getElementById("school-id").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!school_id || !password) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}controller/authentication/verify-account.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ school_id, password }),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert(`Welcome, ${result.first_name.toUpperCase()}! Redirecting...`);

        // Redirect based on role
        const prevLocation =
          sessionStorage.getItem("previousLocation") || baseURL;
        switch (result.role) {
          case "admin":
            window.location.href = `${baseURL}admin-panel`;
            break;
          case "faculty":
          case "student":
          default:
            window.location.href = prevLocation;
            break;
        }
      } else {
        alert(result.message || "Invalid School ID or Password");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error. Please try again later.");
    }
  });
});
