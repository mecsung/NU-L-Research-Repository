<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../config/connection.php';

$school_id = trim($_GET['school_id'] ?? '');
if ($school_id === '') {
    echo json_encode(['success' => false, 'message' => 'No school_id found.']);
    exit;
}

/* 1. Get account + role */
$stmt = $conn->prepare("
    SELECT account_id, school_id, school_email, role, date_created
    FROM accounts
    WHERE school_id = :school_id
    LIMIT 1
");
$stmt->execute(['school_id' => $school_id]);
$acc = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$acc) {
    echo json_encode(['success' => false, 'message' => 'Account not found.']);
    exit;
}

/* 2. Get profile by role */
if ($acc['role'] === 'student') {
    $sql = "
        SELECT s.first_name, s.last_name, p.program_name
        FROM students s
        JOIN programs p ON s.program_id = p.program_id
        WHERE s.account_id = :id
    ";
} else {
    $sql = "
        SELECT f.first_name, f.last_name, f.position, d.department_name
        FROM faculty f
        JOIN departments d ON f.dept_id = d.dept_id
        WHERE f.account_id = :id
    ";
}

$stmt = $conn->prepare($sql);
$stmt->execute(['id' => $acc['account_id']]);
$profile = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];

/* 3. Respond */
$acc['date_created'] = date("F j, Y", strtotime($acc['date_created']));

echo json_encode([
    'success' => true,
    'account_info' => array_merge($acc, $profile)
], JSON_PRETTY_PRINT);
