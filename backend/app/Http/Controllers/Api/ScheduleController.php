<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\Schedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ScheduleController extends Controller
{
    public function store(Request $request, Doctor $doctor): JsonResponse
    {
        $validated = $request->validate([
            'chamber_id' => 'required|exists:chambers,id',
            'day_of_week' => 'required|in:sunday,monday,tuesday,wednesday,thursday,friday,saturday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'max_patients' => 'required|integer|min:1',
            'is_active' => 'boolean'
        ]);

        // Check for schedule conflicts
        $conflictingSchedule = $doctor->schedules()
            ->where('chamber_id', $validated['chamber_id'])
            ->where('day_of_week', $validated['day_of_week'])
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                    ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']]);
            })
            ->first();

        if ($conflictingSchedule) {
            throw ValidationException::withMessages([
                'schedule' => ['A schedule already exists for this time slot']
            ]);
        }

        $schedule = $doctor->schedules()->create($validated);

        return response()->json([
            'message' => 'Schedule created successfully',
            'schedule' => $schedule->load('chamber')
        ], 201);
    }

    public function update(Request $request, Schedule $schedule): JsonResponse
    {
        $validated = $request->validate([
            'day_of_week' => 'required|in:sunday,monday,tuesday,wednesday,thursday,friday,saturday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'max_patients' => 'required|integer|min:1',
            'is_active' => 'boolean'
        ]);

        // Check for schedule conflicts
        $conflictingSchedule = $schedule->doctor->schedules()
            ->where('id', '!=', $schedule->id)
            ->where('chamber_id', $schedule->chamber_id)
            ->where('day_of_week', $validated['day_of_week'])
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                    ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']]);
            })
            ->first();

        if ($conflictingSchedule) {
            throw ValidationException::withMessages([
                'schedule' => ['A schedule already exists for this time slot']
            ]);
        }

        $schedule->update($validated);

        return response()->json([
            'message' => 'Schedule updated successfully',
            'schedule' => $schedule->load('chamber')
        ]);
    }

    public function destroy(Schedule $schedule): JsonResponse
    {
        if ($schedule->appointments()->exists()) {
            throw ValidationException::withMessages([
                'schedule' => ['Cannot delete schedule with existing appointments']
            ]);
        }

        $schedule->delete();

        return response()->json([
            'message' => 'Schedule deleted successfully'
        ]);
    }
}
