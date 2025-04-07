<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Get all settings or settings by group
     */
    public function index(Request $request): JsonResponse
    {
        $query = Setting::query();

        if ($request->has('group')) {
            $query->where('group', $request->group);
        }

        $settings = $query->get();

        // Transform to key-value format for easier consumption
        $formattedSettings = $settings->mapWithKeys(function ($setting) {
            return [$setting->key => $setting->value];
        });

        return response()->json($formattedSettings);
    }

    /**
     * Get a specific setting by key
     */
    public function show(string $key): JsonResponse
    {
        $setting = Setting::where('key', $key)->first();

        if (!$setting) {
            return response()->json(['message' => 'Setting not found'], 404);
        }

        return response()->json([
            'key' => $setting->key,
            'value' => $setting->value,
            'group' => $setting->group,
        ]);
    }

    /**
     * Store or update a setting
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255',
            'value' => 'required',
            'group' => 'nullable|string|max:255',
        ]);

        $setting = Setting::updateOrCreate(
            ['key' => $validated['key']],
            [
                'value' => $validated['value'],
                'group' => $validated['group'] ?? null,
            ]
        );

        return response()->json([
            'message' => 'Setting saved successfully',
            'setting' => [
                'key' => $setting->key,
                'value' => $setting->value,
                'group' => $setting->group,
            ],
        ], 201);
    }

    /**
     * Update multiple settings at once
     */
    public function batchUpdate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|max:255',
            'settings.*.value' => 'required',
            'settings.*.group' => 'nullable|string|max:255',
        ]);

        $updatedSettings = [];

        foreach ($validated['settings'] as $settingData) {
            $setting = Setting::updateOrCreate(
                ['key' => $settingData['key']],
                [
                    'value' => $settingData['value'],
                    'group' => $settingData['group'] ?? null,
                ]
            );

            $updatedSettings[] = [
                'key' => $setting->key,
                'value' => $setting->value,
                'group' => $setting->group,
            ];
        }

        return response()->json([
            'message' => 'Settings updated successfully',
            'settings' => $updatedSettings,
        ]);
    }

    /**
     * Delete a setting
     */
    public function destroy(string $key): JsonResponse
    {
        $setting = Setting::where('key', $key)->first();

        if (!$setting) {
            return response()->json(['message' => 'Setting not found'], 404);
        }

        $setting->delete();

        return response()->json([
            'message' => 'Setting deleted successfully',
        ]);
    }
}
