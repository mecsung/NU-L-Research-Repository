import { getUserInfo } from "../general/broadcast-user-info.js";

document.addEventListener("DOMContentLoaded", () => {
  (async function checkUserRole() {
    const user = await getUserInfo();

    // If user is null (guest) or not admin, redirect
    if (!user || !user.school_id || user.role !== "admin") {
      window.location.href = baseURL;
    }
  })();

  initNavigation();
  initThesisArchive();
  initDashboard();
});

// ============================================================
// Navigation Between Dashboard and Thesis List
// ============================================================
const currentSection = sessionStorage.getItem("currentArchiveSection")
  ? sessionStorage.getItem("currentArchiveSection")
  : 0;
function initNavigation() {
  sessionStorage.setItem("currentAccountSection", currentSection);

  const navItems = document.querySelectorAll(".nav-item");
  const archiveSetions = document.querySelectorAll(".archive-section");

  navItems[currentSection].classList.add("active");
  archiveSetions[currentSection].style.display = "grid";

  navItems.forEach((nav, index) => {
    nav.addEventListener("click", () => {
      navItems.forEach((nav) => {
        nav.classList.remove("active");
      });

      nav.classList.add("active");
      archiveSetions.forEach((section, i) => {
        if (i == index) {
          section.style.display = "grid";
        } else {
          section.style.display = "none";
        }
      });

      sessionStorage.setItem("currentArchiveSection", index);
    });
  });
}
