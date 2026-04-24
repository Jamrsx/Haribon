<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSellerAccess
{
    public function handle(Request $request, Closure $next): Response|RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            return redirect()
                ->route('unverified.access')
                ->with('error', 'Forbidden Access');
        }

        $isSeller = $user->roles()->where('name', 'seller')->exists();

        if (! $isSeller) {
            return redirect()
                ->route('unverified.access')
                ->with('error', 'Forbidden Access');
        }

        return $next($request);
    }
}
