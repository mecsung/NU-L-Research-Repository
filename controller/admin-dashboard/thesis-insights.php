<?php

require_once __DIR__ . '/../../config/connection.php';
header('Content-Type: application/json');

$result;

$most_viewed_query = "
                    SELECT 
                    t.thesis_id,
                    t.title,
                    (
                        SELECT COUNT(*) 
                        FROM thesis_view_logs tvl 
                        WHERE tvl.thesis_id = t.thesis_id
                    ) AS visit_count
                    FROM thesis t
                    ORDER BY visit_count DESC
                    LIMIT 10;

                    ";
$result = $conn->query($most_viewed_query);
$most_viewed = $result->fetchAll(PDO::FETCH_ASSOC);

$highest_rated_query = "
SELECT 
    t.thesis_id,
    t.title,
    COUNT(r.rating_id) AS rating_count,
    ROUND(AVG(r.rating_value), 2) AS avg_rating,

    -- Global average (C) and minimum threshold (m) are computed inside subqueries
    ROUND((
        (COUNT(r.rating_id) * AVG(r.rating_value)) + 
        ((SELECT @m := 5) * (SELECT AVG(rating_value) FROM thesis_ratings))
    ) / (COUNT(r.rating_id) + (SELECT @m := 5)), 2) AS bayesian_rating

FROM thesis t
LEFT JOIN thesis_ratings r ON t.thesis_id = r.thesis_id
GROUP BY t.thesis_id
ORDER BY bayesian_rating DESC
LIMIT 10
";
$result = $conn->query($highest_rated_query);
$highest_rated = $result->fetchAll(PDO::FETCH_ASSOC);

$contribution_query = "
select p.program_name, count(t.thesis_id) as thesis_count from programs p join thesis t on 
p.program_id = t.program_id GROUP by p.program_name order by thesis_count desc limit 10";
$result = $conn->query($contribution_query);
$proragm_contribution = $result->fetchAll(PDO::FETCH_ASSOC);

$recent_query = "select t.thesis_id,t.title, t.added_at as upload_date from thesis t order by t.added_at desc limit 10;";
$result = $conn->query($recent_query);
$recent_thesis = $result->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(
    [
        "most_viewed" => $most_viewed,
        "highest_rated" => $highest_rated,
        "program_contribution" => $proragm_contribution,
        "recent_theses" => $recent_thesis
    ],
    JSON_PRETTY_PRINT
);