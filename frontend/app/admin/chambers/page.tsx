'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Chamber {
  id: number;
  name: string;
  address: string;
  contact_number: string;
  is_primary: boolean;
  is_active: boolean;
  doctor: {
    name: string;
  };
}

export default function ChambersManagement() {
  const [chambers, setChambers] = useState<Chamber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchChambers();
  }, []);

  const fetchChambers = async () => {
    try {
      const response = await fetch('/api/admin/chambers');
      if (!response.ok) throw new Error('Failed to fetch chambers');
      const data = await response.json();
      setChambers(data.data);
    } catch (error) {
      console.error('Error fetching chambers:', error);
      setError('Failed to load chambers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this chamber?')) return;

    try {
      const response = await fetch(`/api/admin/chambers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete chamber');
      
      setChambers(chambers.filter(chamber => chamber.id !== id));
    } catch (error) {
      console.error('Error deleting chamber:', error);
      setError('Failed to delete chamber');
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/chambers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (!response.ok) throw new Error('Failed to update chamber status');
      
      setChambers(chambers.map(chamber => 
        chamber.id === id ? { ...chamber, is_active: !currentStatus } : chamber
      ));
    } catch (error) {
      console.error('Error updating chamber status:', error);
      setError('Failed to update chamber status');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Chambers Management</h1>
        <Link
          href="/admin/chambers/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New Chamber
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Primary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {chambers.map((chamber) => (
              <tr key={chamber.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{chamber.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{chamber.doctor.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{chamber.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{chamber.contact_number}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      chamber.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    } cursor-pointer`}
                    onClick={() => toggleStatus(chamber.id, chamber.is_active)}
                  >
                    {chamber.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    chamber.is_primary ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {chamber.is_primary ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                  <button
                    onClick={() => router.push(`/admin/chambers/${chamber.id}/edit`)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(chamber.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
