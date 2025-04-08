<?php

namespace Tests\Feature\Api;

use App\Models\Page;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageControllerTest extends TestCase
{
    use RefreshDatabase, \Tests\Traits\WithAuthentication;

    protected function setUp(): void
    {
        parent::setUp();
        $this->authenticateUser();
    }

    public function test_can_list_active_pages()
    {
        $activePage = Page::factory()->create(['is_active' => true]);
        $inactivePage = Page::factory()->create(['is_active' => false]);

        $response = $this->getJson('/api/pages');

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $activePage->id])
            ->assertJsonMissing(['id' => $inactivePage->id]);
    }

    public function test_can_show_active_page()
    {
        $page = Page::factory()->create([
            'is_active' => true,
            'slug' => 'about-us',
            'title' => 'About Us'
        ]);

        $response = $this->getJson("/api/pages/{$page->slug}");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'title' => 'About Us',
                'slug' => 'about-us'
            ]);
    }

    public function test_cannot_show_inactive_page()
    {
        $page = Page::factory()->create([
            'is_active' => false,
            'slug' => 'hidden-page'
        ]);

        $response = $this->getJson("/api/pages/{$page->slug}");

        $response->assertStatus(404);
    }

    public function test_can_create_page()
    {
        $response = $this->postJson('/api/pages', [
            'title' => 'New Page',
            'content' => ['section1' => 'Content here'],
            'meta_title' => 'SEO Title',
            'meta_description' => 'SEO Description',
            'is_active' => true
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('pages', [
            'title' => 'New Page',
            'slug' => 'new-page'
        ]);
    }

    public function test_can_update_page()
    {
        $page = Page::factory()->create();

        $response = $this->putJson("/api/pages/{$page->slug}", [
            'title' => 'Updated Page',
            'content' => ['section1' => 'Updated content'],
            'meta_title' => 'Updated SEO Title'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('pages', [
            'id' => $page->id,
            'title' => 'Updated Page'
        ]);
    }

    public function test_can_delete_page()
    {
        $page = Page::factory()->create();

        $response = $this->deleteJson("/api/pages/{$page->slug}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('pages', ['id' => $page->id]);
    }
}
