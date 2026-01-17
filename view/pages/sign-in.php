
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NULTR | Login</title>
    <link rel="icon" type="image/x-icon" href="<?php echo $BASE_URL; ?>view/assets/favicons/favicon.ico">
    <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/root.css">
    <link rel="stylesheet" href="<?php echo $BASE_URL; ?>view/css/sign-in.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
    
</head>

<body>
    
    <div class="container">
    
        <div class="image-cover">
            <img src="<?php echo $BASE_URL; ?>view/assets/NU-cover.jpg" alt="">
        </div>
        <form id="form-wrapper" class="form-wrapper">
            <div id="back-btn-wrapper">
                <button id="back-btn" class="home-btn">
                    <img width="22" height="22" src="https://img.icons8.com/ios-filled/50/back.png" alt="back"/>
                </button>
            </div>
            <div class="login-title">
                <img src="<?php echo $BASE_URL; ?>view/assets/favicons/Icon.png" alt="Icon">
                <span class="title-text">NU-L Thesis Repository</span>
            </div>
            
            <div class="form-section" id="body">
                <span class="login-text">Sign In</span>
                <div id="input-fields-section">
                    <div class="text-field-wrapper">
                        <label for="school-id" id="id-label" class="labels">
                            <img width="22" height="22" src="https://img.icons8.com/pastel-glyph/100/person-male.png" alt="person-male"/>
                        </label>
                        <input type="text" name="school-id" id="school-id" 
                            class="text-fields" placeholder="School-ID"
                            required>
                    </div>
                    <div class="text-field-wrapper">
                        <label for="password" id="password-label" class="labels">
                            <img width="22" height="22" src="https://img.icons8.com/ios/50/lock--v1.png" alt="lock--v1"/>
                        </label>
                        <input type="password" name="password" id="password"
                            class="text-fields" placeholder="Password"
                            required>
                    </div>
                    <a href="" class="forgot-pass">Forgot Password?</a>
                </div>
                <div id="buttons-section">
                    <div class="btn-wrapper sign-in-wrapper">
                        <button type="submit" id="sign-in-btn" 
                        class="functional-btn">Login</button>
                    </div>
                    <span class="btn-wrapper dont-have-acc">Don't have an account?</span>
                    <div class="btn-wrapper create-account-wrapper">
                        <button type="button" id="create-btn" 
                        class="functional-btn">Create an Account</button>
                    </div>
                </div>
            </div>
        </form>

    </div>
    
    <script>const baseURL = "<?php echo $BASE_URL; ?>";</script>
    <script src="<?php echo $BASE_URL; ?>view/js/sign-in.js?v=<?php echo time(); ?>"></script>
</body>

</html>