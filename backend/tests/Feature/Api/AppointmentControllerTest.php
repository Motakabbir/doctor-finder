<?php

namespace Tests\Feature\Api;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Chamber;
use App\Models\Schedule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AppointmentControllerTest extends TestCase
{
    use RefreshDatabase, \Tests\Traits\WithAuthentication;

    protected function setUp(): void
    {
        parent::setUp();
        $this->authenticateUser();
    }

    public function test_can_list_appointments()
    {
        $appointment = Appointment::factory()->create();

        $response = $this->getJson('/api/appointments');

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $appointment->id]);
    }

    public function test_can_create_appointment()
    {
        $doctor = Doctor::factory()->create();
        $chamber = Chamber::factory()->create(['doctor_id' => $doctor->id]);
        $schedule = Schedule::factory()->create([
            'doctor_id' => $doctor->id,
            'chamber_id' => $chamber->id
        ]);

        $response = $this->postJson('/api/appointments', [
            'doctor_id' => $doctor->id,
            'chamber_id' => $chamber->id,
            'schedule_id' => $schedule->id,
            'appointment_date' => now()->addDays(1)->format('Y-m-d'),
            'appointment_time' => '10:00',
            'patient_name' => 'John Doe',
            'patient_email' => 'john@example.com',
            'patient_phone' => '1234567890',
            'symptoms' => 'Fever'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('appointments', [
            'patient_name' => 'John Doe',
            'patient_email' => 'john@example.com'
        ]);
    }

    public function test_cannot_create_appointment_for_past_date()
    {
        $doctor = Doctor::factory()->create();
        $chamber = Chamber::factory()->create(['doctor_id' => $doctor->id]);
        $schedule = Schedule::factory()->create([
            'doctor_id' => $doctor->id,
            'chamber_id' => $chamber->id
        ]);

        $response = $this->postJson('/api/appointments', [
            'doctor_id' => $doctor->id,
            'chamber_id' => $chamber->id,
            'schedule_id' => $schedule->id,
            'appointment_date' => now()->subDay()->format('Y-m-d'),
            'appointment_time' => '10:00',
            'patient_name' => 'John Doe',
            'patient_email' => 'john@example.com',
            'patient_phone' => '1234567890'
        ]);

        $response->assertStatus(422);
    }

    public function test_can_cancel_appointment()
    {
        $appointment = Appointment::factory()->create(['status' => 'pending']);

        $response = $this->putJson("/api/appointments/{$appointment->id}/cancel", [
            'cancellation_reason' => 'Unable to attend'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => 'cancelled'
        ]);
    }

    public function test_can_confirm_appointment()
    {
        $appointment = Appointment::factory()->create(['status' => 'pending']);

        $response = $this->putJson("/api/appointments/{$appointment->id}/confirm");

        $response->assertStatus(200);
        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => 'confirmed'
        ]);
    }

    public function test_cannot_book_appointment_outside_schedule()
    {
        $doctor = Doctor::factory()->create();
        $chamber = Chamber::factory()->create(['doctor_id' => $doctor->id]);
        $schedule = Schedule::factory()->create([
            'doctor_id' => $doctor->id,
            'chamber_id' => $chamber->id,
            'day_of_week' => 'monday',
            'start_time' => '09:00',
            'end_time' => '17:00'
        ]);

        // Try to book outside schedule hours
        $response = $this->postJson('/api/appointments', [
            'doctor_id' => $doctor->id,
            'chamber_id' => $chamber->id,
            'schedule_id' => $schedule->id,
            'appointment_date' => now()->next('Monday')->format('Y-m-d'),
            'appointment_time' => '18:00',
            'patient_name' => 'John Doe',
            'patient_email' => 'john@example.com',
            'patient_phone' => '1234567890'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['appointment_time']);
    }

    public function test_cannot_exceed_daily_appointment_limit()
    {
        $doctor = Doctor::factory()->create();
        $chamber = Chamber::factory()->create(['doctor_id' => $doctor->id]);
        $schedule = Schedule::factory()->create([
            'doctor_id' => $doctor->id,
            'chamber_id' => $chamber->id,
            'day_of_week' => 'monday',
            'max_patients' => 1
        ]);

        // Book first appointment
        $this->postJson('/api/appointments', [
            'doctor_id' => $doctor->id,
            'chamber_id' => $chamber->id,
            'schedule_id' => $schedule->id,
            'appointment_date' => now()->next('Monday')->format('Y-m-d'),
            'appointment_time' => '10:00',
            'patient_name' => 'John Doe',
            'patient_email' => 'john@example.com',
            'patient_phone' => '1234567890'
        ]);

        // Try to book another appointment
        $response = $this->postJson('/api/appointments', [
            'doctor_id' => $doctor->id,
            'chamber_id' => $chamber->id,
            'schedule_id' => $schedule->id,
            'appointment_date' => now()->next('Monday')->format('Y-m-d'),
            'appointment_time' => '11:00',
            'patient_name' => 'Jane Doe',
            'patient_email' => 'jane@example.com',
            'patient_phone' => '1234567891'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['appointment_date']);
    }
}
