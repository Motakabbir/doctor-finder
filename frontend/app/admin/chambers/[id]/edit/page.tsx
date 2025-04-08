'use client';

import { useEffect, useState } from 'react';
import ChamberForm from '../../components/ChamberForm';

interface ChamberData {
  doctor_id: string;
  name: string;
  address: string;
  contact_number: string;
  google_maps_link?: string;
  is_primary: boolean;
  is_active: boolean;
}

export default function EditChamber({ params }: { params: { id: string } }) {
  const [chamber, setChamber] = useState<ChamberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChamber = async () => {
      try {
        const response = await fetch(`/api/admin/chambers/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch chamber');
        const data = await response.json();
        setChamber(data);
      } catch (error) {
        console.error('Error fetching chamber:', error);
        setError('Failed to load chamber');
      } finally {
        setLoading(false);
      }
    };

    fetchChamber();
  }, [params.id]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  if (!chamber) {
    return <div className="text-center py-10">Chamber not found</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Edit Chamber</h1>
      <ChamberForm chamberId={parseInt(params.id)} initialData={chamber} />
    </div>
  );
}
