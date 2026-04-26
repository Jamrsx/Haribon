<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Luigel\Paymongo\Facades\Paymongo;

class WebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->all();
        $event = $payload['data']['attributes']['type'] ?? null;

        if (!$event) {
            return response()->json(['message' => 'No event type'], 400);
        }

        Log::info('PayMongo Webhook received', ['event' => $event]);

        switch ($event) {
            case 'checkout_session.payment.paid':
            case 'payment.paid':
                $this->handlePaymentPaid($payload);
                break;

            case 'payment.failed':
                $this->handlePaymentFailed($payload);
                break;

            default:
                Log::info('Unhandled webhook event', ['event' => $event]);
        }

        return response()->json(['message' => 'Webhook handled']);
    }

    protected function handlePaymentPaid(array $payload)
    {
        $data = $payload['data']['attributes']['data'] ?? $payload['data']['attributes'];
        $metadata = $data['attributes']['metadata'] ?? [];

        $subscriptionId = $metadata['subscription_id'] ?? null;
        $userId = $metadata['user_id'] ?? null;

        if (!$subscriptionId || !$userId) {
            Log::error('Missing metadata in payment webhook', ['payload' => $payload]);
            return;
        }

        $subscription = Subscription::find($subscriptionId);
        if (!$subscription) {
            Log::error('Subscription not found', ['subscription_id' => $subscriptionId]);
            return;
        }

        // Mark all other active subscriptions for this user as inactive
        Subscription::where('user_id', $userId)
            ->where('status', 'active')
            ->where('id', '!=', $subscription->id)
            ->update(['status' => 'inactive']);

        // Activate subscription
        $subscription->update([
            'status' => 'active',
        ]);

        // Create payment record
        $payment = Payment::create([
            'user_id' => $userId,
            'subscription_id' => $subscriptionId,
            'provider' => $data['attributes']['source']['type'] ?? 'paymongo',
            'amount' => $data['attributes']['amount'] / 100,
            'status' => 'paid',
            'reference_number' => $data['id'] ?? null,
        ]);

        Log::info('Payment processed successfully', [
            'payment_id' => $payment->id,
            'subscription_id' => $subscriptionId,
        ]);
    }

    protected function handlePaymentFailed(array $payload)
    {
        $data = $payload['data']['attributes']['data'] ?? $payload['data']['attributes'];
        $metadata = $data['attributes']['metadata'] ?? [];

        $subscriptionId = $metadata['subscription_id'] ?? null;
        $userId = $metadata['user_id'] ?? null;

        if (!$subscriptionId || !$userId) {
            Log::error('Missing metadata in failed payment webhook', ['payload' => $payload]);
            return;
        }

        $subscription = Subscription::find($subscriptionId);
        if (!$subscription) {
            Log::error('Subscription not found for failed payment', ['subscription_id' => $subscriptionId]);
            return;
        }

        // Mark subscription as failed/cancelled
        $subscription->update([
            'status' => 'failed',
        ]);

        // Create failed payment record
        Payment::create([
            'user_id' => $userId,
            'subscription_id' => $subscriptionId,
            'provider' => $data['attributes']['source']['type'] ?? 'paymongo',
            'amount' => $data['attributes']['amount'] / 100,
            'status' => 'failed',
            'reference_number' => $data['id'] ?? null,
        ]);

        Log::info('Payment failed recorded', [
            'subscription_id' => $subscriptionId,
        ]);
    }
}
