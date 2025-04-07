<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'photo',
        'bio',
        'gender',
        'experience_years',
        'degrees',
        'certifications',
        'category_id',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'experience_years' => 'integer',
        'degrees' => 'array',
        'certifications' => 'array'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function chambers(): HasMany
    {
        return $this->hasMany(Chamber::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
