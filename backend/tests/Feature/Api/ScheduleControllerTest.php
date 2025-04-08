<?php

namespace Tests\Feature\Api;

use App\Models\Doctor;
use App\Models\Chamber;
use App\Models\Schedule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScheduleControllerTest extends TestCase
{
    use RefreshDatabase, \Tests\Traits\WithAuthentication;

    protected function setUp(): void
    {
        parent::setUp();
        $this->authenticateUser();
    }

    public function test_can_create_schedule()
    {
        $doctor = Doctor::factory()->create();
        $chamber = Chamber::factory()->create(['doctor_id' => $doctor->id]);

        $response = $this->postJson("/api/doctors/{$doctor->slug}/schedules", [
            'chamber_id' => $chamber->id,
            'day_of_week' => 'monday',
            'start_time' => '09:00',
            'end_time' => '17:00',
            'max_patients' => 20,
            'is_active' => true
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('schedules', [
            'doctor_id' => $doctor->id,
            'chamber_id' => $chamber->id,
            'day_of_week' => 'monday'
        ]);
    }

    public function test_cannot_create_overlapping_schedule()
    {
        $doctor = Doctor::factory()->create();
        $chamber = Chamber::factory()->create(['doctor_id' => $doctor->id]);

        // Create existing schedule
        Schedule::factory()->create([
            'doctor_id' => $doctor->id,
            'chamber_id' => $chamber->id,
            'day_of_week' => 'monday',
            'start_time' => '09:00',
            'end_time' => '17:00'
        ]);

        // Try to create overlapping schedule
        $response = $this->postJson("/api/doctors/{$doctor->slug}/schedules", [
            'chamber_id' => $chamber->id,
            'day_of_week' => 'monday',
            'start_time' => '10:00',
            'end_time' => '15:00',
            'max_patients' => 20,
            'is_active' => true
        ]);

        $response->assertStatus(422);
    }

    public function test_can_update_schedule()
    {
        $doctor = Doctor::factory()->create();
        $chamber = Chamber::factory()->create(['doctor_id' => $doctor->id]);
        $schedule = Schedule::factory()->create([
            'doctor_id' => $doctor->id,
            'chamber_id' => $chamber->id
        ]);

        $response = $this->putJson("/api/schedules/{$schedule->id}", [
            'start_time' => '10:00',
            'end_time' => '18:00',
            'max_patients' => 25
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('schedules', [
            'id' => $schedule->id,
            'start_time' => '10:00',
            'end_time' => '18:00',
            'max_patients' => 25
        ]);
    }

    public function test_can_delete_schedule()
    {
        $schedule = Schedule::factory()->create();

        $response = $this->deleteJson("/api/schedules/{$schedule->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('schedules', ['id' => $schedule->id]);
    }

    public function test_validates_time_range()
    {
        $doctor = Doctor::factory()->create();
        $chamber = Chamber::factory()->create(['doctor_id' => $doctor->id]);

        $response = $this->postJson("/api/doctors/{$doctor->slug}/schedules", [
            'chamber_id' => $chamber->id,
            'day_of_week' => 'monday',
            'start_time' => '17:00',
            'end_time' => '09:00', // End time before start time
            'max_patients' => 20,
            'is_active' => true
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['end_time']);
    }

    public function test_validates_minimum_schedule_duration()
    {
        $doctor = Doctor::factory()->create();
        $chamber = Chamber::factory()->create(['doctor_id' => $doctor->id]);

        $response = $this->postJson("/api/doctors/{$doctor->slug}/schedules", [
            'chamber_id' => $chamber->id,
            'day_of_week' => 'monday',
            'start_time' => '09:00',
            'end_time' => '09:15', // Less than minimum duration
            'max_patients' => 20,
            'is_active' => true
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['end_time']);
    }
}
