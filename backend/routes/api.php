<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ChamberController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\SettingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::get('categories', [CategoryController::class, 'index']);
Route::get('categories/{category}', [CategoryController::class, 'show']);

Route::get('doctors', [DoctorController::class, 'index']);
Route::get('doctors/{doctor}', [DoctorController::class, 'show']);
Route::get('doctors/{doctor}/schedules', [DoctorController::class, 'schedules']);
Route::get('doctors/{doctor}/chambers', [DoctorController::class, 'chambers']);

Route::get('chambers/{chamber}/schedules', [ChamberController::class, 'schedules']);

Route::post('appointments', [AppointmentController::class, 'store']);
Route::get('appointments/{appointment}', [AppointmentController::class, 'show']);

// Blog routes
Route::get('blogs', [BlogController::class, 'index']);
Route::get('blogs/{blog}', [BlogController::class, 'show']);

// FAQ routes
Route::get('faqs', [FaqController::class, 'index']);
Route::get('faqs/{faq}', [FaqController::class, 'show']);

// Page routes
Route::get('pages', [PageController::class, 'index']);
Route::get('pages/{page}', [PageController::class, 'show']);

// Settings routes
Route::get('settings', [SettingController::class, 'index']);
Route::get('settings/{key}', [SettingController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Categories management
    Route::post('categories', [CategoryController::class, 'store']);
    Route::put('categories/{category}', [CategoryController::class, 'update']);
    Route::delete('categories/{category}', [CategoryController::class, 'destroy']);

    // Doctors management
    Route::post('doctors', [DoctorController::class, 'store']);
    Route::post('doctors/{doctor}/photo', [DoctorController::class, 'uploadPhoto']);
    Route::put('doctors/{doctor}', [DoctorController::class, 'update']);
    Route::delete('doctors/{doctor}', [DoctorController::class, 'destroy']);

    // Chambers management
    Route::post('doctors/{doctor}/chambers', [ChamberController::class, 'store']);
    Route::put('chambers/{chamber}', [ChamberController::class, 'update']);
    Route::delete('chambers/{chamber}', [ChamberController::class, 'destroy']);

    // Schedules management
    Route::post('doctors/{doctor}/schedules', [ScheduleController::class, 'store']);
    Route::put('schedules/{schedule}', [ScheduleController::class, 'update']);
    Route::delete('schedules/{schedule}', [ScheduleController::class, 'destroy']);

    // Appointments management
    Route::get('appointments', [AppointmentController::class, 'index']);
    Route::put('appointments/{appointment}/confirm', [AppointmentController::class, 'confirm']);
    Route::put('appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);

    // Blog management
    Route::post('blogs', [BlogController::class, 'store']);
    Route::post('blogs/{blog}/photo', [BlogController::class, 'uploadPhoto']);
    Route::put('blogs/{blog}', [BlogController::class, 'update']);
    Route::delete('blogs/{blog}', [BlogController::class, 'destroy']);

    // FAQ management
    Route::post('faqs', [FaqController::class, 'store']);
    Route::put('faqs/{faq}', [FaqController::class, 'update']);
    Route::delete('faqs/{faq}', [FaqController::class, 'destroy']);

    // Page management
    Route::post('pages', [PageController::class, 'store']);
    Route::put('pages/{page}', [PageController::class, 'update']);
    Route::delete('pages/{page}', [PageController::class, 'destroy']);

    // Settings management
    Route::post('settings', [SettingController::class, 'store']);
    Route::put('settings/{key}', [SettingController::class, 'update']);
    Route::delete('settings/{key}', [SettingController::class, 'destroy']);
});
