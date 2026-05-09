<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FavoriteController extends Controller
{
    /**
     * Toggles a property in the current user's favorites list.
     * Returns JSON when the request expects it (heart-icon clicks),
     * otherwise redirects back with a flash message.
     */
    public function toggle(Request $request, Property $property): JsonResponse|RedirectResponse
    {
        $user = $request->user();

        $alreadyFavorited = $user->favorites()
            ->where('properties.id', $property->id)
            ->exists();

        // Allow removing favorites even if the property is no longer active,
        // but block adding new favorites for inactive listings.
        if (! $alreadyFavorited && ! $property->is_active) {
            abort(404);
        }

        if ($property->user_id === $user->id) {
            $message = 'You cannot favorite your own property.';

            if ($request->expectsJson()) {
                return response()->json(['error' => $message], 422);
            }

            return back()->with('error', $message);
        }

        if ($alreadyFavorited) {
            $user->favorites()->detach($property->id);
            $favorited = false;
            $message = 'Removed from your favorites.';
        } else {
            $user->favorites()->attach($property->id);
            $favorited = true;
            $message = 'Added to your favorites.';
        }

        Log::info('[Favorites] toggled', [
            'user_id' => $user->id,
            'property_id' => $property->id,
            'favorited' => $favorited,
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'favorited' => $favorited,
                'message' => $message,
                'favorites_count' => $user->favorites()->count(),
            ]);
        }

        return back()->with('success', $message);
    }
}
