<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PageController extends Controller
{
    /**
     * Get all active pages
     */
    public function index(): JsonResponse
    {
        $pages = Page::where('is_active', true)
            ->select(['id', 'slug', 'title'])
            ->get();

        return response()->json($pages);
    }

    /**
     * Get a specific page by slug
     */
    public function show(Page $page): JsonResponse
    {
        if (!$page->is_active) {
            return response()->json(['message' => 'Page not found'], 404);
        }

        return response()->json($page);
    }

    /**
     * Store a new page
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slug' => 'required|string|max:255|unique:pages,slug',
            'title' => 'required|string|max:255',
            'content' => 'nullable|array',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $page = Page::create($validated);

        return response()->json([
            'message' => 'Page created successfully',
            'page' => $page,
        ], 201);
    }

    /**
     * Update an existing page
     */
    public function update(Request $request, Page $page): JsonResponse
    {
        $validated = $request->validate([
            'slug' => 'sometimes|required|string|max:255|unique:pages,slug,' . $page->id,
            'title' => 'sometimes|required|string|max:255',
            'content' => 'nullable|array',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $page->update($validated);

        return response()->json([
            'message' => 'Page updated successfully',
            'page' => $page,
        ]);
    }

    /**
     * Delete a page
     */
    public function destroy(Page $page): JsonResponse
    {
        $page->delete();

        return response()->json([
            'message' => 'Page deleted successfully',
        ]);
    }
}
