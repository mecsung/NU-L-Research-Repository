function initDashboard() {
  //========= Initial Data Section ==========
  async function fetchInitialData() {
    try {
      // Adjust the URL to your PHP script
      const response = await fetch(
        `${baseURL}controller/admin-dashboard/initial-dashboard-data.php`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const users = data.user_data;
        const thesis_count = data.thesis_count;
        const monthly_uploads = data.monthly_uploads;
        const avg_views_per_program = data.avg_views_per_program;

        // Render Repopsitory User Count
        renderUserCount(users);

        // Render Thesis Count
        const thesisCountPlaceholder =
          document.querySelector(".info.thesis-count");
        thesisCountPlaceholder.textContent = thesis_count;

        //Render Theses Monthly Uploads
        const monthlyUploadsPlaceholder = document.querySelector(
          ".info.monthly-uploads"
        );
        monthlyUploadsPlaceholder.textContent = monthly_uploads;

        //Render Average Theses Uploads Per Program
        const avgViewPerProgram = document.querySelector(
          ".info.avg-view-per-program"
        );
        avgViewPerProgram.textContent = avg_views_per_program;
      } else {
        console.error("Server returned an error:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }

    function renderUserCount(users) {
      users.forEach((user) => {
        if (user.role === "student" || user.role === "faculty") {
          const userRole = user.role;
          const userCount = user.total;

          const CountPlaceholder = document.querySelector(
            `.info.${userRole}-count`
          );

          if (CountPlaceholder) {
            CountPlaceholder.textContent = userCount;
          }
        }
      });
    }
  }

  // ========== Thesis Insights Section ==========
  const thesisInsightsContainer = document.getElementById("thesis-insights");

  // Define the sections
  const thesisSections = [
    { label: "Most Viewed Theses", className: "most-viewed" },
    { label: "Highest Rated Thesis", className: "top-performing" },
    { label: "Most Contribution", className: "most-contribution" },
    { label: "Recent Theses", className: "recent-thesis" },
  ];

  // Generate HTML dynamically
  thesisInsightsContainer.innerHTML = thesisSections
    .map(
      (section) => `
  <div class="section-box ${section.className}">
    <span class="section-box-label">${section.label}</span>
    <div class="section-list ${section.className}">
      <!-- Top 10 ${section.label} will be rendered here -->
    </div>
  </div>
`
    )
    .join("");

  async function fetchThesisInsights() {
    try {
      const response = await fetch(
        `${baseURL}controller/admin-dashboard/thesis-insights.php`
      );

      if (!response) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const mostViewed = data.most_viewed;
      const highestRated = data.highest_rated;
      const programContribution = data.program_contribution;
      const recentTheses = data.recent_theses;

      renderMostViewedThesis(mostViewed);
      renderTopPerformingThesis(highestRated);
      renderProgramsContribution(programContribution);
      renderRecentThesis(recentTheses);

      function visitThesis(thesis_id, title) {
        const params = new URLSearchParams({ id: thesis_id });
        title.addEventListener("click", () => {
          window.location.href = `${baseURL}view-thesis?${params.toString()}`;
        });
      }

      function renderMostViewedThesis(thesis_list) {
        const mostViewedTable = document.querySelector(
          ".section-list.most-viewed"
        );

        thesis_list.forEach((thesis) => {
          const tableRow = document.createElement("div");
          tableRow.classList.add("row");
          tableRow.innerHTML = `
          <span class="thesis-title">${thesis.title}</span>
          <div class="thesis-element">
            <span class="icon material-symbols-outlined">
              visibility
              </span>
              <span class="element">${thesis.visit_count}</span>
          </div>
          `;

          mostViewedTable.append(tableRow);

          const titleSpan = tableRow.querySelector(".thesis-title");

          visitThesis(thesis.thesis_id, titleSpan);
        });
      }

      function renderTopPerformingThesis(thesis_list) {
        const topPerformingTable = document.querySelector(
          ".section-list.top-performing"
        );

        thesis_list.forEach((thesis) => {
          const tableRow = document.createElement("div");
          tableRow.classList.add("row");

          tableRow.innerHTML = `
          <span class="thesis-title">${thesis.title}</span>
          <div class="thesis-element">
            <div id="star-wrapper">
              ${renderStars(thesis.bayesian_rating)}
            </div>
            <span class="element avg-rating">${thesis.bayesian_rating}</span>
            <span class="element rating-count">(${thesis.rating_count})</span>
          </div>
        `;

          topPerformingTable.append(tableRow);

          const titleSpan = tableRow.querySelector(".thesis-title");

          visitThesis(thesis.thesis_id, titleSpan);
        });

        // Render stars as HTML string
        function renderStars(avg_rating) {
          let fullStars = Math.floor(avg_rating);
          let halfStar = avg_rating - fullStars >= 0.5 ? 1 : 0;
          let emptyStars = 5 - fullStars - halfStar;

          let starsHTML = "";

          // Full stars
          for (let i = 0; i < fullStars; i++) {
            starsHTML += `<span class="star material-symbols-outlined">star</span>`;
          }

          // Half star
          if (halfStar) {
            starsHTML += `<span class="star material-symbols-outlined">star_half</span>`;
          }

          // Empty stars
          for (let i = 0; i < emptyStars; i++) {
            starsHTML += `<span class="star empty material-symbols-outlined">star</span>`;
          }

          return starsHTML;
        }
      }

      function renderProgramsContribution(program_list) {
        const programContributionTable = document.querySelector(
          ".section-list.most-contribution"
        );

        program_list.forEach((program) => {
          const tableRow = document.createElement("div");
          tableRow.classList.add("row");
          tableRow.innerHTML = `
          <span class="program-name">${program.program_name}</span>
          <div class="info">
              <span class="element">${
                "Thesis Contribution: " + program.thesis_count
              }</span>
          </div>
          `;

          programContributionTable.append(tableRow);
        });
      }

      function renderRecentThesis(thesis_list) {
        const recentThesisTable = document.querySelector(
          ".section-list.recent-thesis"
        );

        thesis_list.forEach((thesis) => {
          const tableRow = document.createElement("div");
          tableRow.classList.add("row");
          tableRow.innerHTML = `
          <span class="thesis-title">${thesis.title}</span>
          <div class="thesis-element">
              <span class="element">${
                "Date Added: " + timeAgo(thesis.upload_date)
              }</span>
          </div>
          `;
          recentThesisTable.append(tableRow);

          const titleSpan = tableRow.querySelector(".thesis-title");

          visitThesis(thesis.thesis_id, titleSpan);
        });

        function timeAgo(dateString) {
          const date = new Date(dateString);
          const now = new Date();
          const seconds = Math.floor((now - date) / 1000);

          const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
          };

          for (const [key, value] of Object.entries(intervals)) {
            const count = Math.floor(seconds / value);
            if (count >= 1) {
              return count === 1 ? `1 ${key} ago` : `${count} ${key}s ago`;
            }
          }

          return "Just now";
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  function fetchThesisAnalytics() {
    const root = getComputedStyle(document.documentElement);

    const accent = root.getPropertyValue("--color-accent").trim();
    const primary = root.getPropertyValue("--color-primary").trim();

    // A function used to fetch data efficiently
    async function fetchData(phpFile) {
      try {
        const response = await fetch(
          `${baseURL}controller/admin-dashboard/graphs/${phpFile}`
        );

        if (!response) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data;
      } catch {}
    }

    // Fetch the Monthly Thesis Upload
    async function fetchMonthlyThesisUpload() {
      const phpFile = "get_publication_trend.php";
      const data = await fetchData(phpFile);

      if (data) {
        const publicationTrend = data.publication_trend;
        const months = publicationTrend.map((item) => item.month);
        const totals = publicationTrend.map((item) => item.total);
        createLineGraph(months, totals);
      }

      function createLineGraph(months, totals) {
        const ctx = document
          .getElementById("publicationTrends")
          .getContext("2d");

        new Chart(ctx, {
          type: "line",
          data: {
            labels: months,
            datasets: [
              {
                label: "Thesis Publications",
                data: totals,
                borderColor: primary,
                backgroundColor: "rgba(54,162,235,0.3)",
                pointBackgroundColor: accent,
                pointBorderColor: primary,
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#36A2EB",
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                cubicInterpolationMode: "monotone", // smooth curve
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 25,
                right: 25,
                bottom: 15,
                left: 10,
              },
            },
            scales: {
              x: {
                grid: {
                  color: "rgba(255,255,255,0.05)",
                  drawBorder: false,
                },
                ticks: {
                  color: primary,
                  font: {
                    family: "Poppins, sans-serif",
                    size: 12,
                  },
                  padding: 8,
                },
                title: {
                  display: true,
                  text: "Publication Month (YYYY-MM)",
                  color: primary,
                  font: {
                    family: "Poppins, sans-serif",
                    size: 13,
                    weight: "500",
                  },
                },
              },
              y: {
                grid: {
                  color: primary,
                  drawBorder: false,
                },
                ticks: {
                  color: primary,
                  font: {
                    family: "Poppins, sans-serif",
                    size: 12,
                  },
                  stepSize: 2,
                  padding: 8,
                },
                title: {
                  display: true,
                  text: "Number of Theses Published",
                  color: primary,
                  font: {
                    family: "Poppins, sans-serif",
                    size: 13,
                    weight: "500",
                  },
                },
                beginAtZero: true,
              },
            },
            plugins: {
              title: {
                display: true,
                text: "NU Laguna Monthly Research Uploads",
                color: primary,
                padding: { bottom: 15 },
                font: {
                  family: "Poppins, sans-serif",
                  size: 18,
                  weight: "600",
                },
              },
              legend: {
                display: true,
                labels: {
                  color: primary,
                  font: {
                    family: "Poppins, sans-serif",
                    size: 13,
                  },
                  boxWidth: 15,
                  padding: 20,
                },
              },
              tooltip: {
                backgroundColor: "rgba(0,0,0,0.8)",
                titleFont: {
                  family: "Poppins, sans-serif",
                  size: 14,
                  weight: "600",
                },
                bodyFont: { family: "Poppins, sans-serif", size: 13 },
                cornerRadius: 8,
                padding: 12,
                displayColors: true,
                callbacks: {
                  title: (tooltipItems) => "Date: " + tooltipItems[0].label,
                  label: (tooltipItem) =>
                    `Theses: ${tooltipItem.formattedValue}`,
                },
              },
            },
            animation: {
              duration: 1200,
              easing: "easeOutQuart",
            },
            elements: {
              point: {
                radius: 5,
                hoverRadius: 7,
              },
              line: {
                borderJoinStyle: "round",
                shadowOffsetX: 0,
                shadowOffsetY: 4,
                shadowBlur: 10,
                shadowColor: "rgba(54,162,235,0.3)",
              },
            },
          },
        });
      }
    }

    async function fetchMethodologyDistribution() {
      const phpFile = "get_methodology_distribution.php";
      const data = await fetchData(phpFile);

      if (data) {
        const methodData = data.meth_distribution;
        const labels = methodData.map((item) => item.method_name);
        const counts = methodData.map((item) => item.count);

        createPieGraph(labels, counts);
      }

      function createPieGraph(labels, counts) {
        // Base color palette
        const baseColors = [
          accent,
          primary,
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#8AFF33",
          "#FF8A33",
          "#338AFF",
        ];

        // Generate colors dynamically if labels > baseColors.length
        const colors = labels.map((_, i) => baseColors[i % baseColors.length]);

        // Get canvas context
        const ctx = document.getElementById("methodPieChart").getContext("2d");

        // Create the chart
        new Chart(ctx, {
          type: "pie",
          data: {
            labels: labels,
            datasets: [
              {
                data: counts,
                backgroundColor: colors,
                borderColor: "#fff",
                borderWidth: 2,
                hoverOffset: 20, // slice moves out slightly on hover
                hoverBorderColor: primary,
                hoverBorderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false, // fills parent container
            layout: {
              padding: {
                top: 20,
                bottom: 20,
                left: 20,
                right: 20,
              },
            },
            plugins: {
              title: {
                display: true,
                text: "Distribution of Research Methods",
                color: primary,
                font: {
                  family: "Poppins, sans-serif",
                  size: 18,
                  weight: "600",
                },
                padding: {
                  bottom: 15,
                },
              },
              legend: {
                display: true,
                position: "right",
                labels: {
                  color: primary,
                  font: {
                    family: "Poppins, sans-serif",
                    size: 12,
                  },
                  boxWidth: 15,
                  padding: 15,
                },
              },
              tooltip: {
                enabled: true,
                backgroundColor: "rgba(0,0,0,0.8)",
                titleFont: {
                  family: "Poppins, sans-serif",
                  size: 14,
                  weight: "600",
                },
                bodyFont: { family: "Poppins, sans-serif", size: 13 },
                cornerRadius: 8,
                padding: 12,
                displayColors: true,
                callbacks: {
                  label: function (context) {
                    const value = context.parsed;
                    const total = context.dataset.data.reduce(
                      (a, b) => a + b,
                      0
                    );
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${context.label}: ${value} (${percentage}%)`;
                  },
                },
              },
            },
            animation: {
              animateRotate: true,
              duration: 1200,
              easing: "easeOutQuart",
            },
            elements: {
              arc: {
                borderJoinStyle: "round",
                shadowOffsetX: 0,
                shadowOffsetY: 4,
                shadowBlur: 10,
                shadowColor: "rgba(0,0,0,0.2)",
              },
            },
          },
        });
      }
    }

    async function fetchHigestRatedProgram() {
      const phpFile = "get_highest_rated_program.php";
      const data = await fetchData(phpFile);

      if (data) {
        const programsData = data.highest_rated_program;
        const programs = programsData.map((item) => item.program_name);
        const ratings = programsData.map((item) => parseFloat(item.avg_rating));
        const ratingCounts = programsData.map((item) => item.rating_count);

        createHorizontalBarGraph(programs, ratings, ratingCounts);
      }

      function createHorizontalBarGraph(programs, ratings, ratingCounts) {
        const canvas = document.getElementById("highestRatedPrograms");
        const ctx = canvas.getContext("2d");

        // Create Chart
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: programs,
            datasets: [
              {
                label: "Average Rating",
                data: ratings,
                backgroundColor: accent,
                borderColor: primary,
                borderWidth: 2,
                borderRadius: 10,
                hoverBackgroundColor: primary,
                hoverBorderColor: "#fff",
                barPercentage: 0.6,
              },
            ],
          },
          options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 10,
                right: 30,
                left: 10,
                bottom: 10,
              },
            },
            plugins: {
              legend: {
                display: true,
                position: "top",
                labels: {
                  color: primary,
                  font: {
                    size: 14,
                    weight: "500",
                  },
                },
              },
              title: {
                display: true,
                text: "Highest Rated Academic Programs",
                color: primary,
                font: {
                  size: 18,
                  weight: "bold",
                  family: "'Inter', 'Segoe UI', sans-serif",
                },
                padding: {
                  top: 10,
                  bottom: 20,
                },
              },
              tooltip: {
                backgroundColor: "#222",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderWidth: 1,
                borderColor: "#555",
                callbacks: {
                  label: (context) => {
                    const index = context.dataIndex; // index of the hovered bar
                    const average = context.parsed.x.toFixed(2); // average rating
                    const count = ratingCounts[index]; // corresponding rating count
                    return `Average Rating: ${average} (${count} ratings)`;
                  },
                },
              },

              datalabels: {
                anchor: "end",
                align: "right",
                formatter: (value) => value.toFixed(2),
                color: primary,
                font: {
                  weight: "bold",
                },
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                max: 5,
                grid: {
                  color: "rgba(0,0,0,0.05)",
                },
                title: {
                  display: true,
                  text: "Average Rating (0 - 5)",
                  color: primary,
                  font: {
                    weight: "bold",
                    size: 13,
                  },
                },
                ticks: {
                  stepSize: 1,
                  color: "#333",
                  font: {
                    size: 12,
                  },
                },
              },
              y: {
                grid: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "Program Name",
                  color: primary,
                  font: {
                    weight: "bold",
                    size: 13,
                  },
                },
                ticks: {
                  color: primary,
                  font: {
                    size: 12,
                  },
                },
              },
            },
            animation: {
              duration: 800,
              easing: "easeOutQuart",
            },
          },
          plugins: [ChartDataLabels],
        });
      }
    }

    fetchMonthlyThesisUpload();
    fetchMethodologyDistribution();
    fetchHigestRatedProgram();
  }

  fetchInitialData();
  fetchThesisInsights();
  fetchThesisAnalytics();
}
