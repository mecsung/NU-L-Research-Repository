<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accounts List</title>
    <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/root.css">
    <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/body-format.css" />
    <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/accounts-list.css" />
    <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/sidebar.css" />
    <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/account-toggle.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
</head>

<body>
    <div class="content-wrapper">
        <div id="sidebar-spot">
            <!--Side bar will render here-->
        </div>
        <!-- Main Content -->
        <div class="main">
            <div class="main-sections" id="header">
                <div id="search-wrapper">
                    <form id="search-form">
                        <input type="text" id="search-bar" placeholder="Search..." />
                        <button type="submit" id="search-btn">Search</button>
                    </form>
                </div>
            </div>
            <div class="main-sections" id="main-content">
                <div id="tool-box">
                    <div id="button-wrapper">
                        <button class="account-btn" value="student">STUDENT</button>
                        <button class="account-btn" value="faculty">FACULTY</button>
                    </div>
                    <button id="refresh-btn" value="refresh">
                        <span class="material-symbols-outlined">autorenew</span>
                        <span>REFRESH</span>
                    </button>
                    <button id="back-btn" value="back">
                        <span class="material-symbols-outlined">arrow_top_left</span>
                        <span>Back</span>
                    </button>
                </div>
                <div id="list-label">
                    <div class="labels"><span>School ID</span></div>
                    <div class="labels"><span class="sort-filters" data-value="first_name" data-sort="asc">Name<span
                                class="material-symbols-outlined sort-filters-icon">
                                arrow_drop_up
                            </span></span>
                    </div>
                    <div class="labels"><span>Email</span></div>
                    <div class="labels"> <span class="sort-filters" data-value="program_name"
                            data-sort="desc">Program<span class="material-symbols-outlined sort-filters-icon">
                                arrow_drop_up
                            </span>
                        </span></div>
                    <div class="labels"><span>Role</span></div>
                    <div class="labels"><span>Options</span></div>
                </div>
                <div id="list-wrapper">
                    <!--Account list will be rendered here-->
                </div>
            </div>
        </div>
    </div>

    <script>
        const baseURL = "<?php echo $BASE_URL; ?>";
    </script>
    <script type="module" src="<?php echo $BASE_URL; ?>view/js/admin-panel/accounts-list.js"></script>
    <script type="module" src="<?php echo $BASE_URL; ?>view/js/general/sidebar.js"></script>
    <script type="module" src="<?php echo $BASE_URL; ?>view/js/general/account-toggle.js"></script>
    <script src="<?php echo $BASE_URL; ?>view/js/general/broadcast-receiver.js?"></script>
</body>

</html>