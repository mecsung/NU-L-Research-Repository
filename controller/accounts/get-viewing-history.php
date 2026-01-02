<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../config/connection.php';

// Get school_id directly from cookie
$school_id = isset($_GET['school_id']) ? $_GET['school_id'] : "";

if (!$school_id) {
  echo json_encode(["success" => false, "message" => "No school_id found."]);
  exit;
}

// Query publication trends
$query = "
  SELECT t.thesis_id, t.title, tv.viewed_at
FROM thesis t
JOIN thesis_view_logs tv
  ON t.thesis_id = tv.thesis_id
JOIN (
    -- Subquery to get latest viewed_at per thesis
    SELECT thesis_id, MAX(viewed_at) AS latest_view
    FROM thesis_view_logs
    WHERE school_id = :school_id
    GROUP BY thesis_id
) latest
  ON tv.thesis_id = latest.thesis_id
 AND tv.viewed_at = latest.latest_view
WHERE tv.school_id = :school_id
ORDER BY tv.viewed_at DESC

";
$stmt = $conn->prepare($query);
$stmt->bindParam(':school_id', $school_id, PDO::PARAM_STR);
$stmt->execute();

$viewing_history = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(
  [
    "viewing_history" => $viewing_history
  ],
  JSON_PRETTY_PRINT
);

?>