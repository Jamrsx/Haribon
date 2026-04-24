<?php

use App\Http\Controllers\Auth\LoginUserController;
use App\Http\Controllers\Auth\LogoutUserController;
use App\Http\Controllers\Auth\RegisterUserController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Public/HomePage');
});

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

Route::get('/seller/dashboard', function () {
    return Inertia::render('Seller/SellerDashboardPage');
})->middleware('seller')->name('seller.dashboard');

Route::get('/seller/properties', function () {
    return Inertia::render('Seller/PropertyListPage');
})->middleware('seller')->name('seller.properties.index');

Route::get('/seller/properties/create', function () {
    return Inertia::render('Seller/CreatePropertyPage');
})->middleware('seller')->name('seller.properties.create');

Route::get('/seller/properties/{property}/edit', function () {
    return Inertia::render('Seller/EditPropertyPage');
})->middleware('seller')->name('seller.properties.edit');

Route::get('/seller/subscription', function () {
    return Inertia::render('Seller/SubscriptionOverviewPage');
})->middleware('seller')->name('seller.subscription.overview');

Route::get('/seller/subscription/plans', function () {
    return Inertia::render('Seller/SubscriptionPlansPage');
})->middleware('seller')->name('seller.subscription.plans');

Route::get('/seller/subscription/success', function () {
    return Inertia::render('Seller/SubscriptionSuccessPage');
})->middleware('seller')->name('seller.subscription.success');

Route::get('/buyer/favorites', function () {
    return Inertia::render('Buyer/FavoritePropertiesPage');
})->middleware('auth')->name('buyer.favorites');
