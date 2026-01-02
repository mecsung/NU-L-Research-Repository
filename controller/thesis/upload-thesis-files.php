<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Get thesis title from formData
    $rawTitle = $_POST['thesis_title'] ?? 'untitled';

    // Sanitize for filename use
    $title = preg_replace('/[^a-zA-Z0-9_-]/', '_', strtolower($rawTitle));

    $uploadDirs = [
        'cover' => __DIR__ . '/../../uploads/covers/',
        'pdf' => __DIR__ . '/../../uploads/pdfs/'
    ];

    foreach ($uploadDirs as $dir) {
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }
    }

    $responses = [];

    /**
     * Generic uploader
     */
    function handleUpload($fileKey, $prefix, $targetDir, $title)
    {
        if (!isset($_FILES[$fileKey]) || $_FILES[$fileKey]['error'] !== UPLOAD_ERR_OK) {
            return ['error' => "$fileKey upload failed or missing."];
        }

        $tmpPath = $_FILES[$fileKey]['tmp_name'];
        $ext = strtolower(pathinfo($_FILES[$fileKey]['name'], PATHINFO_EXTENSION));

        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];
        if (!in_array($ext, $allowed)) {
            return ['error' => "$fileKey has invalid file type."];
        }

        // New naming convention: prefix_title_timestamp.ext
        $newName = "{$title}_" . time() . "." . $ext;
        $destPath = $targetDir . $newName;

        if (move_uploaded_file($tmpPath, $destPath)) {
            return ['path' => "uploads/" . basename($targetDir) . "/" . $newName];
        }

        return ['error' => "Failed to upload $fileKey."];
    }

    // Upload using new naming convention
    $cover = handleUpload('thesis-cover', 'cover', $uploadDirs['cover'], $title);
    $pdf = handleUpload('thesis-file', 'thesis', $uploadDirs['pdf'], $title);

    if (isset($cover['path']))
        $responses['cover'] = $cover['path'];
    if (isset($cover['error']))
        $responses['cover_error'] = $cover['error'];

    if (isset($pdf['path']))
        $responses['pdf'] = $pdf['path'];
    if (isset($pdf['error']))
        $responses['pdf_error'] = $pdf['error'];

    echo json_encode($responses);
}
?>