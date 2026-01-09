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
    /* 1. Fetch account (AUTH SOURCE) */
    $stmt = $conn->prepare("
        SELECT *
        FROM accounts
        WHERE school_id = :school_id
        LIMIT 1
    ");
    $stmt->execute(['school_id' => $school_id]);
    $account = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$account) {
        echo json_encode(['success' => false, 'message' => 'Account not found.']);
        exit;
    }

    /* 2. Verify password */
    if (empty($account['salt'])) {
        echo json_encode(['success' => false, 'message' => 'Salt missing for this account.']);
        exit;
    }

    $saltedPassword = $account['salt'] . $password;

    if (!password_verify($saltedPassword, $account['password'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid password.']);
        exit;
    }

    /* 3. Fetch profile info based on role */
    $first_name = null;

    if ($account['role'] === 'student') {
        $stmt = $conn->prepare("
            SELECT first_name
            FROM students
            WHERE account_id = :account_id
            LIMIT 1
        ");
        $stmt->execute(['account_id' => $account['account_id']]);
        $profile = $stmt->fetch(PDO::FETCH_ASSOC);
        $first_name = $profile['first_name'] ?? null;

    } elseif (in_array($account['role'], ['faculty', 'admin'], true)) {
        $stmt = $conn->prepare("
            SELECT first_name
            FROM faculty
            WHERE account_id = :account_id
            LIMIT 1
        ");
        $stmt->execute(['account_id' => $account['account_id']]);
        $profile = $stmt->fetch(PDO::FETCH_ASSOC);
        $first_name = $profile['first_name'] ?? null;
    }

    /* 4. Set cookies */
    if ($first_name) {
        setMyCookie('first_name', $first_name);
    }

    setMyCookie('school_id', $account['school_id']);
    setMyCookie('role', $account['role']);

    /* 5. Response */
    echo json_encode([
        'success' => true,
        'first_name' => $first_name,
        'role' => $account['role'],
        'school_id' => $account['school_id'],
        'message' => 'Login successful.'
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error.'
    ]);
}
