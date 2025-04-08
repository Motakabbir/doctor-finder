'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthService from '@/app/services/auth.service';
import { NotificationProvider } from '@/app/components/admin/NotificationContext';
import Notifications from '@/app/components/admin/Notifications';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = AuthService.isAuthenticated();
      if (!isAuthenticated && !window.location.pathname.includes('/admin/login')) {
        router.push('/admin/login');
      }
    };
    
    checkAuth();
  }, [router]);
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-100">
        <Notifications />
        <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin" className="text-xl font-bold text-gray-800">
                  Admin Dashboard
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/admin/doctors"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                >
                  Doctors
                </Link>
                <Link
                  href="/admin/appointments"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                >
                  Appointments
                </Link>
                <Link
                  href="/admin/categories"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                >
                  Categories
                </Link>
                <Link
                  href="/admin/blog"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
                >
                  Blog Posts
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button                onClick={() => {
                  AuthService.logout();
                  router.push('/admin/login');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}      </main>
    </div>
    </NotificationProvider>
  );
}