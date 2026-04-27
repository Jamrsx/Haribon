<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('contact');
            $table->enum('type', ['sale', 'rent', 'lease'])->default('sale');
            $table->decimal('lot_area_sqm', 12, 2)->nullable();
            $table->decimal('price_total', 15, 2);
            $table->decimal('price_per_sqm', 15, 2)->nullable();
            $table->string('rental_period')->nullable()->comment('monthly, yearly, etc. for rent/lease');
            $table->integer('lease_duration_months')->nullable()->comment('duration in months for lease properties');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
