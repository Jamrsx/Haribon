<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->all();
        $event = data_get($payload, 'data.attributes.type') ?? data_get($payload, 'data.type');

        if (! $event) {
            Log::warning('PayMongo webhook missing event type', [
                'payload' => $payload,
            ]);

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
        $data = data_get($payload, 'data.attributes.data') ?? data_get($payload, 'data.attributes', []);
        $attributes = $data['attributes'] ?? [];
        $metadata = $attributes['metadata'] ?? [];
        $amount = ((int) (data_get($attributes, 'amount') ?? data_get($attributes, 'payments.0.attributes.amount', 0))) / 100;
        $referenceNumber = data_get($metadata, 'pm_reference_number')
            ?? data_get($attributes, 'reference_number')
            ?? data_get($attributes, 'external_reference_number');

        $subscriptionId = $metadata['subscription_id'] ?? null;
        $userId = $metadata['user_id'] ?? null;

        if (! $subscriptionId || ! $userId) {
            $pendingPaymentQuery = Payment::query()->where('status', 'pending');

            if ($referenceNumber) {
                $pendingPaymentQuery->where('reference_number', $referenceNumber);
            }

            if ($amount > 0) {
                $pendingPaymentQuery->where('amount', number_format($amount, 2, '.', ''));
            }

            $pendingPayment = $pendingPaymentQuery->latest()->first();

            if ($pendingPayment) {
                $subscriptionId = $pendingPayment->subscription_id;
                $userId = $pendingPayment->user_id;
            }
        }

        if (! $subscriptionId || ! $userId) {
            $existingPaidPayment = Payment::query()
                ->where('status', 'paid')
                ->when($referenceNumber, fn ($query) => $query->where('reference_number', $referenceNumber))
                ->when($amount > 0, fn ($query) => $query->where('amount', number_format($amount, 2, '.', '')))
                ->latest()
                ->first();

            if ($existingPaidPayment) {
                Log::info('Skipping duplicate paid webhook event already processed', [
                    'reference_number' => $referenceNumber,
                    'payment_id' => $existingPaidPayment->id,
                ]);

                return;
            }

            Log::warning('Unable to resolve subscription from payment webhook', [
                'reference_number' => $referenceNumber,
                'amount' => $amount,
                'payload' => $payload,
            ]);

            return;
        }

        $subscription = Subscription::find($subscriptionId);
        if (! $subscription) {
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
        $payment = Payment::updateOrCreate(
            [
                'user_id' => $userId,
                'subscription_id' => $subscriptionId,
            ],
            [
                'provider' => data_get($attributes, 'source.type', 'paymongo'),
                'amount' => $amount,
                'status' => 'paid',
                'reference_number' => $referenceNumber ?? $data['id'] ?? null,
            ]
        );

        Log::info('Payment processed successfully', [
            'payment_id' => $payment->id,
            'subscription_id' => $subscriptionId,
        ]);
    }

    protected function handlePaymentFailed(array $payload)
    {
        $data = data_get($payload, 'data.attributes.data') ?? data_get($payload, 'data.attributes', []);
        $attributes = $data['attributes'] ?? [];
        $metadata = $attributes['metadata'] ?? [];
        $amount = ((int) (data_get($attributes, 'amount') ?? data_get($attributes, 'payments.0.attributes.amount', 0))) / 100;
        $referenceNumber = data_get($metadata, 'pm_reference_number')
            ?? data_get($attributes, 'reference_number')
            ?? data_get($attributes, 'external_reference_number');

        $subscriptionId = $metadata['subscription_id'] ?? null;
        $userId = $metadata['user_id'] ?? null;

        if (! $subscriptionId || ! $userId) {
            $pendingPayment = Payment::query()
                ->where('status', 'pending')
                ->when($referenceNumber, fn ($query) => $query->where('reference_number', $referenceNumber))
                ->when($amount > 0, fn ($query) => $query->where('amount', number_format($amount, 2, '.', '')))
                ->latest()
                ->first();

            if ($pendingPayment) {
                $subscriptionId = $pendingPayment->subscription_id;
                $userId = $pendingPayment->user_id;
            }
        }

        if (! $subscriptionId || ! $userId) {
            $existingFailedPayment = Payment::query()
                ->where('status', 'failed')
                ->when($referenceNumber, fn ($query) => $query->where('reference_number', $referenceNumber))
                ->when($amount > 0, fn ($query) => $query->where('amount', number_format($amount, 2, '.', '')))
                ->latest()
                ->first();

            if ($existingFailedPayment) {
                Log::info('Skipping duplicate failed webhook event already processed', [
                    'reference_number' => $referenceNumber,
                    'payment_id' => $existingFailedPayment->id,
                ]);

                return;
            }

            Log::warning('Unable to resolve subscription from failed payment webhook', [
                'reference_number' => $referenceNumber,
                'amount' => $amount,
                'payload' => $payload,
            ]);

            return;
        }

        $subscription = Subscription::find($subscriptionId);
        if (! $subscription) {
            Log::error('Subscription not found for failed payment', ['subscription_id' => $subscriptionId]);

            return;
        }

        // Mark subscription as failed/cancelled
        $subscription->update([
            'status' => 'failed',
        ]);

        // Create failed payment record
        Payment::updateOrCreate(
            [
                'user_id' => $userId,
                'subscription_id' => $subscriptionId,
            ],
            [
                'provider' => data_get($attributes, 'source.type', 'paymongo'),
                'amount' => $amount,
                'status' => 'failed',
                'reference_number' => $referenceNumber ?? $data['id'] ?? null,
            ]
        );

        Log::info('Payment failed recorded', [
            'subscription_id' => $subscriptionId,
        ]);
    }
}
