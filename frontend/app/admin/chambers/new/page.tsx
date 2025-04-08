'use client';

import ChamberForm from '../components/ChamberForm';

export default function NewChamber() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Create New Chamber</h1>
      <ChamberForm />
    </div>
  );
}
