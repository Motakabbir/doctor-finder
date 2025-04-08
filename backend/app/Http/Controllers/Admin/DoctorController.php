<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class DoctorController extends Controller
{
    public function index()
    {
        $doctors = Doctor::with('category')->latest()->paginate(10);
        return response()->json($doctors);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'photo' => 'nullable|image|max:2048',
            'bio' => 'nullable|string',
            'gender' => 'required|in:male,female,other',
            'experience_years' => 'required|integer|min:0',
            'degrees' => 'required|string',
            'certifications' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'is_active' => 'boolean'
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('doctors', 'public');
            $validated['photo'] = $path;
        }

        $doctor = Doctor::create($validated);

        return response()->json($doctor, 201);
    }

    public function show(Doctor $doctor)
    {
        return response()->json($doctor->load('category'));
    }

    public function update(Request $request, Doctor $doctor)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'photo' => 'nullable|image|max:2048',
            'bio' => 'nullable|string',
            'gender' => ['sometimes', 'required', Rule::in(['male', 'female', 'other'])],
            'experience_years' => 'sometimes|required|integer|min:0',
            'degrees' => 'sometimes|required|string',
            'certifications' => 'nullable|string',
            'category_id' => 'sometimes|required|exists:categories,id',
            'is_active' => 'boolean'
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('doctors', 'public');
            $validated['photo'] = $path;
        }

        $doctor->update($validated);

        return response()->json($doctor);
    }

    public function destroy(Doctor $doctor)
    {
        $doctor->delete();
        return response()->json(null, 204);
    }
}
