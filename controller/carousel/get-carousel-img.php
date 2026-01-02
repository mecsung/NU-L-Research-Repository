<?php
$folder = __DIR__ . '/../../view/assets/carousel-imgs';

// Get image files
$files = array_values(array_filter(scandir($folder), function ($file) {
    return preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $file);
}));

// Sort files by modification time (newest first)
usort($files, function ($a, $b) use ($folder) {
    return filemtime($folder . '/' . $b) - filemtime($folder . '/' . $a);
});

echo json_encode($files);
