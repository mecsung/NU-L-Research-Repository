<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Program Views</title>

    <link rel="icon" type="image/x-icon" href="<?php echo $BASE_URL; ?>view/assets/favicons/favicon.ico">
    <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/root.css">
    <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/body-format.css" />
    <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/views-per-program.css" />
    <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/sidebar.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
</head>

<body>
    <div class="content-wrapper">
        <!-- SIDEBAR WILL RENDER HERE-->

        <div id="sidebar-spot">
            <!--Because sidebar is absolute we need something that will adjust the main so it can be visible from 2vw-->
        </div>
        <div class="main">
            <div id="data-comparison">
                <div id="comparison-wrapper">
                    <span id="previous-total">Yesterday Total Views: 100</span>
                    <span>|</span>
                    <span id="current-total">Today Total Views: 120</span>
                    <span id="conclusion">Today’s views increased by 20% compared to yesterday.
                    </span>
                </div>
            </div>
            <div class="main-sections" id="main-content">
                <div id="section-title">
                    <span id="text-title">Thesis Views Per Program</span>
                    <button id="back-btn" value="back">
                        <span class="material-symbols-outlined">arrow_top_left</span>
                        <span>Back</span>
                    </button>
                </div>
                <div id="tool-box">
                    <div id="buttons-filter">
                        <span id="tool-box-label">Filters:</span>
                        <div id="buttons-wrapper">
                            <button class="date-filter" data-value="today">Today</button>
                            <button class="date-filter" data-value="week">This Week</button>
                            <button class="date-filter" data-value="month">This Month</button>
                            <button class="date-filter" data-value="year">This Year</button>
                        </div>
                    </div>
                    <div id="advance-date-filter">
                        <div class="calendar-wrapper">
                            <span>Start:</span>
                            <input type="date" name="time-line-filter" class="time-line" id="time-line-start">
                        </div>
                        <div class="calendar-wrapper">
                            <span>End:</span>
                            <input type="date" name="time-line-filter" class="time-line" id="time-line-end">
                        </div>
                        <button type="button" id="advance-btn">Advance Filter</button>
                    </div>

                </div>
                <div id="program-box-list">
                    <!--Program Boxes with data will be rendered here-->
                </div>
            </div>

        </div>
    </div>
    <script>
        const baseURL = "<?php echo $BASE_URL; ?>";
    </script>
    <script type="module" src="<?php echo $BASE_URL; ?>view/js/admin-panel/views-per-program.js"></script>
    <script type="module" src="<?php echo $BASE_URL; ?>view/js/general/sidebar.js"></script>
    <script src="<?php echo $BASE_URL; ?>view/js/general/broadcast-receiver.js?"></script>
</body>

</html>