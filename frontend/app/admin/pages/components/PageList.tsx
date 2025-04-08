'use client';

import { useState, useEffect } from 'react';

interface Page {
  id: number;
  title: string;
  slug: string;
  content: any;
  meta_title: string;
  meta_description: string;
  is_active: boolean;
}

export default function PageList() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/pages');
      if (!response.ok) throw new Error('Failed to fetch pages');
      const data = await response.json();
      setPages(data);
    } catch (err) {
      setError('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const response = await fetch(`/api/admin/pages/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete page');
      await fetchPages();
    } catch (err) {
      setError('Failed to delete page');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      {pages.map((page) => (
        <div key={page.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{page.title}</h3>
              <p className="text-gray-600">Slug: {page.slug}</p>
              <div className="mt-2 text-sm text-gray-500">
                <span>Meta Title: {page.meta_title}</span>
                <span className="mx-2">•</span>
                <span>Status: {page.is_active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleDelete(page.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
