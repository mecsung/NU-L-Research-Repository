<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NULTR | Home</title>
  
  <link rel="icon" type="image/x-icon" href="<?php echo $BASE_URL; ?>view/assets/favicons/favicon.ico">
  <link rel="stylesheet" href="view/css/root.css">
  <link rel="stylesheet" href="view/css/body-format.css" />
  <link rel="stylesheet" href="view/css/home.css" />
  <link rel="stylesheet" href="view/css/sidebar.css" />
  <link rel="stylesheet" href="view/css/search-bar.css" />
  <link rel="stylesheet" href="view/css/account-toggle.css" />
  <link rel="stylesheet" href="view/css/footer.css" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
</head>

<body>
  <div class="content-wrapper">
    <!-- Sidebar -->
    <div id="sidebar-spot"></div>

    <!-- Main Content -->
    <div class="main">
      <!-- Search Bar -->
      <div class="main-sections" id="header"></div>

      <div class="main-sections" id="main-content">
        <div class="title-wrapper">
          <span class="title">FIND 100+ OF REFERENCE FOR YOUR THESIS</span>
        </div>
        <div class="subtitle-wrapper">
          <span class="subtitle">ON-GOING / UPCOMING EVENTS</span>
        </div>

        <!-- Carousel -->
        <!-- <div class="carousel-wrapper">
          <div id="carousel-settings">
            <div id="icon-wrapper">
              <span class="material-symbols-outlined" id="settings-icon">
                settings
              </span>
            </div>
          </div>
          <div class="carousel" id="event-carousel"></div>
        </div> -->

        <!-- Popup Carousel Settings -->
        <!-- <div class="popup">
          <div id="carousel-form">
            <div id="form-label">
              <span id="label">Carousel Image Settings</span>
              <button type="button" id="back-btn"><span class="material-symbols-outlined icon">
                  close
                </span></button>
            </div>
            <div id="carousel-images"></div>
          </div>
        </div> -->

        <!--Buttons -->
        <!-- <div class="buttons-wrapper">
          <button class="help-btn" id="resourse-prob">
            REPORT AN E-RESOURCE PROBLEM
          </button>
          <button class="help-btn" id="assistance">
            REQUEST FOR ASSISTANCE
          </button>
          <button class="help-btn" id="about">ABOUT THESIS REPOSITORY</button>
        </div> -->

      </div>
    </div>
  </div>
  <script>
    const baseURL = "<?php echo $BASE_URL; ?>";
  </script>
  <script type="module" src="view/js/home.js"></script>
  <script type="module" src="view/js/general/sidebar.js"></script>
  <script type="text/javascript" src="view/js/general/search-bar.js"></script>
  <script type="module" src="view/js/general/account-toggle.js"></script>
  <script type="text/javascript" src="view/js/general/broadcast-receiver.js"></script>
  <script type="text/javascript" src="view/js/general/footer.js"></script>
</body>

</html>