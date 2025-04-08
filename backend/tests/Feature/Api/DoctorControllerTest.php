<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use App\Models\Doctor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DoctorControllerTest extends TestCase
{
    use RefreshDatabase, \Tests\Traits\WithAuthentication;

    protected function setUp(): void
    {
        parent::setUp();
        $this->authenticateUser();
    }

    public function test_can_list_active_doctors()
    {
        $category = Category::factory()->create();
        $activeDoctor = Doctor::factory()->create([
            'category_id' => $category->id,
            'is_active' => true
        ]);
        $inactiveDoctor = Doctor::factory()->create([
            'category_id' => $category->id,
            'is_active' => false
        ]);

        $response = $this->getJson('/api/doctors');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment(['id' => $activeDoctor->id])
            ->assertJsonMissing(['id' => $inactiveDoctor->id]);
    }

    public function test_can_show_doctor_details()
    {
        $doctor = Doctor::factory()->create();

        $response = $this->getJson("/api/doctors/{$doctor->slug}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $doctor->id]);
    }

    public function test_can_create_doctor()
    {
        $category = Category::factory()->create();
        Storage::fake('public');

        $response = $this->postJson('/api/doctors', [
            'name' => 'Dr. John Doe',
            'bio' => 'Experienced doctor',
            'gender' => 'male',
            'experience_years' => 10,
            'degrees' => ['MBBS', 'MD'],
            'certifications' => ['Board Certified'],
            'category_id' => $category->id,
            'photo' => UploadedFile::fake()->image('doctor.jpg')
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('doctors', [
            'name' => 'Dr. John Doe',
            'gender' => 'male'
        ]);
    }

    public function test_can_update_doctor()
    {
        $doctor = Doctor::factory()->create();

        $response = $this->putJson("/api/doctors/{$doctor->slug}", [
            'name' => 'Dr. Jane Doe',
            'bio' => 'Updated bio',
            'gender' => 'female',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('doctors', [
            'id' => $doctor->id,
            'name' => 'Dr. Jane Doe'
        ]);
    }

    public function test_can_delete_doctor()
    {
        $doctor = Doctor::factory()->create();

        $response = $this->deleteJson("/api/doctors/{$doctor->slug}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('doctors', ['id' => $doctor->id]);
    }

    public function test_validates_photo_mime_type()
    {
        Storage::fake('public');
        $category = Category::factory()->create();

        $response = $this->postJson('/api/doctors', [
            'name' => 'Dr. John Doe',
            'bio' => 'Experienced doctor',
            'gender' => 'male',
            'experience_years' => 10,
            'category_id' => $category->id,
            'photo' => UploadedFile::fake()->create('doc.pdf', 100)
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['photo']);
    }

    public function test_validates_photo_size()
    {
        Storage::fake('public');
        $category = Category::factory()->create();

        $response = $this->postJson('/api/doctors', [
            'name' => 'Dr. John Doe',
            'bio' => 'Experienced doctor',
            'gender' => 'male',
            'experience_years' => 10,
            'category_id' => $category->id,
            'photo' => UploadedFile::fake()->image('large.jpg')->size(5000)
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['photo']);
    }
}
