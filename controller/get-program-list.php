<?php
require_once __DIR__ . '/../config/connection.php';
header('Content-Type: application/json');

$result;

$programs_query = "SELECT program_id as id, program_name as name, acronym FROM programs ORDER BY program_id ASC;";

$result = $conn->query($programs_query);
$programs = $result->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($programs);

