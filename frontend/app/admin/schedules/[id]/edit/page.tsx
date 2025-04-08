'use client';

import { useEffect, useState } from 'react';
import ScheduleForm from '../../components/ScheduleForm';

interface ScheduleData {
  doctor_id: string;
  chamber_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  max_patients: number;
  is_active: boolean;
}

export default function EditSchedule({ params }: { params: { id: string } }) {
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(`/api/admin/schedules/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch schedule');
        const data = await response.json();
        setSchedule(data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setError('Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [params.id]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  if (!schedule) {
    return <div className="text-center py-10">Schedule not found</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Edit Schedule</h1>
      <ScheduleForm scheduleId={parseInt(params.id)} initialData={schedule} />
    </div>
  );
}
