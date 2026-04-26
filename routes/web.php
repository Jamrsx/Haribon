<?php

use App\Http\Controllers\Auth\LoginUserController;
use App\Http\Controllers\Auth\LogoutUserController;
use App\Http\Controllers\Auth\RegisterUserController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [PropertyController::class, 'publicIndex'])->name('home');

Route::get('/properties/{property}', [PropertyController::class, 'show'])->name('properties.show');

Route::get('/register', function () {
    return Inertia::render('Auth/RegisterPage');
})->name('register');

Route::post('/register', RegisterUserController::class);

Route::get('/login', function () {
    return Inertia::render('Auth/LoginPage');
})->name('login');

Route::post('/login', LoginUserController::class);
Route::post('/logout', LogoutUserController::class)->name('logout');

Route::get('/unverified-access', function () {
    return Inertia::render('Auth/UnverifiedAccessPage');
})->name('unverified.access');

Route::get('/profile', [ProfileController::class, 'show'])->middleware('auth')->name('profile');
Route::patch('/profile', [ProfileController::class, 'updateInfo'])->middleware('auth')->name('profile.update');
Route::patch('/profile/password', [ProfileController::class, 'updatePassword'])->middleware('auth')->name('profile.password');

Route::get('/seller/dashboard', [PropertyController::class, 'dashboard'])
    ->middleware('seller')
    ->name('seller.dashboard');

Route::get('/seller/properties', [PropertyController::class, 'index'])
    ->middleware('seller')
    ->name('seller.properties.index');

Route::get('/seller/properties/create', [PropertyController::class, 'create'])
    ->middleware('seller')
    ->name('seller.properties.create');

Route::post('/seller/properties', [PropertyController::class, 'store'])
    ->middleware('seller')
    ->name('seller.properties.store');

Route::get('/seller/properties/{property}/edit', [PropertyController::class, 'edit'])
    ->middleware('seller')
    ->name('seller.properties.edit');

Route::put('/seller/properties/{property}', [PropertyController::class, 'update'])
    ->middleware('seller')
    ->name('seller.properties.update');

Route::delete('/seller/properties/{property}', [PropertyController::class, 'destroy'])
    ->middleware('seller')
    ->name('seller.properties.destroy');

Route::get('/seller/subscription', [SubscriptionController::class, 'overview'])
    ->middleware('seller')
    ->name('seller.subscription.overview');

Route::post('/seller/subscription/activate', [SubscriptionController::class, 'activateSubscription'])
    ->middleware('seller')
    ->name('seller.subscription.activate');

Route::get('/seller/subscription/plans', [SubscriptionController::class, 'index'])
    ->middleware('seller')
    ->name('seller.subscription.plans');

Route::post('/api/payment/checkout', [PaymentController::class, 'createCheckoutSession'])
    ->middleware('auth')
    ->name('payment.checkout');

Route::get('/seller/subscription/success', function () {
    return Inertia::render('Seller/SubscriptionSuccessPage');
})->middleware('seller')->name('seller.subscription.success');

Route::post('/api/paymongo/webhook', [WebhookController::class, 'handle'])
    ->name('paymongo.webhook');

Route::get('/buyer/favorites', function () {
    return Inertia::render('Buyer/FavoritePropertiesPage');
})->middleware('auth')->name('buyer.favorites');
