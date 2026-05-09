<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Conversation extends Model
{
    protected $fillable = [
        'buyer_id',
        'seller_id',
        'property_id',
        'last_message_at',
    ];

    protected function casts(): array
    {
        return [
            'last_message_at' => 'datetime',
        ];
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->orderBy('created_at');
    }

    public function latestMessage(): HasOne
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    /**
     * Returns the user on the other side of the conversation
     * relative to the given user id.
     */
    public function counterpartFor(int $userId): ?User
    {
        if ($userId === $this->buyer_id) {
            return $this->seller;
        }

        if ($userId === $this->seller_id) {
            return $this->buyer;
        }

        return null;
    }

    public function unreadCountFor(int $userId): int
    {
        return $this->messages()
            ->whereNull('read_at')
            ->where('sender_id', '!=', $userId)
            ->count();
    }
}
