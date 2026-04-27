<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'contact',
        'type',
        'lot_area_sqm',
        'price_total',
        'price_per_sqm',
        'rental_period',
        'lease_duration_months',
        'is_active',
    ];

    protected $casts = [
        'lot_area_sqm' => 'decimal:2',
        'price_total' => 'decimal:2',
        'price_per_sqm' => 'decimal:2',
        'lease_duration_months' => 'integer',
        'is_active' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function location()
    {
        return $this->hasOne(PropertyLocation::class);
    }

    public function geometry()
    {
        return $this->hasOne(PropertyGeometry::class);
    }

    public function images()
    {
        return $this->hasMany(PropertyImage::class);
    }
}
