<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$count = \App\Models\Property::where('user_id', 1)->count();
echo "Property count for user 1: {$count}\n";

$properties = \App\Models\Property::where('user_id', 1)->get();
echo "Properties:\n";
foreach ($properties as $prop) {
    echo "  - ID: {$prop->id}, Title: {$prop->title}, Created: {$prop->created_at}\n";
}
