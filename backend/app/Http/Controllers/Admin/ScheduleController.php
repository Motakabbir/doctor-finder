<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ScheduleController extends Controller
{
    public function index()
    {
        $schedules = Schedule::with(['doctor', 'chamber'])
            ->latest()
            ->paginate(10);
        return response()->json($schedules);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'chamber_id' => 'required|exists:chambers,id',
            'day_of_week' => ['required', Rule::in(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])],
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'max_patients' => 'required|integer|min:1',
            'is_active' => 'boolean'
        ]);

        $schedule = Schedule::create($validated);

        return response()->json($schedule->load(['doctor', 'chamber']), 201);
    }

    public function show(Schedule $schedule)
    {
        return response()->json($schedule->load(['doctor', 'chamber']));
    }

    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'doctor_id' => 'sometimes|required|exists:doctors,id',
            'chamber_id' => 'sometimes|required|exists:chambers,id',
            'day_of_week' => ['sometimes', 'required', Rule::in(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])],
            'start_time' => 'sometimes|required|date_format:H:i',
            'end_time' => 'sometimes|required|date_format:H:i|after:start_time',
            'max_patients' => 'sometimes|required|integer|min:1',
            'is_active' => 'boolean'
        ]);

        $schedule->update($validated);

        return response()->json($schedule->load(['doctor', 'chamber']));
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();
        return response()->json(null, 204);
    }
}
