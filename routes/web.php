<?php

use App\Http\Controllers\Auth\RegisterUserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Public/HomePage');
});

Route::get('/register', function () {
    return Inertia::render('Auth/RegisterPage');
})->name('register');

Route::post('/register', RegisterUserController::class);
