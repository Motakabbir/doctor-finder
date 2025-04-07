<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'chamber_id',
        'day_of_week',
        'start_time',
        'end_time',
        'max_patients',
        'is_active'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'max_patients' => 'integer',
        'is_active' => 'boolean'
    ];

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    public function chamber(): BelongsTo
    {
        return $this->belongsTo(Chamber::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function getAvailableSlots(string $date): int
    {
        $bookedAppointments = $this->appointments()
            ->where('appointment_date', $date)
            ->where('status', '!=', 'cancelled')
            ->count();

        return max(0, $this->max_patients - $bookedAppointments);
    }
}
