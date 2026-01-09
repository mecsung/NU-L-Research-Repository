import { getUserInfo } from "../general/broadcast-user-info.js";

document.addEventListener("DOMContentLoaded", async () => {
  /* ===================== AUTH GUARD ===================== */
  // Will be deleted once routing authentication is implemented
  const user = await getUserInfo();
  if (!user || user.role !== "admin") {
    window.location.href = baseURL;
    return;
  }

  /* ===================== STATE ===================== */
  let accountRole = "student"; // default view

  const form = document.getElementById("search-form");
  const searchInput = document.getElementById("search-bar");
  const roleFilterBtns = document.querySelectorAll(".account-btn");
  const refreshBtn = document.getElementById("refresh-btn");
  const backBtn = document.getElementById("back-btn");
  const sortFilters = document.querySelectorAll(".sort-filters");

  /* ===================== HELPERS ===================== */
  const getEndpoint = () =>
    accountRole === "student"
      ? "controller/accounts/get-students-accounts.php"
      : "controller/accounts/get-faculty-accounts.php";

  async function fetchAccounts(params = {}) {
    const query = new URLSearchParams(params);
    const res = await fetch(`${baseURL}${getEndpoint()}?${query}`);
    const data = await res.json();
    return data.accounts || [];
  }

  /* ===================== INIT ===================== */
  activateRoleFilter();
  renderAccounts(await fetchAccounts());

  /* ===================== RENDER ===================== */
  function renderAccounts(accounts) {
    searchInput.value = "";
    const listWrapper = document.getElementById("list-wrapper");
    listWrapper.innerHTML = "";

    if (!accounts.length) {
      listWrapper.innerHTML = `<span style="margin:10px;">No account found</span>`;
      return;
    }

    accounts.forEach((acc) => {
      const row = document.createElement("div");
      row.className = "row";

      row.innerHTML = `
        <span class="row-info">${acc.school_id}</span>
        <span class="row-info">${acc.first_name} ${acc.last_name}</span>
        <span class="row-info">${acc.school_email}</span>
        <span class="row-info">
          ${
            accountRole === "student"
              ? acc.program_name || ""
              : acc.department_name || ""
          }
        </span>
        <span class="row-info">${acc.role.toUpperCase()}</span>
        <div class="row-info" id="options">
          <button class="option-btn view">View</button>
          <button class="option-btn delete">Delete</button>
        </div>
      `;

      row.querySelector(".view").onclick = () => visitAccount(acc.school_id);
      row.querySelector(".delete").onclick = () =>
        deleteAccount(acc.school_id, acc.first_name);

      listWrapper.appendChild(row);
    });
  }

  /* ===================== ACTIONS ===================== */
  function visitAccount(school_id) {
    sessionStorage.setItem("previousLocation", location.href);
    window.location.href = `${baseURL}view-account?school_id=${school_id}`;
  }

  async function deleteAccount(school_id, first_name) {
    if (!confirm(`Delete ${first_name}'s account?`)) return;

    await fetch(`${baseURL}controller/accounts/delete-account.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ school_id }),
    });

    renderAccounts(await fetchAccounts());
  }

  /* ===================== ROLE FILTER ===================== */
  function activateRoleFilter() {
    roleFilterBtns[0].classList.add("active"); // default active
    roleFilterBtns.forEach((btn) => {
      btn.onclick = async () => {
        roleFilterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        accountRole = btn.value;
        renderAccounts(await fetchAccounts());
      };
    });
  }

  /* ===================== SEARCH ===================== */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    renderAccounts(await fetchAccounts({ search: searchInput.value }));
  });

  /* ===================== SORT ===================== */
  sortFilters.forEach((filter) => {
    filter.onclick = async () => {
      const column = filter.dataset.value;
      const sort = filter.dataset.sort === "asc" ? "desc" : "asc";
      filter.dataset.sort = sort;

      sortFilters.forEach((f) => {
        if (f !== filter) {
          f.dataset.sort = "asc";
          f.classList.remove("active");
        }
      });

      filter.classList.add("active");
      filter.querySelector(".sort-filters-icon").textContent =
        sort === "asc" ? "arrow_drop_up" : "arrow_drop_down";

      renderAccounts(await fetchAccounts({ column, sort }));
    };
  });

  /* ===================== Refresh and Back Btns ===================== */
  refreshBtn.onclick = async () => renderAccounts(await fetchAccounts());
  backBtn.onclick = () => (window.location.href = `${baseURL}admin-panel`);
});
