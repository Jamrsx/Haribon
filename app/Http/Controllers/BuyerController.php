<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class BuyerController extends Controller
{
    /**
     * Buyer landing page with stats and quick actions.
     */
    public function dashboard(Request $request): Response
    {
        $user = $request->user();

        $favoritesCount = $user->favorites()->count();
        $conversationsCount = Conversation::query()
            ->where('buyer_id', $user->id)
            ->count();
        $unreadCount = $user->unreadMessagesCount();

        $recentFavorites = $user->favorites()
            ->with(['images' => function ($q) {
                $q->orderBy('sort_order')->limit(1);
            }, 'location:property_id,address'])
            ->orderByDesc('property_favorites.created_at')
            ->limit(3)
            ->get();

        $recentConversations = Conversation::query()
            ->where('buyer_id', $user->id)
            ->with([
                'property:id,title,price_total,type',
                'property.images' => function ($q) {
                    $q->orderBy('sort_order')->limit(1);
                },
                'seller:id,name,profile_picture',
                'latestMessage',
            ])
            ->withCount(['messages as unread_count' => function ($q) use ($user) {
                $q->whereNull('read_at')->where('sender_id', '!=', $user->id);
            }])
            ->orderByDesc('last_message_at')
            ->orderByDesc('created_at')
            ->limit(3)
            ->get();

        Log::info('[Buyer] dashboard loaded', [
            'user_id' => $user->id,
            'favorites' => $favoritesCount,
            'conversations' => $conversationsCount,
            'unread' => $unreadCount,
        ]);

        return Inertia::render('Buyer/BuyerDashboardPage', [
            'stats' => [
                'favorites_count' => $favoritesCount,
                'conversations_count' => $conversationsCount,
                'unread_count' => $unreadCount,
            ],
            'recent_favorites' => $recentFavorites,
            'recent_conversations' => $recentConversations,
        ]);
    }

    /**
     * Browse all listings (list/grid view) inside the buyer dashboard.
     */
    public function properties(Request $request): Response
    {
        $user = $request->user();

        $query = Property::where('is_active', true)
            ->with(['images', 'location', 'user.subscription.plan'])
            ->with(['user' => function ($q) {
                $q->select('id', 'name', 'email', 'profile_picture', 'facebook_profile_link');
            }])
            ->orderByDesc('created_at');

        if ($request->filled('type') && in_array($request->type, ['sale', 'rent', 'lease'])) {
            $query->where('type', $request->type);
        }

        $properties = $query->paginate(12)->withQueryString();

        $favoriteIds = $user->favorites()->pluck('properties.id')->all();

        return Inertia::render('Buyer/BuyerBrowsePage', [
            'properties' => $properties,
            'favorite_ids' => $favoriteIds,
            'filters' => [
                'type' => $request->type ?? 'all',
            ],
        ]);
    }

    /**
     * Map view of all properties inside the buyer dashboard.
     */
    public function map(Request $request): Response
    {
        $user = $request->user();

        $query = Property::where('is_active', true)
            ->with([
                'images',
                'location',
                'user.subscription.plan',
                'user.reviews' => function ($q) {
                    $q->where('verified', true);
                },
            ])
            ->with(['user' => function ($q) {
                $q->select('id', 'name', 'email', 'profile_picture', 'facebook_profile_link');
            }])
            ->orderByDesc('created_at');

        if ($request->filled('lat') && $request->filled('lng') && $request->filled('radius_km')) {
            $lat = $request->lat;
            $lng = $request->lng;
            $radius = $request->radius_km;

            $query->whereHas('location', function ($q) use ($lat, $lng, $radius) {
                $q->whereRaw(
                    '(6371 * acos(cos(radians(?)) * cos(radians(location_lat)) * cos(radians(location_lng) - radians(?)) + sin(radians(?)) * sin(radians(location_lat)))) <= ?',
                    [$lat, $lng, $lat, $radius]
                );
            });
        }

        $properties = $query->get();

        $favoriteIds = $user->favorites()->pluck('properties.id')->all();

        return Inertia::render('Buyer/BuyerMapPage', [
            'properties' => $properties,
            'favorite_ids' => $favoriteIds,
        ]);
    }

    /**
     * Lists the buyer's saved (favorited) properties.
     */
    public function favorites(Request $request): Response
    {
        $user = $request->user();

        $favorites = $user->favorites()
            ->with([
                'images' => function ($q) {
                    $q->orderBy('sort_order');
                },
                'location',
                'user:id,name,profile_picture',
            ])
            ->orderByDesc('property_favorites.created_at')
            ->paginate(12)
            ->withQueryString();

        $favoriteIds = $user->favorites()->pluck('properties.id')->all();

        Log::info('[Buyer] favorites loaded', [
            'user_id' => $user->id,
            'count' => $favorites->total(),
        ]);

        return Inertia::render('Buyer/FavoritePropertiesPage', [
            'favorites' => $favorites,
            'favorite_ids' => $favoriteIds,
        ]);
    }
}
