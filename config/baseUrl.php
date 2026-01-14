<?php

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
$BASE_URL = $protocol . $_SERVER['HTTP_HOST'] . "/NUL-THESIS-REPO/"; // Change into "/" when deployed

?>