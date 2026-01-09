import { getUserInfo } from "./general/broadcast-user-info.js";

document.addEventListener("DOMContentLoaded", async () => {
  const user = await getUserInfo();
  const settingIcon = document.getElementById("carousel-settings");

  if (!user || !user.school_id || user.role !== "admin") {
    settingIcon.style.display = "none";
  } else {
    settingIcon.style.display = "flex";
  }

  const contentWrapper = document.querySelector(".content-wrapper");
  const carousel = document.getElementById("event-carousel");
  const popup = document.querySelector(".popup");
  const popupForm = document.getElementById("carousel-form");
  const backBtn = document.getElementById("back-btn");
  const carouselList = document.getElementById("carousel-images");
  const speed = 1; // Pixels per frame
  const interval = 16; // ~60fps
  let scrollInterval;

  // === 1. Define image sources ===
  const images = [];

  async function getCarouselImages() {
    images.length = 0; // reset array
    try {
      const res = await fetch(`${baseURL}controller/carousel/get-carousel-img.php`);
      const files = await res.json();

      files.forEach((file) => {
        images.push(`${baseURL}view/assets/carousel-imgs/${file}`);
      });
    } catch (error) {
      console.error("Failed to load carousel images:", error);
    }
  }

  // === 2. Dynamically populate carousel ===
  function populateCarousel(imgList) {
    carousel.innerHTML = ""; // Clear existing content
    imgList.forEach((src, index) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = `Slide ${index + 1}`;
      img.classList.add("carousel-img");
      carousel.appendChild(img);
    });

    // Duplicate content for seamless infinite scroll
    carousel.innerHTML += carousel.innerHTML;
  }

  // === 3. Auto scroll logic ===
  function autoScroll() {
    carousel.scrollLeft += speed;
    if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
      carousel.scrollLeft = 0; // Reset to start
    }
  }

  // === 4. Control functions ===
  function startScroll() {
    scrollInterval = setInterval(autoScroll, interval);
  }

  function stopScroll() {
    clearInterval(scrollInterval);
  }

  // === 5. Initialize carousel ===
  if (carousel) {
    await getCarouselImages();
    populateCarousel(images);
    startScroll();

    // === 6. Pause scrolling on hover ===
    carousel.addEventListener("mouseenter", stopScroll);
    carousel.addEventListener("mouseleave", startScroll);
  }

  async function loadPopupElements() {
    carouselList.innerHTML = "";
    addUploadBlock();
    await fetchAndDisplayImages();
    attachDeleteHandlers();
  }

  // --- ADD IMAGE BLOCK ---
  function addUploadBlock() {
    const addWrapper = document.createElement("div");
    addWrapper.classList.add("image-wrapper");
    addWrapper.id = "add-image";
    addWrapper.innerHTML = `
        <div id="add-wrapper" title="Add Image">
            <span class="material-symbols-outlined add-icon" >add</span>
            <input type="file" id="add-input" accept="image/*" style="display:none">
        </div>
    `;
    carouselList.appendChild(addWrapper);

    const addInput = addWrapper.querySelector("#add-input");
    const addIcon = addWrapper.querySelector(".add-icon");

    addIcon.addEventListener("click", () => addInput.click());

    addInput.addEventListener("change", async () => {
      const file = addInput.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch(
          `${baseURL}controller/carousel/upload-carousel-img.php`,
          { method: "POST", body: formData }
        );
        const result = await res.json();
        if (result.success) {
          await refreshCarousel();
        } else {
          alert(result.message || "Failed to upload image.");
        }
      } catch (err) {
        console.error("Upload failed:", err);
      }
    });
  }

  // --- FETCH & DISPLAY IMAGES ---
  async function fetchAndDisplayImages() {
    try {
      const res = await fetch(`${baseURL}controller/carousel/get-carousel-img.php`);
      const files = await res.json();

      files.forEach((file) => {
        const imgPath = `${baseURL}view/assets/carousel-imgs/${file}`;
        const wrapper = document.createElement("div");
        wrapper.classList.add("image-wrapper");
        wrapper.innerHTML = `
                <div class="delete-wrapper">
                    <span class="material-symbols-outlined delete-icon" data-file="${file}" title="Delete Image">
                        delete_forever
                    </span>
                </div>
                <img src="${imgPath}" alt="carousel-image" class="carousel-img">
            `;
        carouselList.appendChild(wrapper);
      });
    } catch (error) {
      console.error("Failed to load carousel images:", error);
    }
  }

  // --- ATTACH DELETE HANDLERS ---
  function attachDeleteHandlers() {
    carouselList.querySelectorAll(".delete-icon").forEach((icon) => {
      icon.addEventListener("click", async () => {
        const filename = icon.dataset.file;
        if (!confirm("Delete this image?")) return;

        try {
          const res = await fetch(
            `${baseURL}controller/carousel/delete-carousel-img.php`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ filename }),
            }
          );
          const result = await res.json();
          if (result.success) {
            await refreshCarousel();
          } else {
            alert(result.message || "Failed to delete image.");
          }
        } catch (err) {
          console.error("Delete failed:", err);
        }
      });
    });
  }

  // --- REFRESH CAROUSEL ---
  async function refreshCarousel() {
    await getCarouselImages();
    populateCarousel(images);
    await loadPopupElements();
  }

  // Carousel Settings
  settingIcon.addEventListener("click", () => {
    popup.classList.add("active");
    contentWrapper.classList.add("no-scroll");

    // Close popup when clicking BACK button
    backBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // prevents clicking the button from triggering the backdrop
      popup.classList.remove("active");
      contentWrapper.classList.remove("no-scroll");
    });

    // Close popup when clicking OUTSIDE the form (backdrop)
    popup.addEventListener("click", () => {
      popup.classList.remove("active");
      contentWrapper.classList.remove("no-scroll");
    });

    // Prevent inside click from closing popup
    popupForm.addEventListener("click", (e) => e.stopPropagation());
    loadPopupElements();
  });

  sessionStorage.removeItem("currentAccountSection");
});
