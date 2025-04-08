<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use App\Models\Doctor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
    use RefreshDatabase, \Tests\Traits\WithAuthentication;

    protected function setUp(): void
    {
        parent::setUp();
        $this->authenticateUser();
    }

    public function test_can_list_active_categories()
    {
        $activeCategory = Category::factory()->create(['is_active' => true]);
        $inactiveCategory = Category::factory()->create(['is_active' => false]);

        $response = $this->getJson('/api/categories');

        $response->assertStatus(200)
            ->assertJsonPath('categories.0.id', $activeCategory->id)
            ->assertJsonMissing(['id' => $inactiveCategory->id]);
    }

    public function test_can_show_category_with_doctors()
    {
        $category = Category::factory()->create();

        $response = $this->getJson("/api/categories/{$category->slug}");

        $response->assertStatus(200)
            ->assertJsonPath('category.id', $category->id)
            ->assertJsonStructure(['category' => ['doctors']]);
    }

    public function test_can_create_category()
    {
        $categoryData = [
            'name' => 'Cardiology',
            'description' => 'Heart specialists',
            'is_active' => true
        ];

        $response = $this->postJson('/api/categories', $categoryData);

        $response->assertStatus(201);
        $this->assertDatabaseHas('categories', [
            'name' => 'Cardiology',
            'description' => 'Heart specialists'
        ]);
    }

    public function test_cannot_create_duplicate_category()
    {
        $existingCategory = Category::factory()->create(['name' => 'Cardiology']);

        $response = $this->postJson('/api/categories', [
            'name' => 'Cardiology',
            'description' => 'Another cardiology department'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_can_update_category()
    {
        $category = Category::factory()->create();

        $response = $this->putJson("/api/categories/{$category->slug}", [
            'name' => 'Updated Category',
            'description' => 'Updated description'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated Category'
        ]);
    }

    public function test_can_delete_category_without_doctors()
    {
        $category = Category::factory()->create();

        $response = $this->deleteJson("/api/categories/{$category->slug}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_cannot_delete_category_with_doctors()
    {
        $category = Category::factory()->create();
        $doctor = Doctor::factory()->create(['category_id' => $category->id]);

        $response = $this->deleteJson("/api/categories/{$category->slug}");

        $response->assertStatus(422)
            ->assertJsonFragment(['message' => 'Cannot delete category with associated doctors']);
        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }
}
