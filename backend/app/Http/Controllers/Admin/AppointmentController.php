<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AppointmentController extends Controller
{
    public function index()
    {
        $appointments = Appointment::with(['doctor', 'chamber', 'schedule'])
            ->latest()
            ->paginate(10);
        return response()->json($appointments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'chamber_id' => 'required|exists:chambers,id',
            'schedule_id' => 'required|exists:schedules,id',
            'patient_name' => 'required|string|max:255',
            'patient_email' => 'required|email|max:255',
            'patient_phone' => 'required|string|max:20',
            'appointment_date' => 'required|date|after_or_equal:today',
            'appointment_time' => 'required|date_format:H:i',
            'symptoms' => 'nullable|string',
            'status' => ['required', Rule::in(['pending', 'confirmed', 'cancelled'])],
            'cancellation_reason' => 'nullable|required_if:status,cancelled|string'
        ]);

        $appointment = Appointment::create($validated);

        return response()->json($appointment->load(['doctor', 'chamber', 'schedule']), 201);
    }

    public function show(Appointment $appointment)
    {
        return response()->json($appointment->load(['doctor', 'chamber', 'schedule']));
    }

    public function update(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'doctor_id' => 'sometimes|required|exists:doctors,id',
            'chamber_id' => 'sometimes|required|exists:chambers,id',
            'schedule_id' => 'sometimes|required|exists:schedules,id',
            'patient_name' => 'sometimes|required|string|max:255',
            'patient_email' => 'sometimes|required|email|max:255',
            'patient_phone' => 'sometimes|required|string|max:20',
            'appointment_date' => 'sometimes|required|date',
            'appointment_time' => 'sometimes|required|date_format:H:i',
            'symptoms' => 'nullable|string',
            'status' => ['sometimes', 'required', Rule::in(['pending', 'confirmed', 'cancelled'])],
            'cancellation_reason' => 'nullable|required_if:status,cancelled|string'
        ]);

        $appointment->update($validated);

        return response()->json($appointment->load(['doctor', 'chamber', 'schedule']));
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->delete();
        return response()->json(null, 204);
    }
}
