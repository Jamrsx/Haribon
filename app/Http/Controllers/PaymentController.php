<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function createCheckoutSession(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
        ]);

        $plan = Plan::findOrFail($request->plan_id);
        $user = Auth::user();

        \Log::info('Creating subscription', [
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'plan_name' => $plan->name,
            'plan_price' => $plan->price,
        ]);

        // Create pending subscription
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'started_at' => now(),
            'ended_at' => $plan->duration_days > 0 ? now()->addDays($plan->duration_days) : now()->addYears(100),
            'status' => 'pending',
        ]);

        \Log::info('Subscription created', [
            'subscription_id' => $subscription->id,
            'status' => $subscription->status,
        ]);

        try {
            // Create PayMongo payment link using HTTP client
            $secretKey = config('services.paymongo.secret_key');
            if (! $secretKey) {
                throw new \Exception('PAYMONGO_SECRET_KEY is not configured.');
            }

            $response = \Http::withHeaders([
                'Authorization' => 'Basic '.base64_encode($secretKey.':'),
                'Content-Type' => 'application/json',
            ])->post('https://api.paymongo.com/v1/links', [
                'data' => [
                    'attributes' => [
                        'amount' => (int) ($plan->price * 100),
                        'currency' => 'PHP',
                        'description' => $plan->name.' Subscription',
                        'name' => $plan->name.' Subscription',
                        'remarks' => 'Subscription for user '.$user->id,
                        'metadata' => [
                            'subscription_id' => (string) $subscription->id,
                            'user_id' => (string) $user->id,
                            'plan_id' => (string) $plan->id,
                        ],
                        'success_url' => route('seller.subscription.success'),
                        'cancel_url' => route('seller.subscription.plans'),
                        'type' => 'single',
                    ],
                ],
            ]);

            if (! $response->successful()) {
                \Log::error('PayMongo API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                throw new \Exception('PayMongo API error: '.$response->body());
            }

            $checkoutUrl = $response->json('data.attributes.checkout_url');
            $linkId = $response->json('data.id');
            $referenceNumber = $response->json('data.attributes.reference_number');

            if (! $checkoutUrl) {
                throw new \Exception('No checkout URL returned from PayMongo');
            }

            Payment::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'subscription_id' => $subscription->id,
                ],
                [
                    'provider' => 'paymongo',
                    'amount' => $plan->price,
                    'status' => 'pending',
                    'reference_number' => $referenceNumber ?? $linkId ?? 'pending_link',
                ]
            );

            return response()->json([
                'checkout_url' => $checkoutUrl,
            ]);
        } catch (\Exception $e) {
            \Log::error('PayMongo checkout error: '.$e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'Failed to create checkout session: '.$e->getMessage(),
            ], 500);
        }
    }
}
