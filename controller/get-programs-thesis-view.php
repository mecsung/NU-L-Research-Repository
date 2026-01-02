<?php
require_once __DIR__ . '/../config/connection.php';
header('Content-Type: application/json');
date_default_timezone_set('Asia/Manila'); // ensure correct timezone

try {
    $input = json_decode(file_get_contents('php://input'), true);

    $filter = $input['filter'] ?? ""; // today, week, month, year, time_line
    $time_line = $input['time_line'] ?? ""; // e.g., "2025-10-10 - 2025-11-08"

    // Initialize
    $whereDateCurrent = "";
    $whereDatePrevious = "";
    $paramsCurrent = [];
    $paramsPrevious = [];

    switch ($filter) {
        case 'today':
            // Today
            $today = date('Y-m-d');
            $whereDateCurrent = " AND DATE(tv.viewed_at) = :today";
            $paramsCurrent[':today'] = $today;

            // Yesterday
            $yesterday = date('Y-m-d', strtotime('-1 day'));
            $whereDatePrevious = " AND DATE(tv.viewed_at) = :yesterday";
            $paramsPrevious[':yesterday'] = $yesterday;
            break;

        case 'week':
            $todayObj = new DateTime();
            $dayOfWeek = (int) $todayObj->format('N'); // 1 (Mon) - 7 (Sun)

            // Current week Monday → Sunday
            $monday = clone $todayObj;
            $monday->modify('-' . ($dayOfWeek - 1) . ' days');
            $sunday = clone $todayObj;
            $sunday->modify('+' . (7 - $dayOfWeek) . ' days');

            $whereDateCurrent = " AND DATE(tv.viewed_at) BETWEEN :start AND :end";
            $paramsCurrent[':start'] = $monday->format('Y-m-d');
            $paramsCurrent[':end'] = $sunday->format('Y-m-d');

            // Last week Monday → Sunday
            $lastMonday = clone $monday;
            $lastMonday->modify('-7 days');
            $lastSunday = clone $sunday;
            $lastSunday->modify('-7 days');

            $whereDatePrevious = " AND DATE(tv.viewed_at) BETWEEN :last_start AND :last_end";
            $paramsPrevious[':last_start'] = $lastMonday->format('Y-m-d');
            $paramsPrevious[':last_end'] = $lastSunday->format('Y-m-d');
            break;

        case 'month':
            // Current month
            $whereDateCurrent = " AND MONTH(tv.viewed_at) = :month AND YEAR(tv.viewed_at) = :year";
            $paramsCurrent[':month'] = date('n');
            $paramsCurrent[':year'] = date('Y');

            // Last month
            $lastMonthObj = new DateTime('first day of last month');
            $whereDatePrevious = " AND MONTH(tv.viewed_at) = :last_month AND YEAR(tv.viewed_at) = :last_month_year";
            $paramsPrevious[':last_month'] = (int) $lastMonthObj->format('n');
            $paramsPrevious[':last_month_year'] = (int) $lastMonthObj->format('Y');
            break;

        case 'year':
            // Current year
            $year = date('Y');
            $whereDateCurrent = " AND YEAR(tv.viewed_at) = :year";
            $paramsCurrent[':year'] = $year;

            // Last year
            $lastYear = $year - 1;
            $whereDatePrevious = " AND YEAR(tv.viewed_at) = :last_year";
            $paramsPrevious[':last_year'] = $lastYear;
            break;

        case 'time_line':
            if (!empty($time_line)) {
                [$start, $end] = explode(' - ', $time_line);
                $start = trim($start);
                $end = trim($end);

                // Current range
                $whereDateCurrent = " AND DATE(tv.viewed_at) BETWEEN :start AND :end";
                $paramsCurrent[':start'] = $start;
                $paramsCurrent[':end'] = $end;

                // Calculate number of days in the range
                $startDateObj = new DateTime($start);
                $endDateObj = new DateTime($end);
                $diffDays = $startDateObj->diff($endDateObj)->days + 1; // include both start and end

                // Previous range: same length before current start
                $prevEnd = clone $startDateObj;
                $prevEnd->modify('-1 day'); // day before current start
                $prevStart = clone $prevEnd;
                $prevStart->modify('-' . ($diffDays - 1) . ' days');

                $whereDatePrevious = " AND DATE(tv.viewed_at) BETWEEN :prev_start AND :prev_end";
                $paramsPrevious[':prev_start'] = $prevStart->format('Y-m-d');
                $paramsPrevious[':prev_end'] = $prevEnd->format('Y-m-d');
            }
            break;

    }

    // Function to get thesis views
    function getThesisViews($conn, $whereDate, $params)
    {
        $query = "
            SELECT 
                p.acronym,
                COUNT(tv.thesis_id) AS total_thesis_viewed
            FROM programs p
            LEFT JOIN thesis t ON t.program_id = p.program_id
            LEFT JOIN thesis_view_logs tv ON tv.thesis_id = t.thesis_id
                $whereDate
            GROUP BY p.program_id
        ";
        $stmt = $conn->prepare($query);
        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Fetch data
    $dataCurrent = getThesisViews($conn, $whereDateCurrent, $paramsCurrent);
    $dataPrevious = $whereDatePrevious ? getThesisViews($conn, $whereDatePrevious, $paramsPrevious) : [];

    echo json_encode([
        'success' => true,
        'current' => $dataCurrent,
        'previous' => $dataPrevious
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => "Database error: " . $e->getMessage()
    ]);
}
