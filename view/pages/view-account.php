<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account</title>
    <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/root.css">
    <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/body-format.css" />
    <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/view-account.css" />
    <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/sidebar.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
</head>

<body>
    <div class="content-wrapper">
        <div id="sidebar-spot">

        </div>

        <div class="main">
            <div class="main-sections" id="side-nav">
                <div id="section-label">
                    <span>User Profile</span>
                </div>
                <ul id="nav-wrapper">
                    <li class="nav-list">
                        <div class="nav-item">
                            <span class="material-symbols-outlined icon">
                                account_circle
                            </span>
                            <span class="icon-label">PROFILE</span>
                        </div>
                    </li>
                    <li class="nav-list">
                        <div class="nav-item">
                            <span class="material-symbols-outlined icon">
                                favorite
                            </span>
                            <span class="icon-label">FAVORITE</span>
                        </div>
                    </li>
                    <li class="nav-list">
                        <div class="nav-item">
                            <span class="material-symbols-outlined icon">
                                history
                            </span>
                            <span class="icon-label">HISTORY</span>
                        </div>
                    </li>
                </ul>
                <div id="sign-out-wrapper" title="Sign-Out">
                    <span class="material-symbols-outlined icon">
                        exit_to_app
                    </span>
                    <span class="icon-label">SIGN OUT</span>
                </div>
            </div>

            <div class="main-sections" id="main-content">
                <button type="button" id="back-btn"><span class="material-symbols-outlined icon">
                        close
                    </span></button>
                <div class="info-section-items" id="user-profile">
                    <div id="user-profile-upper">
                        <div id="name-wrapper">
                            <span id="account-name">Account Name</span>
                            <span id="membership-date">Member since: Onboarding Date</span>
                        </div>
                    </div>
                    <div id="user-profile-lower">
                        <span class="section-label">Account Details</span>
                        <div id="account-info-wrapper">
                            <div class="info-wrapper">
                                <span class="info-label">School ID:</span>
                                <input type="text" name="school-id" id="school-id" value="XXXX-XXXXXX"
                                    class="info-field" disabled>
                            </div>
                            <div class="info-wrapper">
                                <span class="info-label">School Email:</span>
                                <input type="text" name="school-email" id="school-email" s
                                    value="email@students.nu-laguna.edu.ph" class="info-field" disabled>
                            </div>
                            <div class="info-wrapper">
                                <span class="info-label">Role:</span>
                                <input type="text" name="account-role" id="account-role" value="Account Role"
                                    class="info-field" disabled>
                            </div>
                            <div class="info-wrapper">
                                <span class="info-label">Program:</span>
                                <input type="text" name="account-program" id="account-program" value="BSCS"
                                    class="info-field" disabled>
                            </div>
                            <div class="info-wrapper"></div>
                        </div>
                    </div>
                </div>
                <div class="info-section-items" id="favorite-list-section">
                    <div id="favorite-upper" class="favorite-section">
                        <span>Your Favorite Thesis List</span>
                    </div>
                    <div id="favorite-lower" class="favorite-section">
                        <div id="tool-box">
                            Toolbox Coming Soon!
                        </div>
                        <div id="favorite-list-wrapper">
                            <!--Favorite Theses will be rendered here-->
                        </div>
                    </div>
                </div>
                <div class="info-section-items" id="history-list-section">
                    <div id="history-upper" class="history-section">
                        <span>Your Theses Viewing History</span>
                    </div>
                    <div id="history-lower" class="history-section">
                        <div id="list-labels">
                            <span>Thesis Name</span>
                            <span>Viewed_at</span>
                            <span>Re-visit</span>
                        </div>
                        <div id="history-list-wrapper">
                            <!--Viewed Thesis will be rendered here-->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>

    <script>
        const baseURL = "<?php echo $BASE_URL; ?>";
    </script>
    <script type="module" src="<?php echo $BASE_URL; ?>view/js/view-account/view-account.js"></script>
    <script type="module" src="<?php echo $BASE_URL; ?>view/js/view-account/render-favorite.js?"></script>
    <script type="module" src="<?php echo $BASE_URL; ?>view/js/general/sidebar.js"></script>
    <script src="<?php echo $BASE_URL; ?>view/js/general/broadcast-receiver.js?"></script>

</body>

</html>