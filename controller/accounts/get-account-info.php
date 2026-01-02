<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../config/connection.php';

$school_id = isset($_GET['school_id']) ? $_GET['school_id'] : "";

if (!$school_id) {
    echo json_encode(["success" => false, "message" => "No school_id found."]);
    exit;
}

// Query publication trends
$query = "
   SELECT ac.school_id, ac.first_name, ac.last_name, ac.school_email,
          ac.date_created, ac.role, p.program_name
   FROM account_table ac join programs p on ac.program_id = p.program_id
   WHERE ac.school_id = :school_id
";
$stmt = $conn->prepare($query);
$stmt->bindParam(':school_id', $school_id, PDO::PARAM_STR);
$stmt->execute();

$account_info = $stmt->fetch(PDO::FETCH_ASSOC);

$account_info['date_created'] = date("F j, Y", strtotime($account_info['date_created']));

echo json_encode([
    "success" => true,
    "account_info" => $account_info
], JSON_PRETTY_PRINT);
?>