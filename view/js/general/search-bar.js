document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.toLowerCase(); // normalize case

  // Auto-detect correct redirect target
  let searchURL;
  let navTarget;
  if (currentPath.includes("admin-panel")) {
    navTarget = 1;
    searchURL = `${baseURL}admin-panel`;
  } else {
    searchURL = `${baseURL}search-result`;
  }

  /* ============================================================
     RENDER HEADER STRUCTURE
     ============================================================ */
  const header = document.getElementById("header");
  if (!header) {
    console.warn("Header element not found.");
    return;
  }

  const searchWrapper = document.createElement("div");
  searchWrapper.classList.add("search-wrapper");
  searchWrapper.innerHTML = `
  <form id="search-form">
    <input type="text" id="search-bar" placeholder="Search..." />
    <button type="submit" id="search-btn">Search</button>
  </form>
  <span class="material-symbols-outlined" id="filter-btn">filter_list</span>
  <div class="filters-wrapper" style="display: none;">
    <span class="filters active" data-filter="all">ALL</span>
    <span class="filters" data-filter="title">TITLE</span>
    <span class="filters" data-filter="author">AUTHOR</span>
    <span class="filters" data-filter="keyword">KEYWORD</span>
    <span class="filters" data-filter="advance">ADVANCE</span>
  </div>
`;

  header.appendChild(searchWrapper);

  /* ============================================================
     SEARCH BAR FUNCTIONALITY
     ============================================================ */
  const searchForm = document.getElementById("search-form");
  const searchBar = document.getElementById("search-bar");
  const filterOptions = document.querySelectorAll(".filters");
  let selectedFilter = "all";

  filterOptions.forEach((filter) => {
    filter.addEventListener("click", () => {
      filterOptions.forEach((f) => f.classList.remove("active"));
      filter.classList.add("active");
      selectedFilter = filter.getAttribute("data-filter");
    });
  });

  if (searchForm && searchBar) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      sessionStorage.setItem("currentArchiveSection", navTarget || 0);
      const query = searchBar.value.trim();
      if (!query) {
        window.location.href = searchURL;
        return;
      }
      // Redirect to search
      const params = new URLSearchParams();
      params.set("q", query);
      if (selectedFilter) params.set("filter", selectedFilter);

      window.location.href = `${searchURL}?${params.toString()}`;
    });
  }

  /* ============================================================
     FILTER TOGGLE FUNCTIONALITY
     ============================================================ */
  const filterBtn = document.getElementById("filter-btn");
  const filtersWrapper = document.querySelector(".filters-wrapper");
  let visibleFilters = false;

  if (filterBtn && filtersWrapper) {
    filterBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      visibleFilters = !visibleFilters;
      filtersWrapper.style.display = visibleFilters ? "flex" : "none";
    });

    document.addEventListener("click", (e) => {
      if (
        visibleFilters &&
        !filtersWrapper.contains(e.target) &&
        e.target !== filterBtn
      ) {
        filtersWrapper.style.display = "none";
        visibleFilters = false;
      }
    });
  }
});
