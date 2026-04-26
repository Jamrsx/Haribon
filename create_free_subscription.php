<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Starting...\n";

$user = \App\Models\User::find(1);
if (!$user) {
    echo "User 1 not found\n";
    exit(1);
}
echo "User 1 found\n";

$freePlan = \App\Models\Plan::where('price', 0)->first();
if (!$freePlan) {
    echo "Free plan not found\n";
    exit(1);
}
echo "Free plan found: ID {$freePlan->id}\n";

// Check if user already has a subscription
$existing = \App\Models\Subscription::where('user_id', 1)->first();
if ($existing) {
    echo "User 1 already has subscription ID {$existing->id}\n";
    exit(0);
}

$subscription = \App\Models\Subscription::create([
    'user_id' => $user->id,
    'plan_id' => $freePlan->id,
    'started_at' => now(),
    'ended_at' => null,
    'status' => 'active',
]);

echo "Created free plan subscription ID {$subscription->id} for user 1\n";
