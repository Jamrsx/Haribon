<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$plans = \App\Models\Plan::all();
echo "Total plans: " . $plans->count() . "\n";
foreach ($plans as $plan) {
    echo "ID: {$plan->id}, Name: {$plan->name}, Price: {$plan->price}\n";
}
