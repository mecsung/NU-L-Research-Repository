<?php
$searchTerm = isset($_GET['q']) ? htmlspecialchars($_GET['q']) : '';
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LRC THESIS REPOSITORY</title>

  <link rel="icon" type="image/x-icon" href="<?php echo $BASE_URL; ?>view/assets/favicons/favicon.ico">
  <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/root.css">
  <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/body-format.css" />
  <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/search-result.css" />
  <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/sidebar.css" />
  <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/search-bar.css" />
  <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/account-toggle.css" />
  <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/footer.css" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
</head>

<body>
  <div class="content-wrapper">
    <div id="sidebar-spot">
      <!-- Sidebar will render here -->
    </div>

    <div class="main">
      <div class="main-sections" id="header">
        <!-- Search Bar will render here-->
      </div>

      <div class="main-sections" id="main-content">
        <div class="title-section">
          <div class="title-wrapper">
            <span class="material-symbols-outlined title-icon">description</span>
            <span>Results for "<?php echo $searchTerm; ?>"</span>
          </div>

          <!-- Dropdown Filter -->
          <div class="dropDown-filter">
            <label for="year-filter">Filter by Year:</label>
            <select id="year-filter" name="year">
              <option value="">All Years</option>
              <?php foreach ($years as $year): ?>
                <option value="<?= htmlspecialchars($year) ?>"><?= htmlspecialchars($year) ?></option>
              <?php endforeach; ?>
            </select>
          </div>
        </div>

        <div class="result-wrapper" id="result-wrapper">
          <!-- Results will render here -->
        </div>

        <div class="pagination-wrapper">
          <div class="buttons-wrapper" id="pagination-buttons">
            <!-- Pagination buttons will render here -->
          </div>
        </div>

      </div>

    </div>
  </div>
  <script>
    const baseURL = "<?php echo $BASE_URL; ?>";
  </script>
  <script type="module" src="<?php echo $BASE_URL; ?>view/js/general/sidebar.js"></script>
  <script src="<?php echo $BASE_URL; ?>view/js/general/broadcast-receiver.js?"></script>
  <script src="<?php echo $BASE_URL; ?>view/js/search-result.js"></script>
  <script src="<?php echo $BASE_URL; ?>view/js/general/search-bar.js"></script>
  <script type="module" src="<?php echo $BASE_URL; ?>view/js/general/account-toggle.js"></script>
  <script src="<?php echo $BASE_URL; ?>view/js/general/footer.js"></script>
</body>

</html>