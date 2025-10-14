<?php
require_once 'config.php';

// Get request method
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Route the request
switch($action) {
    case 'login':
        handleLogin();
        break;
    case 'logout':
        handleLogout();
        break;
    case 'check':
        handleCheckSession();
        break;
    case 'update':
        handleUpdateCredentials();
        break;
    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}

// Handle Login
function handleLogin() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Username and password required']);
        return;
    }

    try {
        $conn = getDBConnection();
        $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ? AND active = 1");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            // Successful login
            session_regenerate_id(true);
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['login_time'] = time();
            $_SESSION['last_activity'] = time();

            // Update last login time
            $updateStmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
            $updateStmt->execute([$user['id']]);

            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
}

// Handle Logout
function handleLogout() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        return;
    }

    // Destroy session
    $_SESSION = array();
    
    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time() - 3600, '/');
    }
    
    session_destroy();

    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
}

// Handle Check Session
function handleCheckSession() {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        return;
    }

    if (isset($_SESSION['user_id']) && isset($_SESSION['login_time'])) {
        $currentTime = time();
        $loginTime = $_SESSION['login_time'];

        // Check if session has expired (24 hours)
        if (($currentTime - $loginTime) > SESSION_LIFETIME) {
            // Session expired
            session_destroy();
            echo json_encode([
                'success' => false,
                'authenticated' => false,
                'message' => 'Session expired'
            ]);
            return;
        }

        // Update last activity
        $_SESSION['last_activity'] = $currentTime;

        echo json_encode([
            'success' => true,
            'authenticated' => true,
            'user' => [
                'id' => $_SESSION['user_id'],
                'username' => $_SESSION['username']
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'authenticated' => false,
            'message' => 'Not authenticated'
        ]);
    }
}

// Handle Update Credentials
function handleUpdateCredentials() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        return;
    }

    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $oldPassword = $data['oldPassword'] ?? '';
    $newUsername = $data['newUsername'] ?? '';
    $newPassword = $data['newPassword'] ?? '';

    if (empty($oldPassword)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Old password required']);
        return;
    }

    try {
        $conn = getDBConnection();
        
        // Verify old password
        $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($oldPassword, $user['password'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid old password']);
            return;
        }

        // Update credentials
        $updates = [];
        $params = [];

        if (!empty($newUsername)) {
            $updates[] = "username = ?";
            $params[] = $newUsername;
        }

        if (!empty($newPassword)) {
            $updates[] = "password = ?";
            $params[] = password_hash($newPassword, PASSWORD_DEFAULT);
        }

        if (empty($updates)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'No updates provided']);
            return;
        }

        $params[] = $_SESSION['user_id'];
        $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
        
        $updateStmt = $conn->prepare($sql);
        $updateStmt->execute($params);

        // Update session if username changed
        if (!empty($newUsername)) {
            $_SESSION['username'] = $newUsername;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Credentials updated successfully'
        ]);
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
}
?>
