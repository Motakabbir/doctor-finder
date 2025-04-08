'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Doctor {
  id: number;
  name: string;
}

interface Chamber {
  id: number;
  name: string;
}

interface ScheduleFormData {
  doctor_id: string;
  chamber_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  max_patients: number;
  is_active: boolean;
}

interface ScheduleFormProps {
  scheduleId?: number;
  initialData?: ScheduleFormData;
}

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function ScheduleForm({ scheduleId, initialData }: ScheduleFormProps) {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [chambers, setChambers] = useState<Chamber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<ScheduleFormData>(initialData || {
    doctor_id: '',
    chamber_id: '',
    day_of_week: '',
    start_time: '',
    end_time: '',
    max_patients: 20,
    is_active: true,
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (formData.doctor_id) {
      fetchChambers(formData.doctor_id);
    }
  }, [formData.doctor_id]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/admin/doctors');
      if (!response.ok) throw new Error('Failed to fetch doctors');
      const data = await response.json();
      setDoctors(data.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to load doctors');
    }
  };

  const fetchChambers = async (doctorId: string) => {
    try {
      const response = await fetch(`/api/admin/doctors/${doctorId}/chambers`);
      if (!response.ok) throw new Error('Failed to fetch chambers');
      const data = await response.json();
      setChambers(data);
    } catch (error) {
      console.error('Error fetching chambers:', error);
      setError('Failed to load chambers');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = scheduleId 
        ? `/api/admin/schedules/${scheduleId}`
        : '/api/admin/schedules';
      
      const response = await fetch(url, {
        method: scheduleId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save schedule');

      router.push('/admin/schedules');
      router.refresh();
    } catch (error) {
      console.error('Error saving schedule:', error);
      setError('Failed to save schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="doctor_id" className="block text-sm font-medium text-gray-700">
              Doctor
            </label>
            <select
              id="doctor_id"
              name="doctor_id"
              required
              value={formData.doctor_id}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="chamber_id" className="block text-sm font-medium text-gray-700">
              Chamber
            </label>
            <select
              id="chamber_id"
              name="chamber_id"
              required
              value={formData.chamber_id}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select a chamber</option>
              {chambers.map((chamber) => (
                <option key={chamber.id} value={chamber.id}>
                  {chamber.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-700">
              Day of Week
            </label>
            <select
              id="day_of_week"
              name="day_of_week"
              required
              value={formData.day_of_week}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select a day</option>
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                id="start_time"
                name="start_time"
                required
                value={formData.start_time}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                id="end_time"
                name="end_time"
                required
                value={formData.end_time}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="max_patients" className="block text-sm font-medium text-gray-700">
              Maximum Patients
            </label>
            <input
              type="number"
              id="max_patients"
              name="max_patients"
              required
              min="1"
              value={formData.max_patients}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
              Active
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : scheduleId ? 'Update Schedule' : 'Create Schedule'}
          </button>
        </div>
      </div>
    </form>
  );
}
