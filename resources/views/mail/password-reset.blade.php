<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background-color: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 32px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #047857;
            margin-bottom: 8px;
        }
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
        }
        .content {
            margin-bottom: 32px;
        }
        .button {
            display: inline-block;
            background-color: #047857;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin: 24px 0;
        }
        .button:hover {
            background-color: #065f46;
        }
        .footer {
            text-align: center;
            color: #64748b;
            font-size: 14px;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e2e8f0;
        }
        .warning {
            background-color: #fef3c7;
            border: 1px solid #fbbf24;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
            color: #92400e;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Haribon</div>
            <h1 class="title">Reset Your Password</h1>
        </div>

        <div class="content">
            <p>Hi {{ $userName }},</p>
            
            <p>We received a request to reset your password for your Haribon account. Click the button below to set a new password:</p>

            <div style="text-align: center;">
                <a href="{{ $resetUrl }}" class="button">Reset Password</a>
            </div>

            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #047857;">{{ $resetUrl }}</p>

            <div class="warning">
                <strong>Important:</strong> This link will expire in 1 hour for security reasons. If you didn't request this password reset, please ignore this email.
            </div>
        </div>

        <div class="footer">
            <p>Haribon Real Estate Marketplace</p>
            <p style="font-size: 12px; margin-top: 8px;">
                If you're having trouble clicking the reset button, copy and paste the URL into your web browser.
            </p>
        </div>
    </div>
</body>
</html>
