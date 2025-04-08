<?php

namespace Database\Factories;

use App\Models\Page;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PageFactory extends Factory
{
    protected $model = Page::class;

    public function definition(): array
    {
        $title = $this->faker->sentence();
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'content' => [
                'main' => $this->faker->paragraphs(3, true),
                'sidebar' => $this->faker->paragraph()
            ],
            'meta_title' => $this->faker->sentence(),
            'meta_description' => $this->faker->sentence(),
            'is_active' => true,
        ];
    }
}
