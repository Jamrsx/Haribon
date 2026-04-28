<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginUserController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => 'The provided credentials are incorrect.',
            ]);
        }

        $request->session()->regenerate();

        $user = $request->user()->load('roles');
        $isSeller = $user->roles->contains('name', 'seller');

        // Check if seller's email is verified
        if ($isSeller && !$user->email_verified_at) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            
            throw ValidationException::withMessages([
                'email' => 'Please verify your email address before logging in. Check your inbox for the verification email.',
            ]);
        }

        if ($isSeller) {
            return redirect()->route('seller.dashboard')->with('loginSuccess', $user->name);
        }

        return redirect()->route('buyer.favorites')->with('loginSuccess', $user->name);
    }
}
