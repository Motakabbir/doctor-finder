<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Doctor;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class DoctorFactory extends Factory
{
    protected $model = Doctor::class;

    public function definition(): array
    {
        $name = $this->faker->name();
        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'bio' => $this->faker->paragraph(),
            'gender' => $this->faker->randomElement(['male', 'female', 'other']),
            'experience_years' => $this->faker->numberBetween(1, 30),
            'degrees' => ['MBBS', 'MD'],
            'certifications' => ['Board Certified'],
            'category_id' => Category::factory(),
            'is_active' => true,
        ];
    }
}
