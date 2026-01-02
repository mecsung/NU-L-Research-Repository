<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../../config/connection.php';

// Query publication trends
$query = "
  SELECT 
    p.program_name,
    COUNT(r.rating_id) AS rating_count,
    ROUND(AVG(r.rating_value), 2) AS avg_rating,

    -- Compute Bayesian average per program
    ROUND((
        (COUNT(r.rating_id) * AVG(r.rating_value)) + 
        ((SELECT @m := 5) * (SELECT AVG(rating_value) FROM thesis_ratings))
    ) / (COUNT(r.rating_id) + (SELECT @m := 5)), 2) AS bayesian_rating

    FROM programs p
    JOIN thesis t ON p.program_id = t.program_id
    JOIN thesis_ratings r ON t.thesis_id = r.thesis_id

    GROUP BY p.program_name
    ORDER BY bayesian_rating DESC
    LIMIT 10;
";
$result = $conn->query($query);
$highest_rated_program = $result->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(
    [
        "highest_rated_program" => $highest_rated_program
    ],
    JSON_PRETTY_PRINT
);

?>