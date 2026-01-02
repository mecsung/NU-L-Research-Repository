<?php
require_once __DIR__ . '/../../config/my_cookies.php';

// Delete cookies set by PHP
deleteMyCookie('first_name');
deleteMyCookie('role');
deleteMyCookie('school_id');

// Destroy session
session_start();
$_SESSION = [];
session_destroy();

// Get filename from query or POST
$redirect = $_GET['redirect'] ?? $_POST['redirect'] ?? null;

// Redirect to the same page or index
if ($redirect) {
    header("Location: " . $redirect);
} else {
    header("Location: " . $BASE_URL);
}
exit();
?>