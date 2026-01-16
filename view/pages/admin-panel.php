<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LRC THESIS REPOSITORY</title>

  <link rel="icon" type="image/x-icon" href="<?php echo $BASE_URL; ?>view/assets/favicons/favicon.ico">
  <!-- Styles -->
  <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/root.css" />
  <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/body-format.css" />
  <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/admin-panel.css" />
  <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/sidebar.css" />
  <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/search-bar.css" />
  <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/account-toggle.css" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
</head>

<body>

  <div class="content-wrapper">
    <div id="sidebar-spot">
      <!-- Sidebar will be rendered here -->
    </div>
    <!-- Main Content -->
    <div class="main">
      <div class="main-sections" id="header">
        <!-- Search Bar will render here -->
      </div>

      <div class="main-sections" id="main-content">
        <!-- Navigation Bar for Dashboard and Thesis List -->
        <nav class="nav-wrapper">
          <ul>
            <li class="nav-item">DASHBOARD</li>
            <li class="nav-item">THESIS LIST</li>
          </ul>
        </nav>
        <!-- ==================== DASHBOARD SECTION ==================== -->
        <div id="dashboard-section" class="archive-section">
          <div id="header-wrapper">
            <span class="material-symbols-outlined">
              finance_mode
            </span>
            <span class="left-section-rows header">DASHBOARD</span>
          </div>

          <div id="initial-database-data">
            <a href="accounts-list" class="destination-link">
              <div class="box" title="View Users">
                <div class="box-label-wrapper">
                  <span class="material-symbols-outlined box-label-icon">
                    group
                  </span>
                  <span class="box-label">Total Users</span>
                </div>

                <div class="box-info user-info">
                  <div class="division-box">
                    <span class="info-label">Students</span>
                    <span class="info student-count">0</span>
                  </div>
                  <div class="division-box">
                    <span class="info-label">Faculty</span>
                    <span class="info faculty-count">0</span>
                  </div>
                </div>
              </div>
            </a>
            <a href="#methodPieChart" class="destination-link">
              <div class="box">
                <div class="box-label-wrapper">
                  <span class="material-symbols-outlined">
                    book_5
                  </span>
                  <span class="box-label">Thesis Amount</span>
                </div>

                <div class="box-info">
                  <span class="info-label">Thesis Amount</span>
                  <span class="info thesis-count">0</span>
                </div>
              </div>
            </a>
            <a href="#publicationTrends" class="destination-link">
              <div class="box">
                <div class="box-label-wrapper">
                  <span class="material-symbols-outlined">
                    functions
                  </span>
                  <span class="box-label">Average Thesis Uploads</span>
                </div>
                <div class="box-info">
                  <span class="info-label">Monthly</span>
                  <span class="info monthly-uploads">0</span>
                </div>
              </div>
            </a>
            <a href="program-views" class="destination-link">
              <div class="box">
                <div class="box-label-wrapper">
                  <span class="material-symbols-outlined">
                    functions
                  </span>
                  <span class="box-label">Average View</span>
                </div>

                <div class="box-info">
                  <span class="info-label">Per Program</span>
                  <span class="info avg-view-per-program">0</span>
                </div>
              </div>
            </a>
          </div>

          <div id="thesis-insights">
            <!--Thesis insights box will be rendered here-->
          </div>

          <div id="analytics-dashboard">
            <h2 id="section-label">Analytic Dashboard</h2>
            <div id="pub-trend-wrapper" class="canvas-wrapper">
              <canvas id="publicationTrends">
                <!-- Number of publication per month will render here -->
              </canvas>
            </div>
            <div id="method-wrapper" class="canvas-wrapper">
              <canvas id="methodPieChart">
                <!-- Methodology distribution will render here -->
              </canvas>
            </div>
            <div id="highest-program-wrapper" class="canvas-wrapper">
              <canvas id="highestRatedPrograms">
                <!-- Ranking of highest rated programs will render here -->
              </canvas>
            </div>
          </div>
        </div>
        <!-- ==================== THESIS LIST SECTION ==================== -->
        <div id="thesis-list-section" class="archive-section">
          <!-- Header Section: Title and Toolbox -->
          <div class="main-header">
            <span>LIST OF CURRENT AVAILABLE THESIS</span>
            <!-- Toolbox Section: Add, Refresh, Filter -->
            <div class="toolbox-section">
              <button id="add-btn">ADD</button>
              <button id="refresh-btn">REFRESH</button>
              <label for="year-filter">Filter by Year:</label>
              <select id="year-filter" name="year">
                <option value="">All Years</option>
                <?php foreach ($years as $year): ?>
                  <option value="<?= htmlspecialchars($year) ?>"><?= htmlspecialchars($year) ?></option>
                <?php endforeach; ?>
              </select>
            </div>
          </div>
          <!-- List Header and Thesis List -->
          <div class="list-wrapper">
            <div class="list-header">
              <span class="header-info">TITLE</span>
              <span class="header-info">AUTHOR</span>
              <span class="header-info">PUBLICATION DATE</span>
              <span class="header-info">PUBLICATION PLACE</span>
              <span class="header-info">METHODOLOGY</span>
              <span class="header-info">ACTION BTN</span>
            </div>
            <div class="thesis-list" id="thesis-list">
              <!-- Theses will render here -->
            </div>
          </div>
          <!-- This is the pop-up form for adding/editing a thesis -->
          <!-- ==================== POP UP FORM ==================== -->
          <div id="pop-up">
            <form id="thesis-form" enctype="multipart/form-data">
              <!-- ==================== FORM HEADER ==================== -->
              <div id="form-header">
                <span id="purpose-label">Purpose Placeholder</span>
                <div id="form-btns">
                  <!-- Submit button -->
                  <button type="submit" id="submit-thesis">Purpose Thesis</button>
                  <!-- Close button -->
                  <button type="button" id="close-popup">
                    <span class="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>

              <!-- ==================== FORM BODY ==================== -->
              <div id="form-body">

                <!-- ==================== LEFT FORM ==================== -->
                <div class="form-section" id="left-form">

                  <!-- Thesis Title -->
                  <div class="form-group input-textfields" id="title-field">
                    <label for="title-textfield" class="labels">Thesis Title <span style="color:red">*</span></label>
                    <input type="text" id="title-textfield" name="thesis-title" class="textfields" required>
                  </div>

                  <!-- Cover Image -->
                  <div class="form-group" id="img-upload">
                    <label for="cover-img" class="upload-box">
                      <img id="img-preview" alt="Image Preview" class="img-preview">
                      <span id="upload-text">Upload Thesis Cover <span style="color:red">*</span></span>
                    </label>
                    <input type="file" id="cover-img" name="thesis-cover" accept="image/*" required hidden>
                  </div>

                  <!-- PDF Upload -->
                  <div class="form-group" id="pdf-upload">
                    <label for="thesis-file" id="upload-label">
                      <button id="add-file-btn" type="button">
                        <span class="material-symbols-outlined">add</span>
                      </button>
                      <span id="file-name" class="no-click">Add thesis' PDF file <span style="color:red">*</span></span>
                    </label>
                    <input type="file" id="thesis-file" name="thesis-file" accept="application/pdf" required hidden>
                  </div>

                  <!-- Authors -->
                  <div class="form-group input-textfields" id="author-field">
                    <label for="author-textfield" class="labels">Author and Co-authors <span
                        style="color:red">*</span></label>
                    <input type="text" id="author-fName" name="author-name" class="textfields author-field"
                      placeholder="Firstname" required>
                    <input type="text" id="author-mName" name="author-name" class="textfields author-field"
                      placeholder="Middlename (if applicable)">
                    <input type="text" id="author-lName" name="author-name" class="textfields author-field"
                      placeholder="Lastname" required>
                    <div class="input-list" id="author-list"></div>
                  </div>

                  <!-- Publication Date -->
                  <div class="form-group" id="date-field">
                    <label for="pub-date" class="labels">Publication Date <span style="color:red">*</span></label>
                    <input type="date" id="pub-date" name="pub-date" class="date-picker" required>
                  </div>

                  <!-- Publication Place -->
                  <div class="form-group input-textfields" id="place-field">
                    <label for="place-textfield" class="labels">Publication Place <span
                        style="color:red">*</span></label>
                    <input type="text" id="place-textfield" name="pub-place" class="textfields" required>
                  </div>

                </div> <!-- End Left Form -->

                <!-- ==================== RIGHT FORM ==================== -->
                <div class="form-section" id="right-form">

                  <!-- Abstract -->
                  <div class="form-group" id="abstract-field">
                    <label for="abstract-editor" class="labels">Abstract <span style="color:red">*</span></label>
                    <div class="editor-toolbar">
                      <button type="button" data-command="bold"><b>B</b></button>
                      <button type="button" data-command="italic"><i>I</i></button>
                      <button type="button" data-command="underline"><u>U</u></button>
                    </div>
                    <div id="abstract-editor" contenteditable="true" class="editor-area"
                      placeholder="Write the abstract here..." required></div>
                  </div>

                  <!-- Methodology & Thesis Type -->
                  <div class="form-group" id="selection-field">
                    <!-- Methodology -->
                    <div class="thesis-selection" id="methodology-section">
                      <label for="methodology-selection">Methodology <span style="color:red">*</span></label>
                      <select id="methodology-selection" class="form-control" required>
                        <option value="">-- Select Methodology --</option>
                      </select>
                    </div>

                    <!-- Thesis Types -->
                    <div class="thesis-selection" id="type-section">
                      <label>Thesis Type <span style="color:red">*</span></label>
                      <div id="type-checkboxes" class="checkbox-group"></div>
                    </div>
                  </div>

                  <!-- Keywords -->
                  <div class="form-group input-textfields input-list-field" id="keyword-field">
                    <label for="keyword-textfield" class="labels">Keywords <span style="color:red">*</span></label>
                    <input type="text" id="keyword-textfield" name="keyword-name" class="textfields"
                      placeholder="Enter keyword and press Enter" required>
                    <div class="input-list" id="keyword-list"></div>
                  </div>

                  <!-- References -->
                  <div class="form-group input-textfields input-list-field" id="reference-field">
                    <label for="reference-textfield" class="labels">References <span style="color:red">*</span></label>
                    <input type="text" id="reference-textfield" name="reference" class="textfields"
                      placeholder="Enter reference and press Enter" required>
                    <div class="input-list" id="reference-list"></div>
                  </div>

                  <!-- Page Count -->
                  <div class="form-group input-textfields" id="pagecount-field">
                    <label for="pagecount-textfield" class="labels">Page Count <span style="color:red">*</span></label>
                    <input type="number" id="pagecount-textfield" name="page-count" class="textfields" min="1"
                      placeholder="Enter number of pages" required>
                  </div>

                  <!-- Program -->
                  <div class="form-group thesis-selection" id="program-section">
                    <label for="program-selection">Program <span style="color:red">*</span></label>
                    <select id="program-selection" class="form-control" required>
                      <option value="">-- Select Program --</option>
                    </select>
                  </div>

                </div> <!-- End Right Form -->

              </div> <!-- End Form Body -->

            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>

  <script>
    const baseURL = "<?php echo $BASE_URL; ?>";
  </script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2"></script>
  <script src="<?php echo $BASE_URL; ?>view/js/admin-panel/dashboard.js?v=<?php echo time(); ?>"></script>
  <script src="<?php echo $BASE_URL; ?>view/js/admin-panel/thesis-archive.js?v=<?php echo time(); ?>"></script>
  <script type="module"
    src="<?php echo $BASE_URL; ?>view/js/admin-panel/admin-panel.js?v=<?php echo time(); ?>"></script>
  <script type="module" src="<?php echo $BASE_URL; ?>view/js/general/sidebar.js?v=<?php echo time(); ?>"></script>
  <script src="<?php echo $BASE_URL; ?>view/js/general/search-bar.js?v=<?php echo time(); ?>"></script>
  <script type="module"
    src="<?php echo $BASE_URL; ?>view/js/general/account-toggle.js?v=<?php echo time(); ?>"></script>
  <script src="<?php echo $BASE_URL; ?>view/js/general/broadcast-receiver.js?v=<?php echo time(); ?>"></script>
</body>

</html>