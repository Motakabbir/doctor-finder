<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PageController extends Controller
{
    /**
     * Display a listing of the pages.
     */
    public function index(): JsonResponse
    {
        $pages = Page::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($pages);
    }

    /**
     * Store a newly created page in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|array',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        $page = Page::create($validated);

        return response()->json($page, 201);
    }

    /**
     * Display the specified page.
     */
    public function show(string $slug): JsonResponse
    {
        $page = Page::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json($page);
    }

    /**
     * Update the specified page in storage.
     */
    public function update(Request $request, string $slug): JsonResponse
    {
        $page = Page::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|array',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $page->update($validated);

        return response()->json($page);
    }

    /**
     * Remove the specified page from storage.
     */
    public function destroy(string $slug): JsonResponse
    {
        $page = Page::where('slug', $slug)->firstOrFail();
        $page->delete();

        return response()->json(null, 204);
    }
}
