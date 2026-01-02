document.addEventListener("DOMContentLoaded", () => {
  const contentWrapper = document.querySelector(".content-wrapper");
  const resultWrapper = document.getElementById("result-wrapper");
  const paginationWrapper = document.querySelector(
    ".pagination-wrapper .buttons-wrapper"
  );
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q") || "";
  const filter = urlParams.get("filter") || "all";
  const RESULTS_PER_PAGE = 10;

  let allResultsHTML = [];
  let currentPage = 1;

  async function fetchResults() {
    const params = new URLSearchParams({
      ajax: 1,
      q: query,
      filter: filter === "all" || filter === "advance" ? "none" : filter,
      programs: getSelectedValues("PROGRAMS").join(","),
      methods: getSelectedValues("METHODOLOGY").join(","),
      types: getSelectedValues("THESIS_TYPE").join(","),
    });

    resultWrapper.innerHTML = "<p>Loading results...</p>";

    try {
      const res = await fetch(
        `${baseURL}controller/search-thesis.php?${params}`
      );
      if (!res.ok) throw new Error("HTTP " + res.status);
      const result = await res.json();

      if (
        !result.success ||
        !Array.isArray(result.data) ||
        !result.data.length
      ) {
        resultWrapper.innerHTML = `<p style="margin-left: 1em">No results found.</p>`;
        paginationWrapper.innerHTML = "";
        sessionStorage.removeItem("searchResults");
        return;
      }

      allResultsHTML = result.data.map((row) => {
        const div = document.createElement("div");
        div.className = "result-card";
        div.dataset.id = row.thesis_id;
        div.dataset.number = row.number;

        const title = escapeHTML(row.title || "Untitled");
        const author = escapeHTML(row.author || "Unknown author");
        const abstractText =
          sanitizeAbstract(row.abstract) || "No abstract available.";
        const pubDate = escapeHTML(row.pub_date || "Unknown");
        const visits = row.visit_count || 0;
        const rating = row.avg_rating ?? 0;
        const ratingCount = row.rating_count ?? 0;

        div.innerHTML = `
          <div class="result-number"><span class="number">${
            row.number
          }</span></div>
          <div class="content-wrapper">
            <p class="title" data-thesis-id="${row.thesis_id}">${title}</p>
            <p class="author">by ${author}</p>
            <p class="abstract">${abstractText}</p>
            <div class="other-data">
              <p class="pub-visits">Published: ${pubDate} | Visits: ${visits}</p>
              <div class="stars-wrapper">
                <span class="rating">Rating: ${rating} (${ratingCount})</span>
                ${renderStars(rating)}
              </div>
            </div>
          </div>
        `;
        return div;
      });

      renderPage(1);

      resultWrapper.addEventListener("click", (e) => {
        const titleEl = e.target.closest(".title");
        if (!titleEl || !resultWrapper.contains(titleEl)) return;

        const thesisId = titleEl.dataset.thesisId;
        if (!thesisId) return;

        window.location.href = `${baseURL}view-thesis?id=${thesisId}`;

        const order = allResultsHTML.map((div) => ({
          id: div.dataset.id,
          number: div.dataset.number,
        }));
        sessionStorage.setItem("searchResults", JSON.stringify(order));
      });
    } catch (err) {
      console.error("Error fetching results:", err);
      resultWrapper.innerHTML = "<p>Failed to load results.</p>";
    }
  }

  function renderStars(rating = 0) {
    const rounded = Math.round(rating * 2) / 2;
    return Array.from({ length: 5 }, (_, i) => {
      const n = i + 1;
      const full = n <= Math.floor(rounded);
      const half = n - 0.5 <= rounded && rounded < n;
      return `
        <span class="material-symbols-outlined stars ${
          full ? "full" : half ? "half" : "empty"
        }"
              data-value="${n}" aria-label="Rating star ${n}">
          ${full ? "star" : half ? "star_half" : "star_border"}
        </span>
      `;
    }).join("");
  }

  function sanitizeAbstract(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    temp
      .querySelectorAll(
        "script,style,link,meta,iframe,object,embed,form,input,button,textarea,select"
      )
      .forEach((el) => el.remove());

    temp.querySelectorAll("*").forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (
          attr.name.startsWith("on") ||
          ["src", "href", "action", "xmlns"].includes(attr.name.toLowerCase())
        ) {
          el.removeAttribute(attr.name);
        }
      });
    });

    return temp.innerHTML;
  }

  function renderPage(page) {
    currentPage = page;
    const start = (page - 1) * RESULTS_PER_PAGE;
    const end = start + RESULTS_PER_PAGE;

    resultWrapper.innerHTML = "";
    allResultsHTML
      .slice(start, end)
      .forEach((card) => resultWrapper.appendChild(card));

    resultWrapper.scrollTo({ top: 0, behavior: "smooth" });
    contentWrapper.scrollTo({ top: 0, behavior: "smooth" });

    renderPagination();
  }

  function renderPagination() {
    paginationWrapper.innerHTML = "";
    const totalPages = Math.ceil(allResultsHTML.length / RESULTS_PER_PAGE);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.classList.toggle("active", i === currentPage);
      btn.onclick = () => renderPage(i);
      paginationWrapper.appendChild(btn);
    }
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getSelectedValues(category) {
    const wrapper = [...document.querySelectorAll(".category-wrapper")].find(
      (el) =>
        el.querySelector(".category-title-wrapper span:last-child")
          ?.textContent === category
    );
    if (!wrapper) return [];
    return [...wrapper.querySelectorAll("input[type='checkbox']:checked")].map(
      (cb) => cb.value
    );
  }

  const yearFilter = document.getElementById("year-filter");
  if (yearFilter) {
    yearFilter.addEventListener("change", () => filterByYear(yearFilter.value));
  }

  function filterByYear(year) {
    if (!year) return renderPage(1);

    const filtered = allResultsHTML.filter((card) => {
      const pub = card.querySelector(".pub-visits");
      const match = pub?.textContent.match(
        /Published:\s+[A-Za-z]+\s+\d{1,2},\s+(\d{4})/
      );
      return match?.[1] === year;
    });

    resultWrapper.innerHTML = "";
    filtered.forEach((card) => resultWrapper.appendChild(card));
    paginationWrapper.innerHTML = "";
  }

  const sidebarObserver = new MutationObserver(() => {
    const checkboxes = document.querySelectorAll(
      "#side-bar input[type='checkbox']"
    );
    if (!checkboxes.length) return;

    checkboxes.forEach((cb) =>
      cb.addEventListener("change", async () => {
        await fetchResults();
        if (yearFilter.value) yearFilter.dispatchEvent(new Event("change"));
      })
    );

    fetchResults();
    sidebarObserver.disconnect();
  });

  sidebarObserver.observe(document.body, { childList: true, subtree: true });
});
