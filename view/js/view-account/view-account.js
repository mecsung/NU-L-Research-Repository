import { getUserInfo } from "../general/broadcast-user-info.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Check if signed in
  (async function checkUserCookie() {
    const user = await getUserInfo();
    if (user === null) {
      window.location.href = `${baseURL}`;
      return;
    }
    if (!user.school_id) window.location.href = `${baseURL}`;
  })();

  (function initBackBtn() {
    const backBtn = document.getElementById("back-btn");

    backBtn.addEventListener("click", () => {
      window.location.href = sessionStorage.getItem("previousLocation");
    });
  })();

  const getParams = new URLSearchParams(window.location.search);
  const school_id = getParams.get("school_id"); // Current account being viewed school Id

  const user = await getUserInfo(); // Viewer info
  const user_school_id = user.school_id; // Viewer school id
  const role = user.role; // Viewer role

  if (school_id != user_school_id && role !== "admin") {
    window.location.href = `${baseURL}`;
  }

  let currentSection = sessionStorage.getItem("currentAccountSection")
    ? sessionStorage.getItem("currentAccountSection")
    : 0;
  sessionStorage.setItem("currentAccountSection", currentSection);

  // Function to activate navigation
  function activateNavigation() {
    const navItems = document.querySelectorAll(".nav-list");
    const sections = document.querySelectorAll(".info-section-items");

    setTimeout(() => {
      navItems[currentSection].classList.add("active");
      sections[currentSection].classList.add("active");
    }, 100);

    navItems.forEach((nav, index) => {
      nav.addEventListener("click", () => {
        // Remove the active class on all the nav buttons and info-section-items
        navItems.forEach((nav) => {
          nav.classList.remove("active");
        });
        sections.forEach((section) => {
          section.classList.remove("active");
        });

        // Activate the clicked nav button and the corresponding info-section-item
        nav.classList.add("active");
        sections[index].classList.add("active");

        sessionStorage.setItem("currentAccountSection", index);
      });
    });
  }

  // Set school_id as parameter
  const setParams = new URLSearchParams();
  setParams.append("school_id", school_id);

  // Fetch Helper
  async function fetchData(phpFile) {
    try {
      const response = await fetch(
        `${baseURL}controller/accounts/${phpFile}?${setParams.toString()}`
      );

      if (!response) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch {}
  }

  async function fetchAccountInfo() {
    const phpFile = "get-account-info.php";
    const data = await fetchData(phpFile);

    if (data) {
      renderAccountInformation(data.account_info);
    }

    function renderAccountInformation(account) {
      const accountName = document.getElementById("account-name");
      const membershipDate = document.getElementById("membership-date");
      const schoolId = document.getElementById("school-id");
      const schoolEmail = document.getElementById("school-email");
      const role = document.getElementById("account-role");
      const program = document.getElementById("account-program");

      accountName.textContent = (
        account.first_name +
        " " +
        account.last_name
      ).toUpperCase();
      membershipDate.textContent = `Member Since: ${account.date_created}`;
      schoolId.value = account.school_id;
      schoolEmail.value = account.school_email;
      role.value = account.role.toUpperCase();
      program.value = account.program_name || account.department_name || "";
    }
  }

  // Function to sign out account
  function initSignOut() {
    const signOutBtn = document.getElementById("sign-out-wrapper");

    if (school_id != user_school_id) {
      signOutBtn.style.display = "none";
      return;
    }

    function logOut() {
      const redirectPath = window.location.pathname + window.location.search;

      window.location.href = `${baseURL}logout?redirect=${encodeURIComponent(
        redirectPath
      )}`;
    }

    signOutBtn.addEventListener("click", logOut);
  }

  async function fetchViewingHistory() {
    const phpFile = "get-viewing-history.php";
    const data = await fetchData(phpFile);

    if (data) {
      renderRow(data.viewing_history);
    }

    function renderRow(viewing_history) {
      const wrapper = document.getElementById("history-list-wrapper");
      if (!viewing_history || viewing_history.length === 0) {
        wrapper.innerHTML = "Currently don't have theses viewing history";
        return;
      }

      // Clear previous rows if any
      wrapper.innerHTML = "";

      viewing_history.forEach((item) => {
        // Create row container
        const row = document.createElement("div");
        row.classList.add("row");

        // Thesis name
        const thesisName = document.createElement("span");
        thesisName.classList.add("thesis-name");
        thesisName.textContent = item.title;

        // View date
        const viewDate = document.createElement("span");
        viewDate.classList.add("view-date");
        // Optional: format date nicely
        viewDate.textContent = new Date(item.viewed_at).toLocaleString();

        // Button wrapper
        const btnWrapper = document.createElement("div");
        btnWrapper.classList.add("btn-wrapper");

        const revisitBtn = document.createElement("button");
        revisitBtn.type = "button";
        revisitBtn.classList.add("re-visit-btn");
        revisitBtn.textContent = "Re-Visit";

        // Optional: add click handler to redirect to the thesis page
        revisitBtn.addEventListener("click", () => {
          window.location.href = `${baseURL}view-thesis?id=${item.thesis_id}`;
        });

        btnWrapper.appendChild(revisitBtn);

        // Append all elements to row
        row.appendChild(thesisName);
        row.appendChild(viewDate);
        row.appendChild(btnWrapper);

        // Append row to wrapper
        wrapper.appendChild(row);
      });
    }
  }

  activateNavigation();
  fetchAccountInfo();
  fetchViewingHistory();
  initSignOut();
});
