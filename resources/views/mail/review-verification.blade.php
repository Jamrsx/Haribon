<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Review - Haribon Real Estate</title>
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
        .logo img {
            height: 40px;
            width: auto;
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
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .verify-button {
            display: inline-block;
            background: #10b981;
            color: white;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: background-color 0.2s;
        }
        .verify-button:hover {
            background: #059669;
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
        .review-details {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #10b981;
        }
        .rating {
            color: #f59e0b;
            font-size: 18px;
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
                <div style="font-size: 28px; font-weight: bold; color: white;">HARIBON</div>
            </div>
            <p class="tagline">Trusted Real Estate Platform</p>
        </div>
        
        <div class="content">
            <h1 class="title">Verify Your Review</h1>
            
            <p class="message">
                Thank you for taking the time to share your experience! Your feedback helps other buyers make informed decisions and supports our community of trusted sellers.
            </p>
            
            @if($review->property)
            <div class="review-details">
                <h3 style="margin: 0 0 10px 0; color: #1e293b;">Review Details:</h3>
                <p style="margin: 5px 0;"><strong>Property:</strong> {{ $review->property->title }}</p>
                <p style="margin: 5px 0;"><strong>Rating:</strong> <span class="rating">{{ str_repeat('★', $review->rating) }}{{ str_repeat('☆', 5 - $review->rating) }}</span></p>
                @if($review->comment)
                <p style="margin: 5px 0;"><strong>Comment:</strong> "{{ $review->comment }}"</p>
                @endif
            </div>
            @endif
            
            <div class="button-container">
                <a href="{{ $verificationUrl }}" class="verify-button">
                    Verify My Review
                </a>
            </div>
            
            <p class="message" style="text-align: center; margin-top: 30px;">
                <strong>Important:</strong> This verification link will expire in 48 hours for security purposes.
            </p>
            
            <div class="divider"></div>
            
            <p class="security-note">
                If you didn't write this review, please ignore this email. Someone may have entered your email address by mistake. 
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
