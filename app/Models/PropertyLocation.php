<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'location_lat',
        'location_lng',
        'address',
    ];

    protected $casts = [
        'location_lat' => 'decimal:7',
        'location_lng' => 'decimal:7',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
