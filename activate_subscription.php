<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Find the latest pending subscription for user 1
$subscription = \App\Models\Subscription::where('user_id', 1)
    ->where('status', 'pending')
    ->latest()
    ->first();

if ($subscription) {
    $subscription->status = 'active';
    $subscription->save();
    
    // Create payment record
    \App\Models\Payment::create([
        'user_id' => 1,
        'subscription_id' => $subscription->id,
        'provider' => 'qrph',
        'amount' => 20.00,
        'status' => 'paid',
        'reference_number' => 'pay_AziT8idyP4Z14BJM3EBksDU5',
    ]);
    
    echo "Subscription ID {$subscription->id} activated for user 1\n";
    echo "Payment record created\n";
} else {
    echo "No pending subscription found for user 1\n";
}
