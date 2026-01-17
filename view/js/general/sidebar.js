import { getUserInfo } from "./broadcast-user-info.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Target container
  const contentWrapper = document.querySelector("body");
  if (!contentWrapper) return;

  // Sidebar container
  const sideBar = document.createElement("div");
  sideBar.id = "side-bar";

  // Title section
  const titleWrapper = document.createElement("div");
  titleWrapper.classList.add("title-wrapper");
  titleWrapper.innerHTML = `
  <div id="sidebar-label">
    <img src="${baseURL}view/assets/favicons/Icon.png" alt="Logo" class="logo"/>
    <div class="title-text">
      <span id="title">LRC THESIS</span>
      <span id="subtitle">REPOSITORY</span>
    </div></div>
    
    <span class="material-symbols-outlined menu-icon">menu_open</span>
  `;
  sideBar.appendChild(titleWrapper);

  // Category data
  const categories = [
    {
      title: "Program",
      icon: "menu_book",
      items: [
        "BSAIS",
        "BSA",
        "BSBA",
        "BSTM",
        "BSIT",
        "BSCS",
        "BSIS",
        "BSCrim",
        "BSESS",
        "BSP",
        "BMMA",
        "BACOMM",
        "BSArch",
        "BSCpE",
        "BSCE",
        "MM",
        "MIT",
        "MAEd-Eng",
        "MAEd-Fil",
        "MAEd-SPED",
        "MAEd-EM",
        "EdD-EM",
      ],
    },
    {
      title: "Methodology",
      icon: "science",
      items: [
        "Quantitative",
        "Qualitative",
        "Mixed-Methods",
        "Case Study",
        "Experimental Design",
        "Survey Method",
        "Grounded Theory",
        "Phenomenological",
      ],
    },
    {
      title: "Thesis type",
      icon: "type_specimen",
      items: [
        "Experimental Research",
        "Descriptive Research",
        "Correlational Research",
        "Qualitative Case Study",
        "Mixed-Methods Research",
        "Survey Research",
        "Action Research",
        "Ethnographic Research",
      ],
    },
  ];

  // Function to render each category
  function renderCategory({ title, icon, items }) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("category-wrapper");

    // Title
    const titleWrapper = document.createElement("div");
    titleWrapper.classList.add("category-title-wrapper");
    titleWrapper.innerHTML = `
      <span class="material-symbols-outlined category-icon">${icon}</span>
      <span class="category-label">${title}</span>
    `;
    wrapper.appendChild(titleWrapper);

    // Checkbox container
    const carousel = document.createElement("div");
    carousel.classList.add("category-carousel");
    const visibleCount = 3;

    items.forEach((item, index) => {
      const label = document.createElement("label");
      label.innerHTML = `
        <input type="checkbox" name="${item}" value="${item}">
        ${item}
      `;
      if (index >= visibleCount) label.classList.add("hidden-checkbox");
      carousel.appendChild(label);
    });

    // Add "More..." toggle
    if (items.length > visibleCount) {
      const moreSpan = document.createElement("span");
      moreSpan.classList.add("show-more");
      moreSpan.textContent = "More...";
      carousel.appendChild(moreSpan);

      let expanded = false;
      moreSpan.addEventListener("click", () => {
        expanded = !expanded;
        carousel.querySelectorAll(".hidden-checkbox").forEach((el) => {
          el.style.display = expanded ? "inline-flex" : "none";
        });
        moreSpan.textContent = expanded ? "Show less" : "More...";
      });
    }

    wrapper.appendChild(carousel);
    return wrapper;
  }

  // Render all categories
  categories.forEach((cat) => {
    sideBar.appendChild(renderCategory(cat));
  });

  const account = await getUserInfo();

  if (account && account.role === "admin") {
    const adminPanel = document.createElement("div");
    adminPanel.classList.add("admin-panel-wrapper");
    adminPanel.innerHTML = `
    <a href="${baseURL}admin-panel" class="admin-panel-link">
      <span class="material-symbols-outlined admin-icon">manage_accounts</span>
      <span id="admin-text">ADMIN PANEL</span>
    </a>
  `;
    sideBar.appendChild(adminPanel);
  }

  
  // const socials = document.createElement("div");
  // socials.classList.add("social-media");
  // socials.innerHTML = `
  //   <span>FOLLOW US ON</span>
  //   <div class="icons">
  //     <div class="img-wrapper"><img src="${baseURL}view/assets/social-icons/yt.png" alt="youtube" /></div>
  //     <div class="img-wrapper"><img src="${baseURL}view/assets/social-icons/fb.png" alt="facebook" /></div>
  //     <div class="img-wrapper"><img src="${baseURL}view/assets/social-icons/insta.png" alt="instagram" /></div>
  //     <div class="img-wrapper"><img src="${baseURL}view/assets/social-icons/linked.png" alt="linkedin" /></div>
  //   </div>
  // `;
  // sideBar.appendChild(socials);

  // Append sidebar to content wrapper
  contentWrapper.appendChild(sideBar);

  const logo = document.getElementById("sidebar-label");

  // Attach event listeeners below this point
  logo.addEventListener("click", () => {
    window.location.href = baseURL;
  });

  document.body.addEventListener("change", (e) => {
    if (e.target.matches("input[type='checkbox']")) {
      const selectedPrograms = [
        ...document.querySelectorAll(
          ".category-wrapper:nth-child(2) input:checked"
        ),
      ].map((cb) => cb.value);
      const selectedMethods = [
        ...document.querySelectorAll(
          ".category-wrapper:nth-child(3) input:checked"
        ),
      ].map((cb) => cb.value);
      const selectedTypes = [
        ...document.querySelectorAll(
          ".category-wrapper:nth-child(4) input:checked"
        ),
      ].map((cb) => cb.value);

      const event = new CustomEvent("filtersChanged", {
        detail: {
          programs: selectedPrograms,
          methods: selectedMethods,
          types: selectedTypes,
        },
      });
      document.dispatchEvent(event);
    }
  });

  let collapsed = sessionStorage.getItem("sidebarCollapsed") === "true";

  const menu_icon = document.querySelector(".menu-icon");

  // Apply the saved state immediately on page load
  if (collapsed) {
    sideBar.classList.add("collapsed");
    menu_icon.textContent = "keyboard_double_arrow_right";
  } else {
    sideBar.classList.remove("collapsed");
    menu_icon.textContent = "keyboard_double_arrow_left";
  }

  function setSidebarCollapsed(isCollapsed) {
    collapsed = isCollapsed;
    sideBar.classList.toggle("collapsed", collapsed);
    sessionStorage.setItem("sidebarCollapsed", collapsed);
    menu_icon.textContent = collapsed
      ? "keyboard_double_arrow_right"
      : "keyboard_double_arrow_left";

    const message = collapsed ? "collapsed" : "expanded";
    const event = new CustomEvent("broadcastMessage", {
      detail: { text: message },
    });
    window.dispatchEvent(event);
  }

  // Handle toggle click
  menu_icon.addEventListener("click", () => {
    setSidebarCollapsed(!collapsed);
  });

  // Handle category title click
  document
    .querySelectorAll(".category-title-wrapper")
    .forEach((titleWrapper) => {
      titleWrapper.addEventListener("click", () => {
        setSidebarCollapsed(false); // always expand when a category is clicked
      });
    });
});
