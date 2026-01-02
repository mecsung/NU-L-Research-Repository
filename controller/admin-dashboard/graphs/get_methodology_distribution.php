<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../../config/connection.php';

// Query publication trends
$query = "
   SELECT m.method_name, COUNT(t.thesis_id) AS count
    FROM thesis t
    JOIN methodology m ON t.method_id = m.method_id
    GROUP BY m.method_name;
";
$result = $conn->query($query);
$meth_distribution = $result->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(
    [
        "meth_distribution" => $meth_distribution
    ],
    JSON_PRETTY_PRINT
);

?>