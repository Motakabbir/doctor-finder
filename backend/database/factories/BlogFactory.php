<?php

namespace Database\Factories;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BlogFactory extends Factory
{
    protected $model = Blog::class;

    public function definition(): array
    {
        $title = $this->faker->sentence();
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'content' => $this->faker->paragraphs(3, true),
            'excerpt' => $this->faker->paragraph(),
            'author_id' => User::factory(),
            'category' => $this->faker->randomElement(['Health', 'Medical', 'Lifestyle']),
            'is_published' => true,
            'published_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'reading_time' => $this->faker->numberBetween(3, 15),
            'image_url' => null,
        ];
    }
}
