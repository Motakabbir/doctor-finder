<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Schedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AppointmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::with(['doctor', 'chamber', 'schedule']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date')) {
            $query->whereDate('appointment_date', $request->date);
        }

        $appointments = $query->orderBy('appointment_date')
            ->orderBy('appointment_time')
            ->paginate(20);

        return response()->json($appointments);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'chamber_id' => 'required|exists:chambers,id',
            'schedule_id' => 'required|exists:schedules,id',
            'appointment_date' => 'required|date|after_or_equal:today',
            'appointment_time' => 'required|date_format:H:i',
            'patient_name' => 'required|string|max:255',
            'patient_email' => 'required|email',
            'patient_phone' => 'required|string|max:20',
            'symptoms' => 'nullable|string'
        ]);

        // Validate schedule availability
        $schedule = Schedule::findOrFail($validated['schedule_id']);

        // Check if the appointment day matches the schedule day
        $appointmentDay = strtolower(date('l', strtotime($validated['appointment_date'])));
        if ($appointmentDay !== $schedule->day_of_week) {
            throw ValidationException::withMessages([
                'appointment_date' => ['The selected date does not match the doctor\'s schedule']
            ]);
        }

        // Check if the appointment time is within schedule hours
        if (
            $validated['appointment_time'] < $schedule->start_time ||
            $validated['appointment_time'] > $schedule->end_time
        ) {
            throw ValidationException::withMessages([
                'appointment_time' => ['The selected time is outside of doctor\'s schedule hours']
            ]);
        }

        // Check if the schedule has available slots
        if ($schedule->getAvailableSlots($validated['appointment_date']) <= 0) {
            throw ValidationException::withMessages([
                'schedule' => ['No available slots for the selected date']
            ]);
        }

        // Check for existing appointment at the same time
        $existingAppointment = Appointment::where('doctor_id', $validated['doctor_id'])
            ->where('appointment_date', $validated['appointment_date'])
            ->where('appointment_time', $validated['appointment_time'])
            ->where('status', '!=', 'cancelled')
            ->exists();

        if ($existingAppointment) {
            throw ValidationException::withMessages([
                'appointment_time' => ['This time slot is already booked']
            ]);
        }

        $appointment = Appointment::create($validated);

        return response()->json([
            'message' => 'Appointment booked successfully',
            'appointment' => $appointment->load(['doctor', 'chamber', 'schedule'])
        ], 201);
    }

    public function show(Appointment $appointment): JsonResponse
    {
        return response()->json([
            'appointment' => $appointment->load(['doctor', 'chamber', 'schedule'])
        ]);
    }

    public function confirm(Appointment $appointment): JsonResponse
    {
        if (!$appointment->isPending()) {
            throw ValidationException::withMessages([
                'appointment' => ['Only pending appointments can be confirmed']
            ]);
        }

        $appointment->confirm();

        return response()->json([
            'message' => 'Appointment confirmed successfully',
            'appointment' => $appointment->fresh()
        ]);
    }

    public function cancel(Request $request, Appointment $appointment): JsonResponse
    {
        if ($appointment->isCancelled()) {
            throw ValidationException::withMessages([
                'appointment' => ['Appointment is already cancelled']
            ]);
        }

        $validated = $request->validate([
            'cancellation_reason' => 'required|string'
        ]);

        $appointment->cancel($validated['cancellation_reason']);

        return response()->json([
            'message' => 'Appointment cancelled successfully',
            'appointment' => $appointment->fresh()
        ]);
    }
}
