<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Chamber;
use App\Models\Schedule;
use Illuminate\Database\Eloquent\Factories\Factory;

class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition(): array
    {
        return [
            'doctor_id' => Doctor::factory(),
            'chamber_id' => Chamber::factory(),
            'schedule_id' => Schedule::factory(),
            'appointment_date' => $this->faker->dateTimeBetween('now', '+30 days')->format('Y-m-d'),
            'appointment_time' => '10:00',
            'patient_name' => $this->faker->name(),
            'patient_email' => $this->faker->safeEmail(),
            'patient_phone' => $this->faker->phoneNumber(),
            'symptoms' => $this->faker->text(),
            'status' => 'pending'
        ];
    }
}
