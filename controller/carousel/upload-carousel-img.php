<?php
header('Content-Type: application/json');

$folder = __DIR__ . '/../../view/assets/carousel-imgs';

if (!isset($_FILES['image'])) {
    echo json_encode(['success' => false, 'message' => 'No file uploaded']);
    exit;
}

$file = $_FILES['image'];
$targetFile = $folder . '/' . basename($file['name']);

// Optional: validate file type
$allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$ext = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
if (!in_array($ext, $allowed)) {
    echo json_encode(['success' => false, 'message' => 'Invalid file type']);
    exit;
}

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $targetFile)) {
    echo json_encode(['success' => true, 'filename' => basename($file['name'])]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to move file']);
}
