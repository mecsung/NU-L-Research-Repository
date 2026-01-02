<?php

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
$BASE_URL = $protocol . $_SERVER['HTTP_HOST'] . "/thesis_repo/"; // Change into "/" when deployed

?>