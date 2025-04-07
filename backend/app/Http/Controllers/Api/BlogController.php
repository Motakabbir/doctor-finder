<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    /**
     * Get all published blog posts
     */
    public function index(Request $request): JsonResponse
    {
        $query = Blog::with('author')
            ->where('is_published', true)
            ->where('published_at', '<=', now());

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $blogs = $query->orderBy('published_at', 'desc')
            ->paginate(12);

        return response()->json($blogs);
    }

    /**
     * Get a specific blog post by slug
     */
    public function show(Blog $blog): JsonResponse
    {
        if (!$blog->is_published || $blog->published_at > now()) {
            return response()->json(['message' => 'Blog post not found'], 404);
        }

        $blog->load('author');

        return response()->json($blog);
    }

    /**
     * Store a new blog post
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'image_url' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'author_id' => 'required|exists:users,id',
            'published_at' => 'nullable|date',
            'is_published' => 'boolean',
            'reading_time' => 'nullable|integer|min:1',
        ]);

        $blog = Blog::create([
            ...$validated,
            'slug' => Str::slug($validated['title']),
        ]);

        return response()->json([
            'message' => 'Blog post created successfully',
            'blog' => $blog->load('author'),
        ], 201);
    }

    /**
     * Update an existing blog post
     */
    public function update(Request $request, Blog $blog): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'sometimes|required|string',
            'image_url' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'author_id' => 'sometimes|required|exists:users,id',
            'published_at' => 'nullable|date',
            'is_published' => 'boolean',
            'reading_time' => 'nullable|integer|min:1',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $blog->update($validated);

        return response()->json([
            'message' => 'Blog post updated successfully',
            'blog' => $blog->load('author'),
        ]);
    }

    /**
     * Delete a blog post
     */
    public function destroy(Blog $blog): JsonResponse
    {
        $blog->delete();

        return response()->json([
            'message' => 'Blog post deleted successfully',
        ]);
    }
}
