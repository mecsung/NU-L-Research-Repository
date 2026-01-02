<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../config/connection.php';
require_once __DIR__ . '/../../config/my_cookies.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['school_id'], $input['password'])) {
    echo json_encode(['success' => false, 'message' => 'Missing input.']);
    exit;
}

$school_id = trim($input['school_id']);
$password = trim($input['password']);

try {
    $stmt = $conn->prepare("SELECT * FROM account_table WHERE school_id = :school_id");
    $stmt->execute(['school_id' => $school_id]);
    $account = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$account) {
        echo json_encode(['success' => false, 'message' => 'Account not found.']);
        exit;
    }

    // Defensive check
    if (empty($account['salt'])) {
        echo json_encode(['success' => false, 'message' => 'Salt missing for this account.']);
        exit;
    }

    $saltedPassword = $account['salt'] . $password;

    // Set the cookie after verifying

    if (password_verify($saltedPassword, $account['password'])) {
        // Set cookies
        setMyCookie('first_name', $account['first_name']);
        setMyCookie('school_id', $account['school_id']);

        echo json_encode([
            'success' => true,
            'first_name' => $account['first_name'],
            'role' => $account['role'],
            'school_id' => $account['school_id'],
            'message' => 'Login successful.'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid password.']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>