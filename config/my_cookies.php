<?php
require_once __DIR__ . '/baseUrl.php';

// Set cookie
function setMyCookie($name, $value, $expiryDays = 1)
{
    setcookie($name, $value, time() + (86400 * $expiryDays), "/");
}

// Get cookie
function getMyCookie($name)
{
    return $_COOKIE[$name] ?? null;
}

// Delete cookie
function deleteMyCookie($name)
{
    setcookie($name, '', time() - 3600, "/");
}

?>