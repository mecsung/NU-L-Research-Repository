import { getUserInfo } from "../general/broadcast-user-info.js";

document.addEventListener("DOMContentLoaded", async () => {
  /* ===================== AUTH GUARD ===================== */
  // Will be deleted once routing authentication is implemented
  const user = await getUserInfo();
  if (!user || user.role !== "admin") {
    window.location.href = baseURL;
    return;
  }

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
