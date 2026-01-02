<?php
require_once __DIR__ . '/../config/connection.php';

try {
    $stmt = $conn->query("
        SELECT DISTINCT YEAR(pub_date) AS year
        FROM thesis
        WHERE pub_date IS NOT NULL
        ORDER BY year DESC
    ");
    $years = $stmt->fetchAll(PDO::FETCH_COLUMN);
    return $years;
} catch (PDOException $e) {
    return [];
}
