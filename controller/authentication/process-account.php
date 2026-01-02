<?php
require_once __DIR__ . '/../../config/connection.php';
header('Content-Type: application/json');

try {
    // Decode JSON input
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data)
        throw new Exception('Invalid JSON data');

    // Extract data
    $schoolId = $data['schoolId'] ?? '';
    $email = $data['email'] ?? '';
    $firstname = $data['firstname'] ?? '';
    $lastname = $data['lastname'] ?? '';
    $password = $data['password'] ?? '';
    $role = $data['role'] ?? '';
    $program_id = $data['program_id'] ?? '';

    // Hash password with salt
    $salt = base64_encode(random_bytes(16));
    $hashedPassword = password_hash($salt . $password, PASSWORD_DEFAULT);

    // Check for duplicates
    $stmt = $conn->prepare("SELECT school_id, school_email FROM account_table WHERE school_id=? OR school_email=?");
    $stmt->execute([$schoolId, $email]);
    if ($stmt->fetch())
        throw new Exception('Account with this School ID or email already exists');

    // Insert into DB
    $stmt = $conn->prepare("INSERT INTO account_table (school_id, first_name, last_name, school_email, password, salt, role, program_id) VALUES (?,?,?,?,?,?,?,?)");
    $stmt->execute([$schoolId, $firstname, $lastname, $email, $hashedPassword, $salt, $role, $program_id]);

    echo json_encode([
        'success' => true,
        'message' => 'Account created successfully',
        'data' => [
            'schoolId' => $schoolId,
            'email' => $email,
            'name' => $firstname . ' ' . $lastname,
            'role' => $role
        ]
    ]);

} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error.']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>