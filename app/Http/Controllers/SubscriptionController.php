<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $plans = Plan::where('price', '>', 0)->get();
        
        // Get user's active subscription plan ID
        $activeSubscription = $user->subscriptions()
            ->where('status', 'active')
            ->with('plan')
            ->latest()
            ->first();
        
        $activePlanId = $activeSubscription ? $activeSubscription->plan_id : null;
        
        return Inertia::render('Seller/SubscriptionPlansPage', [
            'plans' => $plans,
            'active_plan_id' => $activePlanId,
        ]);
    }

    public function overview()
    {
        $user = Auth::user();
        
        // Get user's latest ACTIVE subscription (free or paid)
        $activeSubscription = $user->subscriptions()
            ->where('status', 'active')
            ->with('plan')
            ->latest()
            ->first();

        $paymentHistory = $user->payments()
            ->with('subscription.plan')
            ->latest()
            ->get();

        return Inertia::render('Seller/SubscriptionOverviewPage', [
            'activeSubscription' => $activeSubscription,
            'paymentHistory' => $paymentHistory,
        ]);
    }

    public function activateSubscription(Request $request)
    {
        $subscription = Subscription::where('user_id', Auth::id())
            ->where('status', 'pending')
            ->latest()
            ->first();

        if ($subscription) {
            $subscription->update(['status' => 'active']);

            Payment::create([
                'user_id' => Auth::id(),
                'subscription_id' => $subscription->id,
                'provider' => 'qrph',
                'amount' => $subscription->plan->price,
                'status' => 'paid',
                'reference_number' => 'manual_activation',
            ]);

            return redirect()->route('seller.subscription.overview')->with('success', 'Subscription activated successfully');
        }

        return redirect()->route('seller.subscription.overview')->with('error', 'No pending subscription found');
    }
}
