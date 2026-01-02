import { getUserInfo } from "../general/broadcast-user-info.js";

document.addEventListener("DOMContentLoaded", async () => {
  (async function checkUserRole() {
    const user = await getUserInfo();

    // If user is null (guest) or not admin, redirect
    if (!user || !user.school_id || user.role !== "admin") {
      window.location.href = baseURL;
    }
  })();

  let accountRole = "student"; // As soon as it loads show students sections only
  // Searchbar
  const form = document.getElementById("search-form");
  const searchInput = document.getElementById("search-bar");
  // Buttons
  const roleFilterBtns = document.querySelectorAll(".account-btn");
  const refreshBtn = document.getElementById("refresh-btn");
  const backBtn = document.getElementById("back-btn");

  //Sorting Filters
  const sortFilters = document.querySelectorAll(".sort-filters");

  // Initialization
  async function init() {
    activateRoleFilter();
    renderAccounts(await getAccounts(), accountRole);
  }

  // Fetch All Accounts
  async function getAccounts() {
    const setParams = new URLSearchParams({ role: accountRole });
    const response = await fetch(
      `${baseURL}controller/accounts/get-all-accounts.php?${setParams.toString()}`
    );
    const data = await response.json();
    const accounts = data.accounts;

    return accounts;
  }

  // Render Fetched Account into HTML
  function renderAccounts(accounts) {
    const listWrapper = document.getElementById("list-wrapper");
    listWrapper.innerHTML = ""; // Empty the list

    if (!accounts || accounts.length === 0) {
      listWrapper.innerHTML = `
      <span style="margin-top: 10px; margin-left: 10px;">No account was Found</span>
      `;
      return;
    }

    accounts.forEach((account) => {
      // Create a new row div
      const row = document.createElement("div");
      row.classList.add("row");

      // School ID
      const schoolId = document.createElement("span");
      schoolId.classList.add("row-info");
      schoolId.textContent = account.school_id;
      row.appendChild(schoolId);

      // Name
      const name = document.createElement("span");
      name.classList.add("row-info");
      name.textContent = `${account.first_name} ${account.last_name}`;
      row.appendChild(name);

      // School Email
      const email = document.createElement("span");
      email.classList.add("row-info");
      email.textContent = account.school_email;
      row.appendChild(email);

      // Program
      const program = document.createElement("span");
      program.classList.add("row-info");
      program.textContent = account.program_name || ""; // assuming program_name is returned
      row.appendChild(program);

      // Role
      const role = document.createElement("span");
      role.classList.add("row-info");
      role.textContent = account.role.toUpperCase();
      row.appendChild(role);

      // Options
      const options = document.createElement("div");
      options.classList.add("row-info");
      options.id = "options";

      const viewBtn = document.createElement("button");
      viewBtn.type = "button";
      viewBtn.classList.add("option-btn");
      viewBtn.textContent = "View";
      options.appendChild(viewBtn);

      viewBtn.addEventListener("click", () => visitAccount(account.school_id));

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.classList.add("option-btn");
      deleteBtn.textContent = "Delete";
      options.appendChild(deleteBtn);

      deleteBtn.addEventListener("click", () =>
        deleteAccount(account.school_id, account.first_name)
      );

      row.appendChild(options);

      listWrapper.appendChild(row);
    });

    // Visit/View an account
    function visitAccount(school_id) {
      const params = new URLSearchParams({ school_id });
      sessionStorage.setItem("previousLocation", window.location.href);
      window.location.href = `${baseURL}view-account?${params.toString()}`;
    }

    // Delete an account
    async function deleteAccount(school_id, first_name) {
      if (!confirm(`Are you sure you want to delete ${first_name}'s account?`))
        return;

      try {
        const response = await fetch(
          `${baseURL}controller/accounts/delete-account.php`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ school_id }),
          }
        );

        // Parse JSON response from the server
        const result = await response.json();

        if (result.success) {
          alert(result.message || "Account deleted successfully.");
        } else {
          alert(result.message || "Failed to delete the account.");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("An unexpected error occurred while deleting the account.");
      }

      // Refresh the account list after deletion
      const accounts = await getAccounts();
      renderAccounts(accounts, accountRole);
    }
  }

  // Role Filter
  function activateRoleFilter() {
    roleFilterBtns.forEach((btn) => {
      if (btn.value === accountRole) {
        btn.classList.add("active");
      }
    });

    roleFilterBtns.forEach((btn) => {
      btn.addEventListener("click", async () => {
        roleFilterBtns.forEach((btn) => {
          btn.classList.remove("active");
        });

        btn.classList.add("active");
        accountRole = btn.value;
        renderAccounts(await getAccounts());
      });
    });
  }

  // Activate Refresh Btn
  refreshBtn.addEventListener("click", async () => {
    renderAccounts(await getAccounts(), accountRole);
  });

  //Activate Back Btn
  backBtn.addEventListener("click", () => {
    window.location.href = `${baseURL}admin-panel`;
  });

  // Activate Search-Bar
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent page reload
    await searchAccount(searchInput.value);
  });

  // Searching Function
  async function searchAccount(searchTerm) {
    const setParams = new URLSearchParams({
      search: searchTerm,
      role: accountRole,
    });

    const response = await fetch(
      `${baseURL}controller/accounts/search-account.php?${setParams.toString()}`
    );

    if (response) {
      const data = await response.json();
      const accounts = data.accounts;

      renderAccounts(accounts, accountRole);
    }
  }

  // Sort Filters
  sortFilters.forEach((filter) => {
    filter.addEventListener("click", async (e) => {
      filter.classList.add("active");
      const column = filter.dataset.value;
      let sort = filter.dataset.sort === "asc" ? "desc" : "asc";
      filter.dataset.sort = sort;

      // get the icon inside the clicked span
      const icon = filter.querySelector(".sort-filters-icon");

      // update icon direction
      icon.textContent = sort === "asc" ? "arrow_drop_up" : "arrow_drop_down";

      // reset all other icons
      sortFilters.forEach((other) => {
        if (other !== filter) {
          other.classList.remove("active");
          const otherIcon = other.querySelector(".sort-filters-icon");
          other.dataset.sort = "asc"; // reset
          otherIcon.textContent = "arrow_drop_up";
        }
      });

      // fetch results
      const params = new URLSearchParams({
        role: accountRole,
        column: column,
        sort: sort,
      });

      const response = await fetch(
        `${baseURL}controller/accounts/get-all-accounts.php?${params.toString()}`
      );
      const data = await response.json();
      renderAccounts(data.accounts, accountRole);
    });
  });
  init();
  sessionStorage.removeItem("currentAccountSection");
});
