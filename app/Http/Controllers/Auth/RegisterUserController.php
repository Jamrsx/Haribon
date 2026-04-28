<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\EmailVerificationMail;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class RegisterUserController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:30', 'unique:users,phone'],
            'password' => ['required', 'string', 'confirmed', 'min:8'],
            'role' => ['required', 'in:seller,buyer'],
        ]);

        $user = DB::transaction(function () use ($validated): User {
            $role = Role::firstOrCreate(['name' => $validated['role']]);

            // Generate verification token
            $verificationToken = Str::random(64);
            $expiresAt = now()->addHours(24);

            $newUser = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'password' => $validated['password'],
                'email_verification_token' => $verificationToken,
                'email_verification_expires_at' => $expiresAt,
            ]);

            $newUser->roles()->syncWithoutDetaching([$role->id]);

            // Send verification email
            Mail::to($newUser->email)->send(new EmailVerificationMail($newUser, $verificationToken));

            return $newUser;
        });

        return redirect()
            ->route('email.verification')
            ->with('success', 'Registration successful! Please check your email for the verification code.');
    }
}
