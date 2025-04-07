'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { doctorService, type Doctor } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const SPECIALITIES = [
  'Cardiologist',
  'Pediatrician',
  'Dermatologist',
  'Neurologist',
  'Orthopedist',
  'Psychiatrist',
  'Ophthalmologist',
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialityFilter, setSpecialityFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await doctorService.getDoctors({
          search: searchTerm,
          speciality: specialityFilter,
        });
        setDoctors(response.data);
      } catch (err) {
        setError('Failed to fetch doctors. Please try again later.');
        console.error('Error fetching doctors:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchDoctors, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, specialityFilter]);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error}</p>
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
      {/* Search and Filter Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Find a Doctor</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              id="search"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Search by name or speciality"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="speciality" className="block text-sm font-medium text-gray-700">Speciality</label>
            <select
              id="speciality"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={specialityFilter}
              onChange={(e) => setSpecialityFilter(e.target.value)}
            >
              <option value="">All Specialities</option>
              {SPECIALITIES.map((speciality) => (
                <option key={speciality} value={speciality}>
                  {speciality}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSpinner />}

      {/* Doctors Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map(doctor => (

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialityFilter, setSpecialityFilter] = useState('');

  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpeciality = !specialityFilter || doctor.speciality === specialityFilter;
    return matchesSearch && matchesSpeciality;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Filter Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Find a Doctor</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              id="search"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Search by name or speciality"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="speciality" className="block text-sm font-medium text-gray-700">Speciality</label>
            <select
              id="speciality"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={specialityFilter}
              onChange={(e) => setSpecialityFilter(e.target.value)}
            >
              <option value="">All Specialities</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Dermatologist">Dermatologist</option>
              {/* Add more specialities */}
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doctor => (
          <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-3 aspect-h-2">
              <img
                src={doctor.photo}
                alt={doctor.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
              <p className="text-gray-500">{doctor.speciality}</p>
              <div className="mt-2 flex items-center">
                <span className="text-yellow-400">
                  {'★'.repeat(Math.floor(doctor.rating))}
                  {'☆'.repeat(5 - Math.floor(doctor.rating))}
                </span>
                <span className="ml-2 text-sm text-gray-500">{doctor.rating}/5</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{doctor.experience_years} years of experience</p>
              <div className="mt-4">
                <Link
                  href={`/doctors/${doctor.slug}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No doctors found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}