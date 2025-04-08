<?php

namespace Database\Factories;

use App\Models\Faq;
use Illuminate\Database\Eloquent\Factories\Factory;

class FaqFactory extends Factory
{
    protected $model = Faq::class;

    public function definition(): array
    {
        return [
            'question' => $this->faker->sentence() . '?',
            'answer' => $this->faker->paragraph(),
            'category' => $this->faker->randomElement(['general', 'appointments', 'doctors', 'payment']),
            'order' => $this->faker->numberBetween(1, 100),
            'is_active' => true,
        ];
    }
}
