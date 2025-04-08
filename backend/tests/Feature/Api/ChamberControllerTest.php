<?php

namespace Tests\Feature\Api;

use App\Models\Chamber;
use App\Models\Doctor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChamberControllerTest extends TestCase
{
    use RefreshDatabase, \Tests\Traits\WithAuthentication;

    protected function setUp(): void
    {
        parent::setUp();
        $this->authenticateUser();
    }

    public function test_can_create_chamber()
    {
        $doctor = Doctor::factory()->create();

        $response = $this->postJson("/api/doctors/{$doctor->slug}/chambers", [
            'name' => 'Main Clinic',
            'address' => '123 Medical Street',
            'contact_number' => '1234567890',
            'google_maps_link' => 'https://maps.google.com/test',
            'is_primary' => true,
            'is_active' => true
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('chambers', [
            'name' => 'Main Clinic',
            'doctor_id' => $doctor->id,
            'is_primary' => true
        ]);
    }

    public function test_only_one_primary_chamber_allowed()
    {
        $doctor = Doctor::factory()->create();
        $existingPrimaryChamber = Chamber::factory()->create([
            'doctor_id' => $doctor->id,
            'is_primary' => true
        ]);

        $response = $this->postJson("/api/doctors/{$doctor->slug}/chambers", [
            'name' => 'Second Clinic',
            'address' => '456 Medical Avenue',
            'contact_number' => '0987654321',
            'is_primary' => true,
            'is_active' => true
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('chambers', [
            'id' => $existingPrimaryChamber->id,
            'is_primary' => false
        ]);
    }

    public function test_can_update_chamber()
    {
        $doctor = Doctor::factory()->create();
        $chamber = Chamber::factory()->create(['doctor_id' => $doctor->id]);

        $response = $this->putJson("/api/chambers/{$chamber->id}", [
            'name' => 'Updated Clinic',
            'address' => 'Updated Address'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('chambers', [
            'id' => $chamber->id,
            'name' => 'Updated Clinic'
        ]);
    }

    public function test_can_delete_chamber()
    {
        $doctor = Doctor::factory()->create();
        $chamber = Chamber::factory()->create(['doctor_id' => $doctor->id]);

        $response = $this->deleteJson("/api/chambers/{$chamber->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('chambers', ['id' => $chamber->id]);
    }
}
