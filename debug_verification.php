<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('email', 'jamesbaron0202@gmail.com')->first();

echo "Email: " . $user->email . "\n";
echo "Email Verified At: " . ($user->email_verified_at ? $user->email_verified_at->format('Y-m-d H:i:s') : 'NULL') . "\n";
echo "Verification Token: " . ($user->email_verification_token ?: 'NULL') . "\n";
echo "Expires At: " . ($user->email_verification_expires_at ? $user->email_verification_expires_at->format('Y-m-d H:i:s') : 'NULL') . "\n";
