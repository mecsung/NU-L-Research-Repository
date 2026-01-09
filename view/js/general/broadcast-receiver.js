// This is to broadcast the sidebar state to other components
// Sidebar state could be "expanded" or "collapsed"
document.addEventListener("DOMContentLoaded", () => {
  const content_wrapper = document.querySelector(".content-wrapper");

  // Apply saved state on load
  const collapsed = sessionStorage.getItem("sidebarCollapsed") === "true";
  if (collapsed) {
    content_wrapper.classList.add("collapsed");
    content_wrapper.classList.remove("expanded");
  } else {
    content_wrapper.classList.remove("collapsed");
    content_wrapper.classList.add("expanded");
  }

  // Listen for broadcast events from the sidebar toggle
  window.addEventListener("broadcastMessage", (e) => {
    if (e.detail.text === "collapsed") {
      content_wrapper.classList.add("collapsed");
      content_wrapper.classList.remove("expanded");
    } else {
      content_wrapper.classList.remove("collapsed");
      content_wrapper.classList.add("expanded");
    }
  });
});
