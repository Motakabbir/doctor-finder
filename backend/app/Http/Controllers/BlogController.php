<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class BlogController extends Controller
{
    /**
     * Display a listing of the blog posts.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Blog::with('author')
            ->when($request->category, function ($query, $category) {
                return $query->where('category', $category);
            })
            ->when($request->published, function ($query) {
                return $query->where('is_published', true)
                    ->whereNotNull('published_at');
            })
            ->orderBy('published_at', 'desc');

        $blogs = $request->per_page ?
            $query->paginate($request->per_page) :
            $query->get();

        return response()->json($blogs);
    }

    /**
     * Store a newly created blog post in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'image_url' => 'nullable|url',
            'category' => 'nullable|string|max:50',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['author_id'] = Auth::id();
        $validated['reading_time'] = $this->calculateReadingTime($validated['content']);

        $blog = Blog::create($validated);

        return response()->json($blog, 201);
    }

    /**
     * Display the specified blog post.
     */
    public function show(string $slug): JsonResponse
    {
        $blog = Blog::with('author')
            ->where('slug', $slug)
            ->when(!Auth::check(), function ($query) {
                return $query->where('is_published', true)
                    ->whereNotNull('published_at');
            })
            ->firstOrFail();

        return response()->json($blog);
    }

    /**
     * Update the specified blog post in storage.
     */
    public function update(Request $request, string $slug): JsonResponse
    {
        $blog = Blog::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'excerpt' => 'nullable|string',
            'image_url' => 'nullable|url',
            'category' => 'nullable|string|max:50',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if (isset($validated['content'])) {
            $validated['reading_time'] = $this->calculateReadingTime($validated['content']);
        }

        $blog->update($validated);

        return response()->json($blog);
    }

    /**
     * Remove the specified blog post from storage.
     */
    public function destroy(string $slug): JsonResponse
    {
        $blog = Blog::where('slug', $slug)->firstOrFail();
        $blog->delete();

        return response()->json(null, 204);
    }

    /**
     * Calculate estimated reading time in minutes.
     */
    private function calculateReadingTime(string $content): int
    {
        $wordsPerMinute = 200;
        $wordCount = str_word_count(strip_tags($content));
        return max(1, ceil($wordCount / $wordsPerMinute));
    }
}
