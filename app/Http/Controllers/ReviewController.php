<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ReviewController extends Controller
{
    public function store(Request $request, Property $property)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $seller = $property->user;

        $existingReview = Review::where('email', $validated['email'])
            ->where('seller_id', $seller->id)
            ->where('property_id', $property->id)
            ->first();

        if ($existingReview) {
            return back()->with('error', 'You have already reviewed this property.');
        }

        $verificationToken = Str::random(64);

        $review = Review::create([
            'seller_id' => $seller->id,
            'property_id' => $property->id,
            'email' => $validated['email'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
            'verified' => false,
            'verification_token' => $verificationToken,
        ]);

        $verificationUrl = route('reviews.verify', $verificationToken);

        Mail::raw(
            "Thank you for your review!\n\nPlease click the link below to verify your review:\n{$verificationUrl}\n\nThis link will expire in 48 hours.",
            function ($message) use ($validated) {
                $message->to($validated['email'])
                    ->subject('Verify Your Review - Haribon Real Estate');
            }
        );

        return back()->with('success', 'Review submitted! Please check your email to verify.');
    }

    public function verify(string $token)
    {
        $review = Review::where('verification_token', $token)->first();

        if (!$review) {
            return redirect()->route('home')->with('error', 'Invalid verification link.');
        }

        if ($review->verified) {
            return redirect()->route('home')->with('info', 'Review already verified.');
        }

        $review->update([
            'verified' => true,
            'verified_at' => now(),
            'verification_token' => null,
        ]);

        return redirect()->route('home')->with('success', 'Review verified successfully!');
    }

    public function index(User $seller)
    {
        $reviews = $seller->reviews()->where('verified', true)->latest()->get();

        return response()->json($reviews);
    }
}
