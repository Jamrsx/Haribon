<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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

            $newUser = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'password' => $validated['password'],
            ]);

            $newUser->roles()->syncWithoutDetaching([$role->id]);

            return $newUser;
        });

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()
            ->route('register')
            ->with('success', 'Registration successful. Your account has been created.');
    }
}
