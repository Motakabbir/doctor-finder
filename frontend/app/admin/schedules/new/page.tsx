'use client';

import ScheduleForm from '../components/ScheduleForm';

export default function NewSchedule() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Create New Schedule</h1>
      <ScheduleForm />
    </div>
  );
}
