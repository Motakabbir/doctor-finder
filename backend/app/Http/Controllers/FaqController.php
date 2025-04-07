<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FaqController extends Controller
{
    /**
     * Display a listing of the FAQs.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Faq::query()
            ->when($request->category, function ($query, $category) {
                return $query->where('category', $category);
            })
            ->when($request->active, function ($query) {
                return $query->active();
            })
            ->orderBy('order')
            ->orderBy('created_at');

        $faqs = $request->per_page ?
            $query->paginate($request->per_page) :
            $query->get();

        return response()->json($faqs);
    }

    /**
     * Store a newly created FAQ in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'category' => 'nullable|string|max:50',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $faq = Faq::create($validated);

        return response()->json($faq, 201);
    }

    /**
     * Display the specified FAQ.
     */
    public function show(int $id): JsonResponse
    {
        $faq = Faq::findOrFail($id);

        return response()->json($faq);
    }

    /**
     * Update the specified FAQ in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $faq = Faq::findOrFail($id);

        $validated = $request->validate([
            'question' => 'sometimes|required|string',
            'answer' => 'sometimes|required|string',
            'category' => 'nullable|string|max:50',
            'order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $faq->update($validated);

        return response()->json($faq);
    }

    /**
     * Remove the specified FAQ from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $faq = Faq::findOrFail($id);
        $faq->delete();

        return response()->json(null, 204);
    }

    /**
     * Reorder FAQs.
     */
    public function reorder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'orders' => 'required|array',
            'orders.*' => 'required|array',
            'orders.*.id' => 'required|exists:faqs,id',
            'orders.*.order' => 'required|integer',
        ]);

        foreach ($validated['orders'] as $item) {
            Faq::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json(['message' => 'FAQs reordered successfully']);
    }
}
