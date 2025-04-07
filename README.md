# Doctor Finder Application

A modern web application that connects patients with healthcare professionals. Built with Laravel (Backend) and Next.js (Frontend).

## Features

### Phase 1: Core Directory

- Doctor profiles with detailed information
- Search and filter doctors by specialty, location, and availability
- Admin panel for doctor management
- Category management for medical specialties

### Phase 2: Appointment System

- Online appointment booking
- Schedule management for doctors
- Patient registration and profiles
- Email notifications for appointments

### Phase 3: Enhanced Features

- Patient reviews and ratings
- Analytics dashboard
- Advanced search with filters
- Mobile responsive design

## Tech Stack

### Backend (Laravel)

- PHP 8.2
- Laravel Framework
- SQLite Database
- Laravel Sanctum for Authentication

### Frontend (Next.js)

- React 19
- Next.js 15
- TypeScript
- Tailwind CSS

## Getting Started

### Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

### Backend

- `app/Models` - Database models
- `app/Http/Controllers` - API controllers
- `database/migrations` - Database structure
- `routes/api.php` - API routes

### Frontend

- `app/` - Next.js pages and components
- `app/components` - Reusable UI components
- `app/lib` - Utility functions and API clients
- `app/styles` - Global styles and Tailwind config
