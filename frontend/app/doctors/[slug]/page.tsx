'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { doctorService, type Doctor } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import BookingModal from '../../components/BookingModal';

export default function DoctorProfile() {
  const params = useParams();
  const { slug } = params;
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await doctorService.getDoctorBySlug(slug as string);
        setDoctor(data);
      } catch (err) {
        setError('Failed to fetch doctor details. Please try again later.');
        console.error('Error fetching doctor:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctor();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/doctors"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back to Doctors
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error || 'Doctor not found'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/doctors"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back to Doctors
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={doctor.photo}
              alt={doctor.name}
              className="h-24 w-24 rounded-full object-cover"
            />
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
              <p className="text-gray-500">{doctor.speciality}</p>
              <div className="mt-1 flex items-center">
                <span className="text-yellow-400">
                  {'★'.repeat(Math.floor(doctor.rating))}
                  {'☆'.repeat(5 - Math.floor(doctor.rating))}
                </span>
                <span className="ml-2 text-sm text-gray-500">{doctor.rating}/5</span>
              </div>
            </div>
          </div>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsBookingModalOpen(true)}
          >
            Book Appointment
          </button>
          {isBookingModalOpen && (
            <BookingModal
              isOpen={isBookingModalOpen}
              onClose={() => setIsBookingModalOpen(false)}
              doctorId={doctor.id}
              doctorName={doctor.name}
              availability={doctor.availability}
            />
          )}
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">About</dt>
              <dd className="mt-1 text-sm text-gray-900">{doctor.bio}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Experience</dt>
              <dd className="mt-1 text-sm text-gray-900">{doctor.experience_years} years</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Education</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <ul className="list-disc pl-5">
                  {doctor.degrees.map((degree, index) => (
                    <li key={index}>{degree}</li>
                  ))}
                </ul>
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Certifications</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <ul className="list-disc pl-5">
                  {doctor.certifications.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Availability</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {doctor.availability.map((schedule, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900">{schedule.day}</h4>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {schedule.slots.map((slot, slotIndex) => (
                          <span
                            key={slotIndex}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}