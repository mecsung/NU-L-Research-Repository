<?php
header('Content-Type: application/json');

$folder = __DIR__ . '/../../view/assets/carousel-imgs';

// Validate JSON input
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['filename'])) {
    echo json_encode(["success" => false, "message" => "No filename provided"]);
    exit;
}

$filename = basename($input['filename']); // prevent directory traversal
$filePath = $folder . '/' . $filename;

if (!file_exists($filePath)) {
    echo json_encode(["success" => false, "message" => "File does not exist"]);
    exit;
}

if (unlink($filePath)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to delete"]);
}
