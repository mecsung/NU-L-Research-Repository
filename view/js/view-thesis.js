import { getUserInfo } from "./general/broadcast-user-info.js";

document.addEventListener("DOMContentLoaded", async () => {
  let urlThesisId = new URLSearchParams(window.location.search).get("id");
  const user = await getUserInfo();
  if (!urlThesisId) return console.error("Missing thesis ID in URL");

  const get = (id) => document.getElementById(id);
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const safeText = (el, text, fallback = "N/A") =>
    (el.textContent = text || fallback);

  const fetchJSON = async (url, options = {}) => {
    const r = await fetch(url, options);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  };

  const sanitizeHTML = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    div
      .querySelectorAll(
        "script,style,link,meta,iframe,object,embed,form,input,button,textarea,select"
      )
      .forEach((el) => el.remove());

    div.querySelectorAll("*").forEach((el) => {
      [...el.attributes].forEach((attr) => {
        const n = attr.name.toLowerCase();
        if (
          n.startsWith("on") ||
          ["src", "href", "action", "xmlns"].includes(n)
        )
          el.removeAttribute(attr.name);
      });
    });

    return div.innerHTML;
  };

  const prevBtn = $(".prev-btn");
  const nextBtn = $(".next-btn");
  const readBtn = get("read-thesis-btn");
  const favoriteBtn = get("add-to-favorite");
  const ratingWrapper = get("rating-wrapper");
  const deleteRatingBtn = get("delete-rating");
  const stars = [...$$(".stars")];

  async function loadThesis(id) {
    try {
      const thesis = await fetchJSON(
        `${baseURL}controller/thesis/get-thesis.php?id=${id}&school_id=${
          user?.school_id || ""
        }`
      );
      if (thesis.error) throw new Error(thesis.error);
      renderThesis(thesis);
      setupNavigation(id);
    } catch (e) {
      console.error("Thesis load error:", e);
    }
  }

  loadThesis(urlThesisId);

  let viewInterval,
    seconds = 0;
  function startViewingTimer() {
    if (viewInterval) clearInterval(viewInterval);
    seconds = 0;
    viewInterval = setInterval(() => {
      if (++seconds >= 30) {
        clearInterval(viewInterval);
        if (user?.school_id) updateViewCount(urlThesisId);
      }
    }, 1000);
  }
  startViewingTimer();

  async function updateViewCount(thesisId) {
    try {
      const res = await fetchJSON(
        `${baseURL}controller/increase-view-count.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            thesis_id: thesisId,
            school_id: user.school_id,
          }),
        }
      );
      if (!res.success) console.error(res.error);
    } catch (e) {
      console.error("Visit count error:", e);
    }
  }

  function renderThesis(thesis) {
    const {
      thesis_id,
      title,
      authors,
      pub_date,
      thesis_cover,
      abstract,
      methodology,
      thesis_types_name,
      keywords,
      references_list,
      pub_place,
      page_count,
    } = thesis;

    setupRating(user, thesis);
    safeText(get("thesis-title"), title, "Untitled Thesis");

    const a = authors?.[0];
    safeText(
      get("author-wrapper"),
      a ? `${a.firstname} ${a.middlename} ${a.lastname}` : null,
      "Unknown Author"
    );

    const d = new Date(pub_date);
    safeText(
      get("pub-date"),
      isNaN(d)
        ? pub_date
        : d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
      "Unknown Date"
    );

    get("thesis-cover").src = thesis_cover
      ? `${baseURL}${thesis_cover}`
      : `${baseURL}/view/assets/placeholder.jpeg`;

    setupReadButton(thesis);
    setupFavorite(favoriteBtn, user, thesis_id);

    get("abstract-content").innerHTML = abstract
      ? sanitizeHTML(abstract)
      : "No abstract available.";

    safeText(get("methodology-content"), methodology);
    safeText(
      get("thesis-type-content"),
      thesis_types_name,
      "No thesis type available"
    );
    safeText(
      get("keywords-content"),
      keywords?.join(", "),
      "No keywords available."
    );

    renderList(
      "#right-section #co-author-label + .list",
      (authors || []).slice(1),
      "No co-authors",
      (x) => `${x.firstname} ${x.middlename} ${x.lastname}`
    );

    safeText(get("place"), pub_place, "Unknown");

    renderList(
      "#references-label + .list",
      references_list?.slice(0, 3) || [],
      "No references available.",
      (r) => r,
      references_list?.length > 3
        ? `+${references_list.length - 3} more...`
        : null
    );

    safeText(get("page-number"), `Page count: ${page_count || "N/A"}`);
  }

  function renderList(sel, items, empty, fn, extra = null) {
    const list = $(sel);
    list.innerHTML = "";
    if (!items.length)
      return (list.innerHTML = `<span class="name">${empty}</span>`);

    items.forEach((x) => {
      const s = document.createElement("span");
      s.className = "name";
      s.textContent = fn(x);
      list.appendChild(s);
    });

    if (extra) {
      const m = document.createElement("span");
      m.className = "reference more-ref";
      m.textContent = extra;
      list.appendChild(m);
    }
  }

  function setupReadButton({ file_name, thesis_id }) {
    if (!file_name || !thesis_id) {
      readBtn.disabled = true;
      readBtn.textContent = "File not available";
      return;
    }
    if (!file_name.toLowerCase().endsWith(".pdf")) {
      readBtn.disabled = true;
      readBtn.textContent = "Invalid file format";
      return;
    }

    readBtn.disabled = false;
    readBtn.textContent = "START READING";

    readBtn.onclick = () => {
      readBtn.disabled = true;
      readBtn.textContent = "Opening...";
      const url = `${baseURL}controller/pdf-viewer.php?thesis_id=${thesis_id}&file=${encodeURIComponent(
        file_name
      )}`;
      window.open(url, "_blank");
      setTimeout(() => {
        readBtn.disabled = false;
        readBtn.textContent = "START READING";
      }, 1000);
    };
  }

  async function setupFavorite(btn, user, thesis_id) {
    if (!btn) return;
    const { school_id } = user;
    let active = false;

    if (user) active = await isFavorite(thesis_id, school_id);
    btn.classList.toggle("active", active);

    btn.onclick = async () => {
      if (!user?.school_id) return alert("Please log in to add this thesis");
      active = !active;
      btn.classList.toggle("active", active);
      active
        ? addFavorite(thesis_id, school_id)
        : removeFavorite(thesis_id, school_id);
    };
  }

  const isFavorite = async (id, sid) => {
    try {
      const r = await fetchJSON(
        `${baseURL}controller/favorite/check-if-favorite.php?thesis_id=${id}&school_id=${sid}`
      );
      return r?.is_favorite === true;
    } catch {
      return false;
    }
  };

  const addFavorite = (id, sid) =>
    fetchJSON(`${baseURL}controller/favorite/add-favorite.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ thesis_id: id, school_id: sid }),
    });

  const removeFavorite = (id, sid) =>
    fetchJSON(`${baseURL}controller/favorite/remove-favorite.php`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ thesis_id: id, school_id: sid }),
    });

  async function setupRating(user, thesis) {
    if (!ratingWrapper || !stars.length || !deleteRatingBtn) return;

    const sid = user?.school_id;
    thesis.thesis_id = +thesis.thesis_id;

    const reset = () => stars.forEach((s) => s.classList.remove("active"));
    const animate = (v) =>
      stars.forEach((s, i) =>
        setTimeout(() => s.classList.toggle("active", i < v), i * 80)
      );
    const feedback = () => {
      ratingWrapper.classList.add("show-after");
      setTimeout(() => ratingWrapper.classList.remove("show-after"), 1500);
    };

    const send = (method, val = null) =>
      fetchJSON(`${baseURL}controller/rating.php`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thesis_id: thesis.thesis_id,
          school_id: sid,
          ...(val !== null && { rating_value: val }),
        }),
      }).then(() => val !== null && feedback());

    reset();
    thesis.rating_value && animate(thesis.rating_value);
    deleteRatingBtn.classList.toggle("active", !!thesis.rating_value);

    ratingWrapper.onclick = async (e) => {
      const star = e.target.closest(".stars");
      if (!star) return;
      if (!sid) return alert("Please log in to rate.");

      const val = +star.dataset.value;
      reset();
      animate(val);
      deleteRatingBtn.classList.add("active");
      await send("POST", val);
    };

    deleteRatingBtn.onclick = async () => {
      reset();
      deleteRatingBtn.classList.remove("active");
      await send("DELETE");
    };
  }

  function setupNavigation(thesisId) {
    const results = JSON.parse(sessionStorage.getItem("searchResults") || "[]");
    const idx = results.findIndex((i) => i.id === thesisId);
    const numberEl = get("thesis-number");
    if (idx !== -1 && numberEl) numberEl.textContent = results[idx].number;

    const nav = (offset) => {
      const n = idx + offset;
      if (n < 0 || n >= results.length) return;

      const nextId = results[n].id;
      loadThesis(nextId);
      urlThesisId = nextId;
      startViewingTimer();

      const newURL = `${window.location.pathname}?${new URLSearchParams({
        id: nextId,
      })}`;
      window.history.replaceState({}, "", newURL);
    };

    prevBtn.onclick = () => nav(-1);
    nextBtn.onclick = () => nav(1);
    prevBtn.disabled = idx <= 0;
    nextBtn.disabled = idx >= results.length - 1;
  }
});
