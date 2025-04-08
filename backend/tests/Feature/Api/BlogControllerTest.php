<?php

namespace Tests\Feature\Api;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BlogControllerTest extends TestCase
{
    use RefreshDatabase, \Tests\Traits\WithAuthentication;

    protected function setUp(): void
    {
        parent::setUp();
        $this->authenticateUser();
    }

    public function test_can_list_published_blogs()
    {
        $publishedBlog = Blog::factory()->create([
            'is_published' => true,
            'published_at' => now()->subDay()
        ]);
        $unpublishedBlog = Blog::factory()->create([
            'is_published' => false
        ]);

        $response = $this->getJson('/api/blogs');

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $publishedBlog->id])
            ->assertJsonMissing(['id' => $unpublishedBlog->id]);
    }

    public function test_can_show_published_blog()
    {
        $blog = Blog::factory()->create([
            'is_published' => true,
            'published_at' => now()->subDay()
        ]);

        $response = $this->getJson("/api/blogs/{$blog->slug}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $blog->id]);
    }

    public function test_can_create_blog()
    {
        $response = $this->postJson('/api/blogs', [
            'title' => 'Test Blog Post',
            'content' => 'Test content for the blog post',
            'excerpt' => 'Short excerpt',
            'category' => 'Health',
            'is_published' => true,
            'published_at' => now()->toDateTimeString()
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('blogs', [
            'title' => 'Test Blog Post',
            'author_id' => $user->id
        ]);
    }

    public function test_can_upload_blog_photo()
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $blog = Blog::factory()->create();

        $response = $this->actingAs($user)->postJson("/api/blogs/{$blog->id}/photo", [
            'photo' => UploadedFile::fake()->image('blog.jpg')
        ]);

        $response->assertStatus(200);
        $this->assertNotNull($blog->fresh()->photo);
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $blog->fresh()->photo));
    }

    public function test_validates_blog_image_mime_type()
    {
        Storage::fake('public');
        $blog = Blog::factory()->create();

        $response = $this->postJson("/api/blogs/{$blog->id}/photo", [
            'photo' => UploadedFile::fake()->create('document.pdf', 100)
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['photo']);
    }

    public function test_validates_blog_image_size()
    {
        Storage::fake('public');
        $blog = Blog::factory()->create();

        $response = $this->postJson("/api/blogs/{$blog->id}/photo", [
            'photo' => UploadedFile::fake()->image('large.jpg')->size(5000)
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['photo']);
    }

    public function test_deletes_old_photo_when_updating()
    {
        Storage::fake('public');
        $blog = Blog::factory()->create();

        // Upload first photo
        $firstPhoto = UploadedFile::fake()->image('first.jpg');
        $this->postJson("/api/blogs/{$blog->id}/photo", [
            'photo' => $firstPhoto
        ]);

        // Upload second photo
        $secondPhoto = UploadedFile::fake()->image('second.jpg');
        $this->postJson("/api/blogs/{$blog->id}/photo", [
            'photo' => $secondPhoto
        ]);

        // First photo should be deleted
        Storage::disk('public')->assertMissing(str_replace('/storage/', '', $blog->fresh()->photo));
    }

    public function test_can_update_blog()
    {
        $user = User::factory()->create();
        $blog = Blog::factory()->create();

        $response = $this->actingAs($user)->putJson("/api/blogs/{$blog->id}", [
            'title' => 'Updated Blog Title',
            'content' => 'Updated content'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('blogs', [
            'id' => $blog->id,
            'title' => 'Updated Blog Title'
        ]);
    }

    public function test_can_delete_blog()
    {
        $user = User::factory()->create();
        $blog = Blog::factory()->create();

        $response = $this->actingAs($user)->deleteJson("/api/blogs/{$blog->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('blogs', ['id' => $blog->id]);
    }
}
