<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../config/connection.php';

try {
    // Get school_id directly from cookie
    $school_id = isset($_GET['school_id']) ? $_GET['school_id'] : "";


    if (!$school_id) {
        echo json_encode(["success" => false, "message" => "No school_id found."]);
        exit;
    }

    // Prepare and execute query
    $stmt = $conn->prepare("
   SELECT 
    t.thesis_id,
    t.title,
    t.abstract,
    t.pub_date,
    tf.added_at AS favorited_at,
    (
        SELECT CONCAT(a.lastname, ', ', a.firstname, ' ', a.middlename)
        FROM thesis_authors ta2
        JOIN authors a ON ta2.author_id = a.author_id
        WHERE ta2.thesis_id = t.thesis_id
        LIMIT 1
    ) AS author_name,
    COALESCE(ROUND(r.avg_rating, 1), 0) AS avg_rating,
    COALESCE(r.rating_count, 0) AS rating_count
    FROM thesis t
    JOIN thesis_favorite tf ON tf.thesis_id = t.thesis_id
    LEFT JOIN (
        SELECT 
            thesis_id, 
            AVG(rating_value) AS avg_rating,
            COUNT(rating_value) AS rating_count
        FROM thesis_ratings
        GROUP BY thesis_id
    ) r ON t.thesis_id = r.thesis_id
    WHERE tf.school_id = :school_id
    ORDER BY tf.added_at desc
    ");
    $stmt->bindParam(':school_id', $school_id, PDO::PARAM_STR);
    $stmt->execute();

    $favorites = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $favorites
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
