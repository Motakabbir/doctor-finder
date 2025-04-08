# 🏥 Doctor Finder Application

<div align="center">

[![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

A modern web application that connects patients with healthcare professionals. Built with Laravel (Backend) and Next.js (Frontend).

</div>

## ✨ Features

### 🎯 Phase 1: Core Directory

- 👨‍⚕️ Doctor profiles with detailed information
- 🔍 Search and filter doctors by specialty, location, and availability
- 🔐 Admin panel for doctor management
- 📑 Category management for medical specialties

### 🚀 Phase 2: Appointment System

- 📅 Online appointment booking
- ⏰ Schedule management for doctors
- 👤 Patient registration and profiles
- 📧 Email notifications for appointments

### 💫 Phase 3: Enhanced Features

- ⭐ Patient reviews and ratings
- 📊 Analytics dashboard
- 🔎 Advanced search with filters
- 📱 Mobile responsive design

## 🛠️ Tech Stack

### 🔧 Backend (Laravel)

- 🐘 PHP 8.2
- ⚡ Laravel Framework
- 🗄️ SQLite Database
- 🔒 Laravel Sanctum for Authentication

### 🎨 Frontend (Next.js)

- ⚛️ React 19
- 🔄 Next.js 15
- 📝 TypeScript
- 💅 Tailwind CSS

## 🚀 Getting Started

### 📋 Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18 or higher
- npm or yarn

### ⚙️ Backend Setup

```bash
# Clone the repository (if you haven't already)
# git clone https://github.com/yourusername/doctor-finder.git
# cd doctor-finder

# Navigate to backend directory
cd backend

# Install dependencies
composer install

# Create environment file and generate application key
cp .env.example .env
php artisan key:generate

# Run database migrations
php artisan migrate

# Seed the database with sample data (optional)
php artisan db:seed

# Start the development server
php artisan serve
```

The backend server will be running at http://localhost:8000

### 🎨 Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will be running at http://localhost:3000

## 📚 API Documentation

### 🔐 Authentication

- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/logout` - User logout (requires authentication)

### 👨‍⚕️ Doctors

- `GET /api/doctors` - List all doctors
- `GET /api/doctors/{id}` - Get doctor details
- `POST /api/doctors` - Create a new doctor (requires authentication)
- `PUT /api/doctors/{id}` - Update doctor information (requires authentication)
- `DELETE /api/doctors/{id}` - Delete a doctor (requires authentication)
- `GET /api/doctors/{id}/schedules` - Get doctor schedules
- `GET /api/doctors/{id}/chambers` - Get doctor chambers

### 📂 Categories

- `GET /api/categories` - List all categories
- `GET /api/categories/{id}` - Get category details
- `POST /api/categories` - Create a new category (requires authentication)
- `PUT /api/categories/{id}` - Update category (requires authentication)
- `DELETE /api/categories/{id}` - Delete a category (requires authentication)

### 📅 Appointments

- `POST /api/appointments` - Create a new appointment
- `GET /api/appointments/{id}` - Get appointment details

## 📁 Project Structure

### 🔧 Backend

- `app/Models` - Database models
- `app/Http/Controllers` - API controllers
- `database/migrations` - Database structure
- `routes/api.php` - API routes

### 🎨 Frontend

- `app/` - Next.js pages and components
- `app/components` - Reusable UI components
- `app/services` - API client services
- `app/doctors` - Doctor-related pages
- `public/` - Static assets

## 🚀 Deployment

### 🔧 Backend Deployment

1. Set up a production server with PHP 8.2+
2. Configure your web server (Apache/Nginx) to point to the `public` directory
3. Set up environment variables for production
4. Run migrations on the production database
5. Configure caching for optimal performance

### 🎨 Frontend Deployment

1. Build the production version: `npm run build`
2. Deploy the `.next` directory to your hosting provider
3. For Vercel deployment:
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
Made with ❤️ for better healthcare
</div>
