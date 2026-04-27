<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#[Signature('app:expire-subscriptions')]
#[Description('Expire subscriptions that have passed their end date')]
class ExpireSubscriptions extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $expiredCount = DB::table('subscription')
            ->where('status', 'active')
            ->where('ended_at', '<', now())
            ->update(['status' => 'expired']);

        if ($expiredCount > 0) {
            $this->info("Expired {$expiredCount} subscription(s).");
        } else {
            $this->info('No subscriptions to expire.');
        }

        return self::SUCCESS;
    }
}
