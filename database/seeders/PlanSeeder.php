<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Plan::create([
            'name' => 'Free',
            'price' => 0.00,
            'duration_days' => 0,
            'max_listing' => 1,
            'max_images' => 5,
        ]);

        Plan::create([
            'name' => '6 Months',
            'price' => 5.00,
            'duration_days' => 180,
            'max_listing' => 10,
            'max_images' => 20,
        ]);

        Plan::create([
            'name' => '1 Year',
            'price' => 50.00,
            'duration_days' => 365,
            'max_listing' => 20,
            'max_images' => 999,
        ]);

         Plan::create([
            'name' => 'Lifetime',
            'price' => 1699.00,
            'duration_days' => 0,
            'max_listing' => 999999,
            'max_images' => 999999,
        ]);

        
    }
}
