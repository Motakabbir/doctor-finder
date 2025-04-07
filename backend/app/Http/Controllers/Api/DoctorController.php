<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DoctorController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Doctor::with(['category', 'chambers'])
            ->where('is_active', true);

        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('bio', 'like', "%{$search}%")
                    ->orWhere('degrees', 'like', "%{$search}%");
            });
        }

        $doctors = $query->orderBy('name')
            ->paginate(12);

        return response()->json($doctors);
    }

    public function show(Doctor $doctor): JsonResponse
    {
        return response()->json([
            'doctor' => $doctor->load(['category', 'chambers', 'schedules'])
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'gender' => 'required|in:male,female,other',
            'experience_years' => 'required|integer|min:0',
            'degrees' => 'required|array',
            'certifications' => 'nullable|array',
            'category_id' => 'required|exists:categories,id',
            'is_active' => 'boolean'
        ]);

        $doctor = Doctor::create([
            ...$validated,
            'slug' => Str::slug($validated['name'])
        ]);

        return response()->json([
            'message' => 'Doctor profile created successfully',
            'doctor' => $doctor->load('category')
        ], 201);
    }

    public function update(Request $request, Doctor $doctor): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'gender' => 'required|in:male,female,other',
            'experience_years' => 'required|integer|min:0',
            'degrees' => 'required|array',
            'certifications' => 'nullable|array',
            'category_id' => 'required|exists:categories,id',
            'is_active' => 'boolean'
        ]);

        $doctor->update([
            ...$validated,
            'slug' => Str::slug($validated['name'])
        ]);

        return response()->json([
            'message' => 'Doctor profile updated successfully',
            'doctor' => $doctor->load('category')
        ]);
    }

    public function uploadPhoto(Request $request, Doctor $doctor): JsonResponse
    {
        $request->validate([
            'photo' => 'required|image|max:2048'
        ]);

        if ($doctor->photo) {
            Storage::disk('public')->delete($doctor->photo);
        }

        $path = $request->file('photo')->store('doctors', 'public');
        $doctor->update(['photo' => $path]);

        return response()->json([
            'message' => 'Photo uploaded successfully',
            'photo_url' => Storage::url($path)
        ]);
    }

    public function destroy(Doctor $doctor): JsonResponse
    {
        if ($doctor->photo) {
            Storage::disk('public')->delete($doctor->photo);
        }

        $doctor->delete();

        return response()->json([
            'message' => 'Doctor profile deleted successfully'
        ]);
    }

    public function schedules(Doctor $doctor): JsonResponse
    {
        return response()->json([
            'schedules' => $doctor->schedules()
                ->with('chamber')
                ->where('is_active', true)
                ->get()
        ]);
    }

    public function chambers(Doctor $doctor): JsonResponse
    {
        return response()->json([
            'chambers' => $doctor->chambers()
                ->where('is_active', true)
                ->with('schedules')
                ->get()
        ]);
    }
}
