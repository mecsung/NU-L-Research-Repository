import { getUserInfo } from "../general/broadcast-user-info.js";

document.addEventListener("DOMContentLoaded", () => {
  (async function checkUserRole() {
    const user = await getUserInfo();

    // If user is null (guest) or not admin, redirect
    if (!user || !user.school_id || user.role !== "admin") {
      window.location.href = `${baseURL}`;
    }
  })();

  const backBtn = document.getElementById("back-btn");
  const filterBtns = document.querySelectorAll(".date-filter");
  const startInput = document.getElementById("time-line-start");
  const endInput = document.getElementById("time-line-end");
  const advanceBtn = document.getElementById("advance-btn");
  const previousTotal = document.getElementById("previous-total");
  const currentTotal = document.getElementById("current-total");
  const conclusion = document.getElementById("conclusion");

  // Bck Button
  backBtn.addEventListener("click", () => {
    window.location.href = `${baseURL}admin-panel`;
  });

  // Filter Buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((btn) => btn.classList.remove("active"));
      advanceBtn.classList.remove("active");

      btn.classList.add("active");

      const filter = btn.dataset.value;
      [startInput.value, endInput.value] = ["", ""];
      fetchProgramData(filter);
    });
  });

  // Advance Filter Button
  advanceBtn.addEventListener("click", () => {
    const startDate = startInput.value;
    const endDate = endInput.value;

    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    // Combine into timeline format: "YYYY-MM-DD - YYYY-MM-DD"
    const timeLine = `${startDate} - ${endDate}`;

    // Send to your PHP endpoint
    fetchProgramData("time_line", timeLine);

    filterBtns.forEach((btn) => btn.classList.remove("active"));

    advanceBtn.classList.add("active");
  });

  // Initialize
  function init() {
    filterBtns[0].dispatchEvent(new Event("click"));
  }

  // Fetch Program Data Function
  async function fetchProgramData(filter, timeLine = "") {
    try {
      // Prepare payload
      const payload = {
        filter: filter, // 'today', 'week', 'month', 'year', 'time_line'
        time_line: timeLine, // only used if filter === 'time_line', format: "YYYY-MM-DD - YYYY-MM-DD"
      };

      // Send POST request to your PHP endpoint
      const response = await fetch(
        `${baseURL}controller/get-programs-thesis-view.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      // Parse JSON response
      const data = await response.json();
      const current = data.current;
      const previous = data.previous;
      console.log(data);

      renderProgramCards(current, previous);
      setConclusion(
        current,
        previous,
        filter,
        startInput.value,
        endInput.value
      );

      // renderData(data.data);
    } catch (error) {
      console.error("Error fetching date data:", error);
    }
  }

  function getDifferencePercentage(previous, current) {
    // If previous is 0, avoid division by zero
    if (previous === 0) {
      return current === 0 ? 0 : 100; // 100% increase if previous was 0 and current > 0
    }

    // Formula: ((current - previous) / previous) * 100
    return ((current - previous) / previous) * 100;
  }

  function renderProgramCards(
    current,
    previous,
    comparisonText = "vs. previous"
  ) {
    const container = document.getElementById("program-box-list");
    container.innerHTML = ""; // clear previous cards

    current.forEach((program, index) => {
      const acronym = program.acronym;
      const currentViews = program.total_thesis_viewed;

      // Find matching previous data by acronym
      const prevProgram = previous.find((p) => p.acronym === acronym);
      const previousViews = prevProgram ? prevProgram.total_thesis_viewed : 0;

      // Calculate difference percentage
      const diffPercent = getDifferencePercentage(previousViews, currentViews);

      // Determine arrow direction and color
      const arrow =
        diffPercent > 0
          ? "arrow_upward"
          : diffPercent < 0
          ? "arrow_downward"
          : "remove";
      const arrowColor =
        diffPercent > 0 ? "green" : diffPercent < 0 ? "red" : "gray";

      // Format percentage text
      const percentageText = `${Math.abs(diffPercent).toFixed(0)}%`;

      // Create card HTML
      const card = document.createElement("div");
      card.className = "program-box";
      card.innerHTML = `
      <span class="program-name">${acronym}</span>
      <span class="thesis-view-count">${currentViews}</span>
      <div class="comparison">
        <span class="material-symbols-outlined" style="color:${arrowColor}">
          ${arrow}
        </span>
        <span class="percentage">${percentageText}</span>
        <span class="comparison-time-line">${comparisonText}</span>
      </div>
    `;
      // Append first (but still hidden)
      container.appendChild(card);

      // Use setTimeout to stagger animations
      setTimeout(() => {
        card.classList.add("show"); // triggers CSS transition
      }, 50 * index);
    });
  }

  // Set Conclusion Function
  function setConclusion(current, previous, filter, start = null, end = null) {
    const sumViews = (arr) =>
      arr.reduce((total, p) => total + p.total_thesis_viewed, 0);

    const currentTotalViews = sumViews(current);
    const previousTotalViews = sumViews(previous);

    const difference = getDifferencePercentage(
      previousTotalViews,
      currentTotalViews
    );

    // ---- Date formatting ----
    const formatDate = (dateStr) =>
      new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    let currentLabel, previousLabel;

    // ---- Handle custom timeline ----
    if (filter === "time_line" && start && end) {
      const startDate = formatDate(start);
      const endDate = formatDate(end);

      // Compute previous range
      const totalDays =
        (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);

      const prevEnd = new Date(start);
      prevEnd.setDate(prevEnd.getDate() - 1);

      const prevStart = new Date(prevEnd);
      prevStart.setDate(prevStart.getDate() - totalDays);

      currentLabel = `from ${startDate} to ${endDate}`;
      previousLabel = `from ${formatDate(prevStart)} to ${formatDate(prevEnd)}`;
    } else {
      // ---- Preset filters ----
      const labels = {
        today: ["Today", "Yesterday"],
        week: ["This Week", "Last Week"],
        month: ["This Month", "Last Month"],
        year: ["This Year", "Last Year"],
      };

      [currentLabel, previousLabel] = labels[filter.toLowerCase()] || [
        `This ${capitalize(filter)}`,
        `Previous ${capitalize(filter)}`,
      ];
    }

    // ---- Color coding ----
    if (difference > 0) conclusion.style.color = "green";
    else if (difference < 0) conclusion.style.color = "red";
    else conclusion.style.color = "gray";

    // ---- Natural language sentence ----
    let action =
      difference === 0
        ? "remained the same"
        : difference > 0
        ? "increased"
        : "decreased";

    const percentage =
      difference === 0 ? "" : ` by ${Math.abs(difference).toFixed(0)}%`;

    const conclusionText = `Thesis views ${currentLabel} ${action}${percentage} compared to the period ${previousLabel}.`;

    currentTotal.textContent = `${capitalize(
      currentLabel
    )} Total Views: ${currentTotalViews}`;
    previousTotal.textContent = `${capitalize(
      previousLabel
    )} Total Views: ${previousTotalViews}`;
    conclusion.textContent = conclusionText;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  init();
});
