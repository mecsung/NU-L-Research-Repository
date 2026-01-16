<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>NULTR | Create Account</title>

    <link rel="icon" type="image/x-icon" href="<?php echo $BASE_URL; ?>view/assets/favicons/favicon.ico">
    <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/root.css">
    <!-- <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/create-account.css"> -->
    <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/sign-in.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
</head>

<body>
    <!-- <div id="back-btn-wrapper">
        <button id="back-btn">GO TO HOMEPAGE</button>
    </div> -->

     <div class="container">
    
        <form id="form-wrapper" class="form-wrapper create-account-form">
            <div class="login-title">
                <img src="<?php echo $BASE_URL; ?>view/assets/favicons/Icon.png" alt="Icon">
                <span class="title-text">NU-L Thesis Repository</span>
            </div>
            
            <div class="form-section" id="body">
                <span class="login-text">Create an Account</span>

                <div class="breadcrumbs" id="breadcrumbs">Personal Details</div>

                <div id="input-fields-section">
                    <div id="input-fields">
                        <div class="text-field-wrapper">
                            <label for="school-id" id="id-label" class="labels">
                                <img width="22" height="22" src="https://img.icons8.com/pastel-glyph/100/person-male.png" alt="person-male"/>
                            </label>
                            <input type="text" id="school-id" class="text-fields" 
                                placeholder="School-ID" required>
                        </div>

                        <div class="text-field-wrapper">
                            <label for="school-id" id="id-label" class="labels">
                                <img width="20" height="20" src="https://img.icons8.com/ios/50/new-post--v1.png" alt="new-post--v1"/>
                            </label>
                            <input type="text" id="email" class="text-fields" 
                                placeholder="School Email" required>
                        </div>

                        <div class="text-field-wrapper">
                            <label for="school-id" id="id-label" class="labels">
                                <img width="22" height="22" src="https://img.icons8.com/pastel-glyph/100/person-male.png" alt="person-male"/>
                            </label>
                            <input type="text" id="firstname" class="text-fields" 
                                placeholder="First Name" required>
                        </div>

                        <div class="text-field-wrapper">
                            <label for="school-id" id="id-label" class="labels">
                                <img width="22" height="22" src="https://img.icons8.com/pastel-glyph/100/person-male.png" alt="person-male"/>
                            </label>
                            <input type="text" id="lastname" class="text-fields" 
                                placeholder="Last Name" required>
                        </div>
                        
                    </div>
                    <div class="next-btn">
                        <input type="button" value="Next" id="go-to-selection-btn" class="btns">
                    </div>
                    
                </div>

                <div id="selection-section">
                    <select name="role" id="role-selection" class="selections">
                        <option value="" disabled selected>Role</option>
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                    </select>

                    <select name="program" id="subtype-selection" class="selections">
                        <option value="">-- Select Program --</option>
                    </select>

                    <div class="text-field-wrapper">
                        <label for="school-id" id="id-label" class="labels">
                            <img width="22" height="22" src="https://img.icons8.com/ios/50/lock--v1.png" alt="lock-password"/>
                        </label>
                        <input type="password" name="password" id="password" class="text-fields" 
                            placeholder="Password" required>
                    </div>

                    <div class="back-btn">
                        <input type="button" value="Back" id="back-to-input-btn" class="btns">
                    </div>

                    <input type="submit" value="Create Account" id="create-btn" class="create-btn">
                    
                </div>

                <div id="buttons-section buttons-section-acc">
                    <span>Have an account? </span>
                    <input type="button" value="Sign In" id="sign-in-btn" class="btns">
                </div>
            </div>
        </form>
        <div class="image-cover create-account-image">
            <img src="<?php echo $BASE_URL; ?>view/assets/NU-cover.jpg" alt="">
        </div>

    </div>

    <script>const baseURL = "<?php echo $BASE_URL; ?>";</script>
    <script src="<?php echo $BASE_URL; ?>View/js/create-account.js?v=<?php echo time(); ?>"></script>
    <script src="<?php echo $BASE_URL; ?>View/js/create-account-navigate.js"></script>
    
</body>

</html>