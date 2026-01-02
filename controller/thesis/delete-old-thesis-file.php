<?php
// delete-old-thesis-file.php
header('Content-Type: application/json');

require_once __DIR__ . '/../../config/connection.php';

try {
    // Read JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        throw new Exception("Invalid request.");
    }

    $coverFile = $input['cover'] ?? null;
    $pdfFile = $input['pdf'] ?? null;

    if (!$coverFile && !$pdfFile) {
        throw new Exception("No files specified for deletion.");
    }

    // Define upload directories
    $coverDir = __DIR__ . '/../../uploads/covers/';
    $pdfDir = __DIR__ . '/../../uploads/pdfs/';

    $deletedFiles = [];

    // Helper to delete a file safely
    function safeDelete($dir, $file)
    {
        $filePath = realpath($dir . basename($file));
        // Check if file is inside intended directory
        if ($filePath && str_starts_with($filePath, realpath($dir)) && file_exists($filePath)) {
            unlink($filePath);
            return true;
        }
        return false;
    }

    if ($coverFile && safeDelete($coverDir, $coverFile)) {
        $deletedFiles[] = $coverFile;
    }

    if ($pdfFile && safeDelete($pdfDir, $pdfFile)) {
        $deletedFiles[] = $pdfFile;
    }

    echo json_encode([
        'success' => true,
        'deleted' => $deletedFiles
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
