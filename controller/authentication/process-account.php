<?php
require_once __DIR__ . '/../../config/connection.php';
header('Content-Type: application/json');

try {
    /* 1. Decode input */
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        throw new Exception('Invalid JSON data');
    }

    /* 2. Extract data */
    $school_id = trim($data['schoolId'] ?? '');
    $email = strtolower(trim($data['email'] ?? ''));
    $firstname = trim($data['firstname'] ?? '');
    $lastname = trim($data['lastname'] ?? '');
    $password = $data['password'] ?? '';
    $role = trim($data['role'] ?? '');
    $program_id = $data['program_id'] ?? null;
    $dept_id = $data['program_id'] ?? null;

    /* 3. Validate required fields */
    if (
        empty($school_id) ||
        empty($email) ||
        empty($firstname) ||
        empty($lastname) ||
        empty($password) ||
        empty($role)
    ) {
        throw new Exception('Missing required fields');
    }

    $allowedRoles = ['student', 'faculty', 'admin'];
    if (!in_array($role, $allowedRoles, true)) {
        throw new Exception('Invalid role');
    }

    /* 4. Hash password */
    $salt = base64_encode(random_bytes(16));
    $hashedPassword = password_hash($salt . $password, PASSWORD_DEFAULT);

    /* 5. Start transaction */
    $conn->beginTransaction();

    /* 6. Check duplicates */
    $check = $conn->prepare("
        SELECT account_id
        FROM accounts
        WHERE school_id = :school_id
           OR school_email = :email
        LIMIT 1
    ");
    $check->execute([
        ':school_id' => $school_id,
        ':email' => $email
    ]);

    if ($check->fetch()) {
        throw new Exception('School ID or email already exists');
    }

    /* 7. Insert into accounts */
    $stmtAccount = $conn->prepare("
        INSERT INTO accounts (school_id, school_email, password, salt, role)
        VALUES (:school_id, :email, :password, :salt, :role)
    ");
    $stmtAccount->execute([
        ':school_id' => $school_id,
        ':email' => $email,
        ':password' => $hashedPassword,
        ':salt' => $salt,
        ':role' => $role
    ]);

    $account_id = $conn->lastInsertId();

    /* 8. Insert role-specific profile */
    if ($role === 'student') {

        if (empty($program_id)) {
            throw new Exception('Program is required for students');
        }

        $stmt = $conn->prepare("
            INSERT INTO students (first_name, last_name, account_id, program_id)
            VALUES (:first_name, :last_name, :account_id, :program_id)
        ");
        $stmt->execute([
            ':first_name' => $firstname,
            ':last_name' => $lastname,
            ':account_id' => $account_id,
            ':program_id' => $program_id
        ]);

    } else { // faculty OR admin

        $stmt = $conn->prepare("
            INSERT INTO faculty (school_id, first_name, last_name, account_id, dept_id, position)
            VALUES (:school_id, :first_name, :last_name, :account_id, :dept_id, NULL)
        ");
        $stmt->execute([
            ':school_id' => $school_id,
            ':first_name' => $firstname,
            ':last_name' => $lastname,
            ':account_id' => $account_id,
            ':dept_id' => $dept_id
        ]);
    }

    /* 9. Commit */
    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Account created successfully',
        'data' => [
            'school_id' => $school_id,
            'email' => $email,
            'name' => $firstname . ' ' . $lastname,
            'role' => $role
        ]
    ]);

} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }

    error_log('Account creation error: ' . $e->getMessage());

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
