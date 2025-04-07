<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    /**
     * Get all active FAQs
     */
    public function index(Request $request): JsonResponse
    {
        $query = Faq::active()->ordered();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $faqs = $query->get();

        return response()->json($faqs);
    }

    /**
     * Get a specific FAQ
     */
    public function show(Faq $faq): JsonResponse
    {
        if (!$faq->is_active) {
            return response()->json(['message' => 'FAQ not found'], 404);
        }

        return response()->json($faq);
    }

    /**
     * Store a new FAQ
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'category' => 'nullable|string|max:255',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $faq = Faq::create($validated);

        return response()->json([
            'message' => 'FAQ created successfully',
            'faq' => $faq,
        ], 201);
    }

    /**
     * Update an existing FAQ
     */
    public function update(Request $request, Faq $faq): JsonResponse
    {
        $validated = $request->validate([
            'question' => 'sometimes|required|string',
            'answer' => 'sometimes|required|string',
            'category' => 'nullable|string|max:255',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $faq->update($validated);

        return response()->json([
            'message' => 'FAQ updated successfully',
            'faq' => $faq,
        ]);
    }

    /**
     * Delete a FAQ
     */
    public function destroy(Faq $faq): JsonResponse
    {
        $faq->delete();

        return response()->json([
            'message' => 'FAQ deleted successfully',
        ]);
    }
}
