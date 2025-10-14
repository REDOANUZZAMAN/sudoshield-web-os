<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'zhongitt_oos');
define('DB_PASS', '^W_6op6A!bOo2wsp');
define('DB_NAME', 'zhongitt_oos');

// Session Configuration
define('SESSION_LIFETIME', 86400); // 24 hours in seconds

// Security Configuration
define('HASH_ALGO', 'sha256');
define('SESSION_NAME', 'SUDOSHIELD_SESSION');

// CORS Configuration (if needed)
define('ALLOW_ORIGIN', '*'); // Change to your domain in production

// Error Reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_name(SESSION_NAME);
    session_start();
}

// Database Connection
function getDBConnection() {
    try {
        $conn = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
        return $conn;
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        exit();
    }
}

// Set JSON headers and CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . ALLOW_ORIGIN);
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
