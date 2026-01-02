<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Page Not Found | Thesis Repository</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <style>
        :root {
            --primary: #0b3c5d;
            --secondary: #328cc1;
            --bg: #f4f6f8;
            --text: #333;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        body {
            min-height: 100vh;
            background: var(--bg);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .error-container {
            background: #fff;
            max-width: 480px;
            width: 90%;
            padding: 2.5rem 2rem;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .error-code {
            font-size: 5rem;
            font-weight: 800;
            color: var(--primary);
            line-height: 1;
            margin-bottom: 0.5rem;
        }

        .error-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text);
            margin-bottom: 0.75rem;
        }

        .error-message {
            font-size: 0.95rem;
            color: #666;
            margin-bottom: 2rem;
        }

        .home-btn {
            display: inline-block;
            padding: 0.75rem 1.75rem;
            background: var(--primary);
            color: #fff;
            text-decoration: none;
            border-radius: 999px;
            font-size: 0.95rem;
            font-weight: 500;
            transition: background 0.25s ease, transform 0.15s ease;
        }

        .home-btn:hover {
            background: var(--secondary);
            transform: translateY(-2px);
        }

        .home-btn:active {
            transform: translateY(0);
        }

        @media (max-width: 480px) {
            .error-code {
                font-size: 4rem;
            }
        }
    </style>
</head>

<body>
    <div class="error-container">
        <div class="error-code">404</div>
        <div class="error-title">Page Not Found</div>
        <p class="error-message">
            The page you’re looking for doesn’t exist or may have been moved.
            Don’t worry — you can safely return to the homepage.
        </p>

        <a href="<?php echo $BASE_URL; ?>" class="home-btn">
            Go to Homepage
        </a>
    </div>
</body>

</html>