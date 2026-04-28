<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\PasswordResetMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ForgotPasswordController extends Controller
{
    /**
     * Show the forgot password form.
     */
    public function show()
    {
        return inertia('Auth/ForgotPasswordPage');
    }

    /**
     * Send password reset link.
     */
    public function send(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        // Generate password reset token
        $token = Str::random(64);
        $expiresAt = now()->addHours(1); // Token expires in 1 hour

        $user->update([
            'password_reset_token' => $token,
            'password_reset_expires_at' => $expiresAt,
        ]);

        // Send password reset email
        Mail::to($user->email)->send(new PasswordResetMail($user, $token));

        return back()->with('success', 'Password reset link sent. Please check your inbox and click the reset link.');
    }
}
