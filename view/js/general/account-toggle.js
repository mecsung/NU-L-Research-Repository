import { getUserInfo } from "./broadcast-user-info.js";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");

  async function updateHeader() {
    const user = await getUserInfo();
    header.querySelector(".account-wrapper")?.remove();

    const wrapper = document.createElement("div");
    wrapper.className = "account-wrapper";

    const logo = Object.assign(document.createElement("span"), {
      className: "material-symbols-outlined",
      id: "account-logo",
      textContent: "account_circle",
    });

    const owner = Object.assign(document.createElement("span"), {
      id: "account-owner",
      textContent: user?.first_name ? user.first_name.toUpperCase() : "Guest",
    });

    const options = Object.assign(document.createElement("div"), {
      className: "option-wrapper",
    });

    const makeOption = (text, href) => {
      const span = document.createElement("span");
      span.className = "option-text";
      span.textContent = text;
      span.addEventListener("click", () => {
        owner.dispatchEvent(new Event("click"));

        requestAnimationFrame(() => {
          sessionStorage.setItem("previousLocation", window.location.href);
          window.location.href = href;
        });
      });
      return span;
    };

    if (user?.first_name && user?.school_id) {
      const params = new URLSearchParams();
      params.append("school_id", user.school_id);
      options.append(
        makeOption(
          "View Account",
          `${baseURL}view-account?${params.toString()}`
        ),
        makeOption(
          "Sign out",
          `${baseURL}logout?redirect=${encodeURIComponent(
            window.location.pathname + window.location.search
          )}`
        )
      );
    } else {
      options.append(
        makeOption("Sign in", `${baseURL}sign-in`),
        makeOption("Create Account", `${baseURL}create-account`)
      );
    }

    wrapper.append(logo, owner, options);
    header.appendChild(wrapper);

    // Dropdown toggle
    owner.addEventListener("click", (e) => {
      e.stopPropagation();
      options.classList.toggle("visible");
    });

    document.addEventListener("click", (e) => {
      if (!options.contains(e.target)) {
        options.classList.remove("visible");
      }
    });
  }

  if (header) updateHeader();
});
