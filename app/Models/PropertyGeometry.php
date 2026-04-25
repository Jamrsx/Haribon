<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyGeometry extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'lot_polygon',
        'lot_area_sqm',
    ];

    protected $casts = [
        'lot_polygon' => 'array',
        'lot_area_sqm' => 'decimal:2',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
