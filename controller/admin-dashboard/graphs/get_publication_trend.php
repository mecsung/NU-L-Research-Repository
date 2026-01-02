<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../../config/connection.php';

// Query publication trends
$query = "
    SELECT DATE_FORMAT(pub_date, '%Y-%m') AS month, COUNT(thesis_id) AS total
    FROM thesis
    GROUP BY month
    ORDER BY month;
";
$result = $conn->query($query);
$publication_trend = $result->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(
    [
        "publication_trend" => $publication_trend
    ],
    JSON_PRETTY_PRINT
);

?>