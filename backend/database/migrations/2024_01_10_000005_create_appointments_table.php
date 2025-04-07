<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')->constrained()->onDelete('cascade');
            $table->foreignId('chamber_id')->constrained()->onDelete('cascade');
            $table->foreignId('schedule_id')->constrained()->onDelete('cascade');
            $table->string('patient_name');
            $table->string('patient_email');
            $table->string('patient_phone');
            $table->date('appointment_date');
            $table->time('appointment_time');
            $table->text('symptoms')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending');
            $table->text('cancellation_reason')->nullable();
            $table->timestamps();

            $table->unique(['doctor_id', 'chamber_id', 'appointment_date', 'appointment_time'], 'appt_schedule_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
