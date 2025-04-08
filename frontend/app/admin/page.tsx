'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalDoctors: number;
  totalAppointments: number;
  totalCategories: number;
  totalPosts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDoctors: 0,
    totalAppointments: 0,
    totalCategories: 0,
    totalPosts: 0
  });

  // TODO: Fetch actual stats from the API
  useEffect(() => {
    // Simulated stats for now
    setStats({
      totalDoctors: 25,
      totalAppointments: 150,
      totalCategories: 8,
      totalPosts: 12
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/doctors" className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-md transition-shadow">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Doctors</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalDoctors}</dd>
        </Link>

        <Link href="/admin/appointments" className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-md transition-shadow">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Appointments</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalAppointments}</dd>
        </Link>

        <Link href="/admin/categories" className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-md transition-shadow">
          <dt className="text-sm font-medium text-gray-500 truncate">Categories</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalCategories}</dd>
        </Link>

        <Link href="/admin/blog" className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-md transition-shadow">
          <dt className="text-sm font-medium text-gray-500 truncate">Blog Posts</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalPosts}</dd>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          <div className="mt-4 space-y-4">
            <Link href="/admin/doctors/new" className="block text-blue-600 hover:text-blue-800">➕ Add New Doctor</Link>
            <Link href="/admin/categories/new" className="block text-blue-600 hover:text-blue-800">➕ Add New Category</Link>
            <Link href="/admin/blog/new" className="block text-blue-600 hover:text-blue-800">➕ Create Blog Post</Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">System Status</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <span className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></span>
              <span className="text-gray-600">System is running normally</span>
            </div>
            <div className="flex items-center">
              <span className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></span>
              <span className="text-gray-600">API Services: Operational</span>
            </div>
            <div className="flex items-center">
              <span className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></span>
              <span className="text-gray-600">Database: Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}