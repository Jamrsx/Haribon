<?php

namespace Database\Seeders;

use App\Models\Review;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $comments = [
            'Excellent seller, very responsive and professional.',
            'Great experience, property was exactly as described.',
            'Smooth transaction, highly recommend this seller.',
            'Very helpful and accommodating throughout the process.',
            'Outstanding service, would definitely work with again.',
            'Good communication, fair pricing.',
            'Professional and trustworthy seller.',
            'Property was in great condition, seller was honest.',
            'Easy to work with, answered all my questions.',
            'Fantastic experience from start to finish.',
            'Seller was knowledgeable about the property.',
            'Quick responses and efficient process.',
            'Very satisfied with the entire transaction.',
            'Honest and transparent seller.',
            'Property exceeded my expectations.',
            'Seller went above and beyond.',
            'Professionalism at its best.',
            'Highly recommend this seller to anyone.',
            'Great value for money.',
            'Smooth and hassle-free experience.',
            'Seller was patient and understanding.',
            'Property was well-maintained.',
            'Excellent customer service.',
            'Trustworthy and reliable seller.',
            'Very pleased with the outcome.',
            'Seller made the process easy.',
            'Great property, even better seller.',
            'Professional and courteous.',
            'Would buy from this seller again.',
            'Exceptional service and support.',
            'Seller was very helpful and friendly.',
        ];

        $emails = [
            'buyer1@example.com',
            'buyer2@example.com',
            'buyer3@example.com',
            'buyer4@example.com',
            'buyer5@example.com',
            'buyer6@example.com',
            'buyer7@example.com',
            'buyer8@example.com',
            'buyer9@example.com',
            'buyer10@example.com',
            'buyer11@example.com',
            'buyer12@example.com',
            'buyer13@example.com',
            'buyer14@example.com',
            'buyer15@example.com',
            'buyer16@example.com',
            'buyer17@example.com',
            'buyer18@example.com',
            'buyer19@example.com',
            'buyer20@example.com',
            'buyer21@example.com',
            'buyer22@example.com',
            'buyer23@example.com',
            'buyer24@example.com',
            'buyer25@example.com',
            'buyer26@example.com',
            'buyer27@example.com',
            'buyer28@example.com',
            'buyer29@example.com',
            'buyer30@example.com',
        ];

        for ($i = 0; $i < 30; $i++) {
            Review::create([
                'seller_id' => 1,
                'property_id' => 1,
                'email' => $emails[$i],
                'rating' => rand(1, 5),
                'comment' => $comments[$i],
                'verified' => true,
                'verified_at' => now(),
            ]);
        }
    }
}
