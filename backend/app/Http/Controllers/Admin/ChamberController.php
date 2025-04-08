<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Chamber;
use Illuminate\Http\Request;

class ChamberController extends Controller
{
    public function index()
    {
        $chambers = Chamber::with('doctor')
            ->latest()
            ->paginate(10);
        return response()->json($chambers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'contact_number' => 'required|string|max:20',
            'google_maps_link' => 'nullable|url|max:255',
            'is_primary' => 'boolean',
            'is_active' => 'boolean'
        ]);

        if ($validated['is_primary'] ?? false) {
            Chamber::where('doctor_id', $validated['doctor_id'])
                ->where('is_primary', true)
                ->update(['is_primary' => false]);
        }

        $chamber = Chamber::create($validated);

        return response()->json($chamber->load('doctor'), 201);
    }

    public function show(Chamber $chamber)
    {
        return response()->json($chamber->load('doctor'));
    }

    public function update(Request $request, Chamber $chamber)
    {
        $validated = $request->validate([
            'doctor_id' => 'sometimes|required|exists:doctors,id',
            'name' => 'sometimes|required|string|max:255',
            'address' => 'sometimes|required|string',
            'contact_number' => 'sometimes|required|string|max:20',
            'google_maps_link' => 'nullable|url|max:255',
            'is_primary' => 'boolean',
            'is_active' => 'boolean'
        ]);

        if (($validated['is_primary'] ?? false) && !$chamber->is_primary) {
            Chamber::where('doctor_id', $chamber->doctor_id)
                ->where('is_primary', true)
                ->update(['is_primary' => false]);
        }

        $chamber->update($validated);

        return response()->json($chamber->load('doctor'));
    }

    public function destroy(Chamber $chamber)
    {
        $chamber->delete();
        return response()->json(null, 204);
    }
}
