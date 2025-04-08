<?php

use App\Http\Controllers\Admin\DoctorController;
use App\Http\Controllers\Admin\AppointmentController;
use App\Http\Controllers\Admin\ChamberController;
use App\Http\Controllers\Admin\ScheduleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Doctor routes
    Route::apiResource('doctors', DoctorController::class);

    // Appointment routes
    Route::apiResource('appointments', AppointmentController::class);

    // Chamber routes
    Route::apiResource('chambers', ChamberController::class);

    // Schedule routes
    Route::apiResource('schedules', ScheduleController::class);
});
