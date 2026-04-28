<?php

namespace App\Http\Controllers;

use App\Mail\EmailVerificationMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class EmailVerificationController extends Controller
{
    /**
     * Show the email verification waiting page.
     */
    public function show()
    {
        return inertia('Auth/VerifyEmailPage');
    }

    /**
     * Send verification email.
     */
    public function send(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        // Generate verification token
        $token = Str::random(64); // Secure token for link
        $expiresAt = now()->addHours(24); // Token expires in 24 hours

        $user->update([
            'email_verification_token' => $token,
            'email_verification_expires_at' => $expiresAt,
        ]);

        // Send verification email
        Mail::to($user->email)->send(new EmailVerificationMail($user, $token));

        return back()->with('success', 'Verification email sent. Please check your inbox and click the verification link.');
    }

    /**
     * Verify the email with the provided token.
     */
    public function verify($token)
    {
        $user = User::where('email_verification_token', $token)
            ->where('email_verification_expires_at', '>', now())
            ->first();

        if (!$user) {
            return redirect()->route('login')->with('error', 'Invalid or expired verification link.');
        }

        // Mark email as verified
        $user->update([
            'email_verified_at' => now(),
            'email_verification_token' => null,
            'email_verification_expires_at' => null,
        ]);

        return redirect()->route('login')->with('success', 'Email verified successfully! You can now log in.');
    }

    /**
     * Resend verification email.
     */
    public function resend(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->email_verified_at) {
            return back()->with('info', 'This email is already verified.');
        }

        // Generate new verification token
        $token = Str::random(64);
        $expiresAt = now()->addHours(24);

        $user->update([
            'email_verification_token' => $token,
            'email_verification_expires_at' => $expiresAt,
        ]);

        // Send verification email
        Mail::to($user->email)->send(new EmailVerificationMail($user, $token));

        return back()->with('success', 'New verification email sent. Please check your inbox.');
    }
}
