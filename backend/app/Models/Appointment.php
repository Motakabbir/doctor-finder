<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'chamber_id',
        'schedule_id',
        'patient_name',
        'patient_email',
        'patient_phone',
        'appointment_date',
        'appointment_time',
        'symptoms',
        'status',
        'cancellation_reason'
    ];

    protected $casts = [
        'appointment_date' => 'date',
        'appointment_time' => 'datetime',
        'status' => 'string'
    ];

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    public function chamber(): BelongsTo
    {
        return $this->belongsTo(Chamber::class);
    }

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isConfirmed(): bool
    {
        return $this->status === 'confirmed';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    public function confirm(): bool
    {
        return $this->update(['status' => 'confirmed']);
    }

    public function cancel(string $reason = null): bool
    {
        return $this->update([
            'status' => 'cancelled',
            'cancellation_reason' => $reason
        ]);
    }
}
