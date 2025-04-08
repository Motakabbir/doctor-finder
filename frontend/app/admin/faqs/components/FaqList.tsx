'use client';

import { useState, useEffect } from 'react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  order: number;
}

export default function FaqList() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await fetch('/api/admin/faqs');
      if (!response.ok) throw new Error('Failed to fetch FAQs');
      const data = await response.json();
      setFaqs(data);
    } catch (err) {
      setError('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const response = await fetch(`/api/admin/faqs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete FAQ');
      await fetchFaqs();
    } catch (err) {
      setError('Failed to delete FAQ');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      {faqs.map((faq) => (
        <div key={faq.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              <p className="text-gray-600 mt-2">{faq.answer}</p>
              <div className="mt-2 text-sm text-gray-500">
                <span>Category: {faq.category}</span>
                <span className="mx-2">•</span>
                <span>Order: {faq.order}</span>
                <span className="mx-2">•</span>
                <span>Status: {faq.is_active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleDelete(faq.id)}
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
