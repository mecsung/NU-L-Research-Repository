import { getUserInfo } from "../general/broadcast-user-info.js";

document.addEventListener("DOMContentLoaded", async () => {
  const getParams = new URLSearchParams(window.location.search);
  const school_id = getParams.get("school_id"); // Current account being viewed school Id

  const user = await getUserInfo();
  const user_school_id = user.school_id; // Viewer school id

  const enableModifying = user_school_id === school_id ? true : false; // Enable the deletion of favorites

  async function fetchData() {
    const setParams = new URLSearchParams();
    setParams.append("school_id", school_id);
    try {
      const res = await fetch(
        `${baseURL}controller/favorite/get-favorites.php?${setParams.toString()}`
      );
      const data = await res.json();

      if (data.success) {
        const favorites = data.data;
        const wrapper = document.getElementById("favorite-list-wrapper");

        if (!favorites.length) {
          wrapper.innerHTML = "<p>No favorites found.</p>";
          return;
        }

        wrapper.innerHTML = favorites
          .map(
            (f) => `
          <div class="thesis-card" >
            <div class="major-details">
              <div class="card-header">
                <span class="thesis-title" data-thesis-id="${f.thesis_id}">
                  ${f.title}
                </span>
                  ${
                    enableModifying
                      ? `<div class="option-wrapper">
                  <span class="material-symbols-outlined option-icon">
                    more_vert
                  </span>
                  <div class="option">
                    <span class="remove-fav" data-thesis-id="${f.thesis_id}">
                      Remove from Favorites
                    </span>
                  </div>
                </div>`
                      : ""
                  }
                
              </div>

              <span class="thesis-author">
                by ${f.author_name ?? "Unknown Author"}
              </span>
              <span class="thesis-abstract">
                ${f.abstract}
              </span>
            </div>

            <div class="minor-details">
              <span class="pub-date">
                Published: ${formatDate(f.pub_date)}
              </span>

              <div class="stars-wrapper">
                <span class="rating">
                  Rating: ${f.avg_rating} (${f.rating_count})
                </span>
                ${renderStars(f.avg_rating ?? 0)}
              </div>
            </div>
          </div>
        `
          )
          .join("");

        setupOptionToggles();
        setupRemoveFavorites();
        setupThesisClick();
      } else {
        console.error("Error:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  // 🔹 View thesis details
  function fetchThesisDetails(thesis_id) {
    window.location.href = `${baseURL}view-thesis?id=${thesis_id}`;
  }

  function setupThesisClick() {
    const cards = document.querySelectorAll(".thesis-title");

    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        if (
          e.target.closest(".option") ||
          e.target.classList.contains("option-icon")
        )
          return;
        const thesisId = card.dataset.thesisId;
        fetchThesisDetails(thesisId);
      });
    });
  }

  // 🔹 Handle toggle for options menu
  function setupOptionToggles() {
    const optionToggles = document.querySelectorAll(".option-icon");
    const optionWrappers = document.querySelectorAll(".option");

    optionToggles.forEach((toggle, index) => {
      toggle.addEventListener("click", (event) => {
        event.stopPropagation();
        const opt = optionWrappers[index];
        const isOpen = opt.classList.contains("show-option");
        optionWrappers.forEach((o) =>
          o.classList.remove("show-option", "left")
        );
        if (!isOpen) {
          opt.classList.add("show-option");
          if (opt.getBoundingClientRect().right > window.innerWidth) {
            opt.classList.add("left");
          }
        }
      });
    });

    document.addEventListener("click", () => {
      optionWrappers.forEach((opt) =>
        opt.classList.remove("show-option", "left")
      );
    });
  }

  // 🔹 Remove from favorites
  async function removeToFavorite(thesis_id, school_id) {
    try {
      await fetch(`${baseURL}controller/favorite/remove-favorite.php`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thesis_id: thesis_id,
          school_id: school_id,
        }),
      });
      // Re-fetch to update the list
      fetchData();
    } catch (err) {
      console.error("Favorite Error:", err);
    }
  }

  // 🔹 Attach remove event listeners
  function setupRemoveFavorites() {
    const buttons = document.querySelectorAll(".remove-fav");
    buttons.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const thesisId = btn.dataset.thesisId;
        await removeToFavorite(thesisId, school_id);
      });
    });
  }

  // 🔹 Helper: format date nicely
  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // 🔹 Star rendering
  function renderStars(rating = 0) {
    const stars = [];
    const rounded = Math.round(rating * 2) / 2;

    for (let i = 1; i <= 5; i++) {
      let icon = "star_border";
      let starClass = "empty";

      if (i <= Math.floor(rounded)) {
        icon = "star";
        starClass = "full";
      } else if (i - 0.5 <= rounded && rounded < i) {
        icon = "star_half";
        starClass = "half";
      }

      stars.push(`
      <span 
        class="material-symbols-outlined stars ${starClass}"
        data-value="${i}"
        aria-label="Rating star ${i}"
      >
        ${icon}
      </span>
    `);
    }

    return stars.join("");
  }

  fetchData();
});
