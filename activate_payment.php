<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Activate subscription 6
$subscription = \App\Models\Subscription::find(6);
if ($subscription) {
    $subscription->update(['status' => 'active']);
    echo "Subscription 6 activated\n";
} else {
    echo "Subscription 6 not found\n";
    exit(1);
}

// Mark old subscriptions as inactive
\App\Models\Subscription::where('user_id', 3)
    ->where('status', 'active')
    ->where('id', '!=', 6)
    ->update(['status' => 'inactive']);
echo "Old subscriptions marked as inactive\n";

// Create payment record
\App\Models\Payment::create([
    'user_id' => 3,
    'subscription_id' => 6,
    'provider' => 'qrph',
    'amount' => 5.00,
    'status' => 'paid',
    'reference_number' => 'pay_JvWdprfJYdaq6DWwsKtLeZ87',
]);
echo "Payment recorded\n";

echo "Done\n";
