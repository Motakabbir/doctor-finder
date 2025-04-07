<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Chamber;
use App\Models\Doctor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChamberController extends Controller
{
    public function store(Request $request, Doctor $doctor): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'contact_number' => 'required|string|max:20',
            'google_maps_link' => 'nullable|url',
            'is_primary' => 'boolean',
            'is_active' => 'boolean'
        ]);

        if ($validated['is_primary'] ?? false) {
            $doctor->chambers()
                ->where('is_primary', true)
                ->update(['is_primary' => false]);
        }

        $chamber = $doctor->chambers()->create($validated);

        return response()->json([
            'message' => 'Chamber created successfully',
            'chamber' => $chamber
        ], 201);
    }

    public function update(Request $request, Chamber $chamber): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'contact_number' => 'required|string|max:20',
            'google_maps_link' => 'nullable|url',
            'is_primary' => 'boolean',
            'is_active' => 'boolean'
        ]);

        if ($validated['is_primary'] ?? false) {
            $chamber->doctor->chambers()
                ->where('id', '!=', $chamber->id)
                ->where('is_primary', true)
                ->update(['is_primary' => false]);
        }

        $chamber->update($validated);

        return response()->json([
            'message' => 'Chamber updated successfully',
            'chamber' => $chamber
        ]);
    }

    public function destroy(Chamber $chamber): JsonResponse
    {
        $chamber->delete();

        return response()->json([
            'message' => 'Chamber deleted successfully'
        ]);
    }

    public function schedules(Chamber $chamber): JsonResponse
    {
        return response()->json([
            'schedules' => $chamber->schedules()
                ->where('is_active', true)
                ->orderBy('day_of_week')
                ->orderBy('start_time')
                ->get()
        ]);
    }
}
