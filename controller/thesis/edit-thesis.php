<?php
require_once __DIR__ . '/../../config/connection.php';
header('Content-Type: application/json');

try {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input || empty($input['thesis_id'])) {
        echo json_encode(["success" => false, "error" => "Missing thesis ID."]);
        exit;
    }

    // Extract input
    $thesis_id = intval($input['thesis_id']);
    $title = $input['title'] ?? '';
    $pub_place = $input['pub_place'] ?? '';
    $pub_date = $input['pub_date'] ?? null;
    $abstract = $input['abstract'] ?? '';
    $page_count = intval($input['page_count'] ?? 0);
    $methodology_id = intval($input['methodology_id'] ?? 0);
    $program_id = intval($input['program_id'] ?? 0);
    $cover_path = $input['cover_path'] ?? '';
    $pdf_path = $input['pdf_path'] ?? '';

    $authors = $input['authors'] ?? [];
    $thesis_types = $input['thesis_types'] ?? [];
    $keywords = $input['keywords'] ?? [];
    $references = $input['references'] ?? [];

    // ----------------------------------------------------
    // Minimal backend safety
    // ----------------------------------------------------
    if (str_contains($cover_path, '..') || str_contains($pdf_path, '..')) {
        echo json_encode(["success" => false, "error" => "Invalid file path."]);
        exit;
    }

    if ($methodology_id <= 0 || $program_id <= 0) {
        echo json_encode(["success" => false, "error" => "Invalid foreign key."]);
        exit;
    }

    // Check FK existence
    $stmt = $conn->prepare("SELECT method_id FROM methodology WHERE method_id=?");
    $stmt->execute([$methodology_id]);
    if (!$stmt->fetch()) {
        echo json_encode(["success" => false, "error" => "Methodology does not exist."]);
        exit;
    }

    $stmt = $conn->prepare("SELECT program_id FROM programs WHERE program_id=?");
    $stmt->execute([$program_id]);
    if (!$stmt->fetch()) {
        echo json_encode(["success" => false, "error" => "Program does not exist."]);
        exit;
    }

    // ----------------------------------------------------
    // Update main thesis data
    // ----------------------------------------------------
    $conn->beginTransaction();

    $updateFields = [
        "title=?",
        "pub_place=?",
        "pub_date=?",
        "abstract=?",
        "page_count=?",
        "method_id=?",
        "program_id=?"
    ];

    $values = [
        $title,
        $pub_place,
        $pub_date,
        $abstract,
        $page_count,
        $methodology_id,
        $program_id
    ];

    if (!empty($cover_path)) {
        $updateFields[] = "thesis_cover=?";
        $values[] = $cover_path;
    }

    if (!empty($pdf_path)) {
        $updateFields[] = "file_location=?";
        $values[] = $pdf_path;
    }

    $values[] = $thesis_id;

    $sql = "UPDATE thesis SET " . implode(", ", $updateFields) . " WHERE thesis_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->execute($values);

    // ----------------------------------------------------
    // Update Authors
    // ----------------------------------------------------
    $conn->prepare("DELETE FROM thesis_authors WHERE thesis_id=?")->execute([$thesis_id]);
    $authorStmt = $conn->prepare("INSERT INTO thesis_authors (thesis_id, author_id) VALUES (?, ?)");

    $findAuthor = $conn->prepare("SELECT author_id FROM authors WHERE firstname=? AND lastname=? AND (middlename=? OR middlename IS NULL)");
    $insertAuthor = $conn->prepare("INSERT INTO authors (firstname, middlename, lastname) VALUES (?, ?, ?)");

    foreach ($authors as $a) {
        $fn = $a['firstname'] ?? '';
        $mn = $a['middlename'] ?? null;
        $ln = $a['lastname'] ?? '';

        if (empty($fn) || empty($ln))
            continue;

        $findAuthor->execute([$fn, $ln, $mn]);
        $row = $findAuthor->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $author_id = $row['author_id'];
        } else {
            $insertAuthor->execute([$fn, $mn, $ln]);
            $author_id = $conn->lastInsertId();
        }

        $authorStmt->execute([$thesis_id, $author_id]);
    }

    // ----------------------------------------------------
    // Update Thesis Types
    // ----------------------------------------------------
    $conn->prepare("DELETE FROM thesis_types WHERE thesis_id=?")->execute([$thesis_id]);

    $typeStmt = $conn->prepare("INSERT INTO thesis_types (thesis_id, type_id) VALUES (?, ?)");
    foreach ($thesis_types as $type_id) {
        $typeStmt->execute([$thesis_id, intval($type_id)]);
    }

    // ----------------------------------------------------
    // Update Keywords
    // ----------------------------------------------------
    $conn->prepare("DELETE FROM thesis_keyword WHERE thesis_id=?")->execute([$thesis_id]);

    $findKw = $conn->prepare("SELECT keyword_id FROM keywords WHERE keyword=?");
    $addKw = $conn->prepare("INSERT INTO keywords (keyword) VALUES (?)");
    $linkKw = $conn->prepare("INSERT INTO thesis_keyword (thesis_id, keyword_id) VALUES (?, ?)");

    foreach ($keywords as $kw) {
        $kw = trim($kw);
        if (empty($kw))
            continue;

        $findKw->execute([$kw]);
        $row = $findKw->fetch(PDO::FETCH_ASSOC);

        if ($row)
            $kid = $row['keyword_id'];
        else {
            $addKw->execute([$kw]);
            $kid = $conn->lastInsertId();
        }

        $linkKw->execute([$thesis_id, $kid]);
    }

    // ----------------------------------------------------
    // Update References
    // ----------------------------------------------------
    $conn->prepare("DELETE FROM thesis_refer WHERE thesis_id=?")->execute([$thesis_id]);

    $findRef = $conn->prepare("SELECT ref_id FROM references_list WHERE reference=?");
    $addRef = $conn->prepare("INSERT INTO references_list (reference) VALUES (?)");
    $linkRef = $conn->prepare("INSERT INTO thesis_refer (thesis_id, ref_id) VALUES (?, ?)");

    foreach ($references as $ref) {
        $ref = trim($ref);
        if (empty($ref))
            continue;

        $findRef->execute([$ref]);
        $row = $findRef->fetch(PDO::FETCH_ASSOC);

        if ($row)
            $rid = $row['ref_id'];
        else {
            $addRef->execute([$ref]);
            $rid = $conn->lastInsertId();
        }

        $linkRef->execute([$thesis_id, $rid]);
    }

    // ----------------------------------------------------
    $conn->commit();

    echo json_encode(["success" => true, "message" => "Thesis updated successfully."]);

} catch (Exception $e) {
    if ($conn->inTransaction())
        $conn->rollBack();
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>