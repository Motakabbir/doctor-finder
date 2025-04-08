<?php

namespace Database\Factories;

use App\Models\Chamber;
use App\Models\Doctor;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChamberFactory extends Factory
{
    protected $model = Chamber::class;

    public function definition(): array
    {
        return [
            'doctor_id' => Doctor::factory(),
            'name' => $this->faker->company() . ' Clinic',
            'address' => $this->faker->address(),
            'contact_number' => $this->faker->phoneNumber(),
            'google_maps_link' => $this->faker->url(),
            'is_primary' => false,
            'is_active' => true,
        ];
    }
}
