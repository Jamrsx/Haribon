<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - Haribon Real Estate</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #334155;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 30px;
            text-align: center;
            border-radius: 12px 12px 0 0;
        }
        .logo {
            margin-bottom: 10px;
        }
        .logo div {
            font-size: 28px;
            font-weight: bold;
            color: white;
        }
        .tagline {
            color: #d1fae5;
            font-size: 16px;
            margin: 0;
        }
        .content {
            background: white;
            padding: 40px;
            border-radius: 0 0 12px 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 20px;
            text-align: center;
        }
        .message {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
            color: #475569;
        }
        .verification-button {
            text-align: center;
            margin: 30px 0;
        }
        .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            text-decoration: none;
            padding: 18px 40px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 18px;
            transition: all 0.3s ease;
            box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.25), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
            border: 2px solid transparent;
            position: relative;
            overflow: hidden;
        }
        .verify-button:hover {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.35), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            transform: translateY(-2px);
        }
        .verify-button:active {
            transform: translateY(0);
            box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.25), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
        }
        .instructions {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left: 4px solid #f59e0b;
            padding: 24px;
            margin: 30px 0;
            border-radius: 0 12px 12px 0;
            box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.1);
        }
        .instructions h3 {
            color: #92400e;
            margin: 0 0 12px 0;
            font-size: 16px;
            font-weight: 700;
        }
        .instructions p {
            color: #78350f;
            margin: 6px 0;
            font-size: 14px;
            line-height: 1.5;
        }
        .footer {
            text-align: center;
            padding: 30px;
            color: #64748b;
            font-size: 14px;
        }
        .divider {
            height: 1px;
            background: #e2e8f0;
            margin: 30px 0;
        }
        .security-note {
            font-size: 12px;
            color: #94a3b8;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <div>HARIBON</div>
            </div>
            <p class="tagline">Trusted Real Estate Platform</p>
        </div>
        
        <div class="content">
            <h1 class="title">Verify Your Email Address</h1>
            
            <p class="message">
                Welcome to Haribon Real Estate! To complete your registration and start listing properties, please verify your email address using the code below.
            </p>
            
            <div class="verification-button">
                <a href="{{ url('/email/verify/' . $verificationCode) }}" class="verify-button">
                    Verify Email Address
                </a>
            </div>
            
            <div class="instructions">
                <h3>How to Verify:</h3>
                <p>1. Click the "Verify Email Address" button above</p>
                <p>2. You'll be automatically redirected to complete verification</p>
                <p>3. Start listing your properties immediately!</p>
            </div>
            
            <p class="message" style="text-align: center; margin-top: 30px;">
                <strong>Important:</strong> This verification code will expire in 24 hours for security purposes.
            </p>
            
            <div class="divider"></div>
            
            <p class="security-note">
                If you didn't create an account with Haribon Real Estate, please ignore this email. Someone may have entered your email address by mistake. 
                If you have concerns about your account security, please contact our support team.
            </p>
        </div>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} Haribon Real Estate. All rights reserved.</p>
            <p style="margin-top: 10px;">
                Building trust in Philippine real estate
            </p>
        </div>
    </div>
</body>
</html>
