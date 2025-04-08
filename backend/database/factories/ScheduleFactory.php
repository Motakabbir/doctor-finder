<?php

namespace Database\Factories;

use App\Models\Schedule;
use App\Models\Doctor;
use App\Models\Chamber;
use Illuminate\Database\Eloquent\Factories\Factory;

class ScheduleFactory extends Factory
{
    protected $model = Schedule::class;

    public function definition(): array
    {
        return [
            'doctor_id' => Doctor::factory(),
            'chamber_id' => Chamber::factory(),
            'day_of_week' => $this->faker->randomElement(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
            'start_time' => '09:00',
            'end_time' => '17:00',
            'max_patients' => $this->faker->numberBetween(10, 30),
            'is_active' => true,
        ];
    }
}
