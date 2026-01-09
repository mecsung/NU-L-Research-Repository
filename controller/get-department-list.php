<?php
require_once __DIR__ . '/../config/connection.php';
header('Content-Type: application/json');

$result;

$department_query = "SELECT dept_id as id, department_name as name, acronym FROM departments ORDER BY dept_id ASC;";

$result = $conn->query($department_query);
$departments = $result->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($departments);

