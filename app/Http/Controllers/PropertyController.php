<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyLocation;
use App\Models\PropertyGeometry;
use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PropertyController extends Controller
{
    public function create()
    {
        return inertia('Seller/CreatePropertyPage');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'contact' => 'nullable|string|max:255',
            'lot_area_sqm' => 'nullable|numeric|min:0',
            'price_total' => 'required|numeric|min:0',
            'price_per_sqm' => 'required|numeric|min:0',
            'location_lat' => 'nullable|numeric|between:-90,90',
            'location_lng' => 'nullable|numeric|between:-180,180',
            'address' => 'nullable|string|max:500',
            'images' => 'nullable|array|max:10',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $property = Property::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'contact' => $validated['contact'],
            'lot_area_sqm' => $validated['lot_area_sqm'],
            'price_total' => $validated['price_total'],
            'price_per_sqm' => $validated['price_per_sqm'],
            'is_active' => true,
        ]);

        PropertyLocation::create([
            'property_id' => $property->id,
            'location_lat' => $validated['location_lat'],
            'location_lng' => $validated['location_lng'],
            'address' => $validated['address'],
        ]);

        PropertyGeometry::create([
            'property_id' => $property->id,
            'lot_polygon' => null,
            'lot_area_sqm' => $validated['lot_area_sqm'],
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('properties', 'public');
                PropertyImage::create([
                    'property_id' => $property->id,
                    'image_path' => $path,
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()->route('seller.properties.index')->with('success', 'Property created successfully.');
    }

    public function index(Request $request)
    {
        $properties = Property::where('user_id', $request->user()->id)
            ->with('images')
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('Seller/PropertyListPage', [
            'properties' => $properties,
        ]);
    }

    public function edit(Request $request, Property $property)
    {
        if ($property->user_id !== $request->user()->id) {
            abort(403);
        }

        $property->load('images', 'location');

        return inertia('Seller/EditPropertyPage', [
            'property' => $property,
        ]);
    }

    public function update(Request $request, Property $property)
    {
        if ($property->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'contact' => 'nullable|string|max:255',
            'lot_area_sqm' => 'nullable|numeric|min:0',
            'price_total' => 'required|numeric|min:0',
            'price_per_sqm' => 'required|numeric|min:0',
            'location_lat' => 'nullable|numeric|between:-90,90',
            'location_lng' => 'nullable|numeric|between:-180,180',
            'address' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'images' => 'nullable|array|max:10',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120',
            'delete_images' => 'nullable|array',
            'delete_images.*' => 'integer',
        ]);

        $property->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'contact' => $validated['contact'],
            'lot_area_sqm' => $validated['lot_area_sqm'],
            'price_total' => $validated['price_total'],
            'price_per_sqm' => $validated['price_per_sqm'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $property->location->update([
            'location_lat' => $validated['location_lat'],
            'location_lng' => $validated['location_lng'],
            'address' => $validated['address'],
        ]);

        $property->geometry->update([
            'lot_area_sqm' => $validated['lot_area_sqm'],
        ]);

        // Delete marked images
        if ($request->has('delete_images')) {
            foreach ($request->delete_images as $imageId) {
                $image = PropertyImage::find($imageId);
                if ($image && $image->property_id === $property->id) {
                    Storage::disk('public')->delete($image->image_path);
                    $image->delete();
                }
            }
        }

        // Add new images
        if ($request->hasFile('images')) {
            $maxSortOrder = PropertyImage::where('property_id', $property->id)->max('sort_order') ?? 0;
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('properties', 'public');
                PropertyImage::create([
                    'property_id' => $property->id,
                    'image_path' => $path,
                    'sort_order' => $maxSortOrder + $index + 1,
                ]);
            }
        }

        return redirect()->route('seller.properties.index')->with('success', 'Property updated successfully.');
    }

    public function publicIndex(Request $request)
    {
        $query = Property::where('is_active', true)
            ->with(['images', 'location', 'user'])
            ->orderBy('created_at', 'desc');

        // Filter by distance if lat/lng provided
        if ($request->has('lat') && $request->has('lng') && $request->has('radius_km')) {
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

        return inertia('Public/HomePage', [
            'properties' => $properties,
        ]);
    }

    public function show(Request $request, Property $property)
    {
        if (!$property->is_active) {
            abort(404);
        }

        $property->load(['images', 'location', 'user']);

        return inertia('Public/PropertyDetailPage', [
            'property' => $property,
        ]);
    }

    public function dashboard(Request $request)
    {
        $properties = Property::where('user_id', $request->user()->id)
            ->with('images')
            ->orderBy('created_at', 'desc')
            ->get();

        $totalProperties = $properties->count();
        $activeListings = $properties->where('is_active', true)->count();
        $recentProperties = $properties->take(5);

        // Calculate properties created in last 6 months
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $count = $properties->filter(function ($property) use ($month) {
                return $property->created_at->format('Y-m') === $month->format('Y-m');
            })->count();
            $monthlyData[] = [
                'month' => $month->format('M'),
                'count' => $count,
            ];
        }

        return inertia('Seller/SellerDashboardPage', [
            'stats' => [
                'total_properties' => $totalProperties,
                'active_listings' => $activeListings,
            ],
            'recent_properties' => $recentProperties,
            'monthly_data' => $monthlyData,
        ]);
    }

    public function destroy(Request $request, Property $property)
    {
        if ($property->user_id !== $request->user()->id) {
            abort(403);
        }

        // Delete property images
        foreach ($property->images as $image) {
            Storage::disk('public')->delete($image->image_path);
            $image->delete();
        }

        // Delete property location
        $property->location()->delete();

        // Delete property geometry
        $property->geometry()->delete();

        // Delete property
        $property->delete();

        return redirect()->route('seller.properties.index')->with('success', 'Property deleted successfully.');
    }
}
