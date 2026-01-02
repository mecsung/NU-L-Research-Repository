<?php
require_once __DIR__ . '/config/baseUrl.php';

/*
|--------------------------------------------------------------------------
| Basic Router (for thesis_repo)
|--------------------------------------------------------------------------
*/

$basePath = '/thesis_repo';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

/*
|--------------------------------------------------------------------------
| Normalize URI
|--------------------------------------------------------------------------
*/

// Strip base path
if (strpos($uri, $basePath) === 0) {
  $uri = substr($uri, strlen($basePath));
}

// Normalize trailing slash
$uri = rtrim($uri, '/') ?: '/';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

if ($method === 'GET') {
  switch ($uri) {

    case '/':
      require __DIR__ . '/view/pages/home.php';
      break;

    case '/sign-in':
      require __DIR__ . '/view/pages/sign-in.php';
      break;

    case '/create-account':
      require __DIR__ . '/view/pages/create-account.php';
      break;

    case '/search-result':
      require __DIR__ . '/controller/years-list.php';
      require __DIR__ . '/view/pages/search-result.php';
      break;

    case '/view-thesis':
      require __DIR__ . '/view/pages/view-thesis.php';
      break;

    case '/admin-panel':
      require __DIR__ . '/controller/years-list.php';
      require __DIR__ . '/view/pages/admin-panel.php';
      break;

    case '/view-account':
      require __DIR__ . '/view/pages/view-account.php';
      break;

    case '/logout':
      require __DIR__ . '/controller/authentication/logout.php';
      break;

    case '/program-views':
      require __DIR__ . '/view/pages/views-per-program.php';
      break;

    case '/accounts-list':
      require __DIR__ . '/view/pages/accounts-list.php';
      break;

    default:
      http_response_code(404);
      require __DIR__ . '/view/pages/404.php';
      break;
  }

  exit;
}

/*
|--------------------------------------------------------------------------
| Method Not Allowed / 404
|--------------------------------------------------------------------------
*/

http_response_code(404);
require __DIR__ . '/view/pages/404.php';
