<?php

namespace Tests\Feature\Api;

use App\Models\Faq;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FaqControllerTest extends TestCase
{
    use RefreshDatabase, \Tests\Traits\WithAuthentication;

    protected function setUp(): void
    {
        parent::setUp();
        $this->authenticateUser();
    }

    public function test_can_list_active_faqs()
    {
        $activeFaq = Faq::factory()->create(['is_active' => true]);
        $inactiveFaq = Faq::factory()->create(['is_active' => false]);

        $response = $this->getJson('/api/faqs');

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $activeFaq->id])
            ->assertJsonMissing(['id' => $inactiveFaq->id]);
    }

    public function test_can_filter_faqs_by_category()
    {
        $healthFaq = Faq::factory()->create([
            'category' => 'health',
            'is_active' => true
        ]);
        $generalFaq = Faq::factory()->create([
            'category' => 'general',
            'is_active' => true
        ]);

        $response = $this->getJson('/api/faqs?category=health');

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $healthFaq->id])
            ->assertJsonMissing(['id' => $generalFaq->id]);
    }

    public function test_can_create_faq()
    {
        $response = $this->postJson('/api/faqs', [
            'question' => 'Test Question?',
            'answer' => 'Test Answer',
            'category' => 'health',
            'order' => 1,
            'is_active' => true
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('faqs', [
            'question' => 'Test Question?',
            'category' => 'health'
        ]);
    }

    public function test_can_update_faq()
    {
        $faq = Faq::factory()->create();

        $response = $this->putJson("/api/faqs/{$faq->id}", [
            'question' => 'Updated Question?',
            'answer' => 'Updated Answer'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('faqs', [
            'id' => $faq->id,
            'question' => 'Updated Question?'
        ]);
    }

    public function test_can_delete_faq()
    {
        $faq = Faq::factory()->create();

        $response = $this->deleteJson("/api/faqs/{$faq->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('faqs', ['id' => $faq->id]);
    }

    public function test_can_reorder_faqs()
    {
        $faq1 = Faq::factory()->create(['order' => 1]);
        $faq2 = Faq::factory()->create(['order' => 2]);

        $response = $this->postJson('/api/faqs/reorder', [
            'orders' => [
                ['id' => $faq1->id, 'order' => 2],
                ['id' => $faq2->id, 'order' => 1]
            ]
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('faqs', [
            'id' => $faq1->id,
            'order' => 2
        ]);
        $this->assertDatabaseHas('faqs', [
            'id' => $faq2->id,
            'order' => 1
        ]);
    }

    public function test_validates_required_fields_for_creation()
    {
        $response = $this->postJson('/api/faqs', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['question', 'answer', 'category']);
    }

    public function test_validates_question_length()
    {
        $response = $this->postJson('/api/faqs', [
            'question' => str_repeat('a', 501), // Exceeds maximum length
            'answer' => 'Test Answer',
            'category' => 'health'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['question']);
    }

    public function test_validates_answer_length()
    {
        $response = $this->postJson('/api/faqs', [
            'question' => 'Test Question?',
            'answer' => str_repeat('a', 5001), // Exceeds maximum length
            'category' => 'health'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['answer']);
    }

    public function test_validates_category_values()
    {
        $response = $this->postJson('/api/faqs', [
            'question' => 'Test Question?',
            'answer' => 'Test Answer',
            'category' => 'invalid-category'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['category']);
    }
}
