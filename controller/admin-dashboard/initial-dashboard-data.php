<?php
require_once __DIR__ . '/../../config/connection.php';
header('Content-Type: application/json');

try {
    // Users per role
    $users_query = "
        SELECT ac.role, COUNT(ac.school_id) AS total
        FROM accounts ac
        GROUP BY ac.role
    ";
    $users_result = $conn->query($users_query);
    $users_data = $users_result->fetchAll(PDO::FETCH_ASSOC);

    // Total theses
    $thesis_query = "SELECT COUNT(thesis_id) AS thesis_count FROM thesis";
    $thesis_result = $conn->query($thesis_query);
    $thesis_count = $thesis_result->fetch(PDO::FETCH_ASSOC)['thesis_count'];

    // Average Monthly Thesis Uploads
    $monthly_query = "
    SELECT ROUND(AVG(thesis_count)) AS avg_monthly_uploads
    FROM (
        SELECT 
            DATE_FORMAT(pub_date, '%Y-%m') AS month_year,
            COUNT(thesis_id) AS thesis_count
        FROM thesis
        WHERE YEAR(pub_date) = YEAR(CURDATE())
        GROUP BY month_year
    ) AS monthly_counts
    ";

    $monthly_upload_result = $conn->query($monthly_query);
    $monthly_upload = $monthly_upload_result->fetch(PDO::FETCH_ASSOC)['avg_monthly_uploads'] ?? 0;

    // Average Monthly Thesis Uploads
    $program_query = "
        SELECT 
            ROUND(AVG(total_thesis_viewed), 0) AS avg_views_per_program
        FROM (
            SELECT 
                p.program_name,
                COUNT(tv.thesis_id) AS total_thesis_viewed
            FROM programs p
            LEFT JOIN thesis t 
                ON t.program_id = p.program_id
            LEFT JOIN thesis_view_logs tv 
                ON tv.thesis_id = t.thesis_id
            GROUP BY p.program_id
        ) AS program_thesis_view;
    ";

    $program_upload_result = $conn->query($program_query);
    $avg_views_per_program = $program_upload_result->fetch(PDO::FETCH_ASSOC)['avg_views_per_program'] ?? 0;

    // Return JSON
    echo json_encode([
        "success" => true,
        "user_data" => $users_data,
        "thesis_count" => $thesis_count,
        "monthly_uploads" => $monthly_upload,
        "avg_views_per_program" => $avg_views_per_program
    ], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
