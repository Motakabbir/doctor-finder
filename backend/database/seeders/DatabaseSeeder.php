<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Category;
use App\Models\Chamber;
use App\Models\Doctor;
use App\Models\Faq;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);

        // Create medical specialties
        $categories = [
            ['name' => 'Cardiology', 'description' => 'Heart and cardiovascular system specialists'],
            ['name' => 'Dermatology', 'description' => 'Skin, hair, and nail specialists'],
            ['name' => 'Neurology', 'description' => 'Brain, spine, and nervous system specialists'],
            ['name' => 'Orthopedics', 'description' => 'Bone and joint specialists'],
            ['name' => 'Pediatrics', 'description' => 'Child health specialists'],
            ['name' => 'Psychiatry', 'description' => 'Mental health specialists'],
        ];

        foreach ($categories as $category) {
            Category::factory()->create([
                'name' => $category['name'],
                'description' => $category['description'],
                'slug' => str()->slug($category['name']),
            ]);
        }

        // Create doctors for each category
        Category::all()->each(function ($category) {
            // Create 3-5 doctors per category
            Doctor::factory()
                ->count(rand(3, 5))
                ->create(['category_id' => $category->id])
                ->each(function ($doctor) {
                    // Create 1-3 chambers per doctor
                    Chamber::factory()
                        ->count(rand(1, 3))
                        ->create(['doctor_id' => $doctor->id])
                        ->each(function ($chamber) {
                            // Create schedules for each chamber
                            $days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                            foreach (array_rand($days, rand(3, 5)) as $dayIndex) {
                                Schedule::factory()->create([
                                    'doctor_id' => $chamber->doctor_id,
                                    'chamber_id' => $chamber->id,
                                    'day_of_week' => $days[$dayIndex],
                                ]);
                            }
                        });

                    // Create 0-5 appointments per doctor
                    Appointment::factory()
                        ->count(rand(0, 5))
                        ->create([
                            'doctor_id' => $doctor->id,
                            'chamber_id' => $doctor->chambers->random()->id,
                            'schedule_id' => $doctor->schedules->random()->id,
                        ]);
                });
        });

        // Create FAQs
        $faqs = [
            [
                'question' => 'How do I book an appointment?',
                'answer' => 'You can book an appointment by selecting a doctor, choosing an available time slot, and filling out the appointment form.',
                'category' => 'General',
            ],
            [
                'question' => 'What should I bring to my appointment?',
                'answer' => 'Please bring your ID, insurance information (if applicable), and any relevant medical records or test results.',
                'category' => 'Appointments',
            ],
            [
                'question' => 'How can I cancel or reschedule my appointment?',
                'answer' => 'You can cancel or reschedule your appointment by logging into your account and managing your appointments, or by contacting our support team.',
                'category' => 'Appointments',
            ],
        ];

        foreach ($faqs as $index => $faq) {
            Faq::factory()->create([
                'question' => $faq['question'],
                'answer' => $faq['answer'],
                'category' => $faq['category'],
                'order' => $index + 1,
            ]);
        }
    }
}
