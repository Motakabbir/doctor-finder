'use client';

import { useState } from 'react';

export default function PageForm() {
  const [formData, setFormData] = useState({
    title: '',
    content: {},
    meta_title: '',
    meta_description: '',
    is_active: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create page');
      
      setSuccess('Page created successfully');
      setFormData({
        title: '',
        content: {},
        meta_title: '',
        meta_description: '',
        is_active: true,
      });
    } catch (err) {
      setError('Failed to create page');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Content (JSON)</label>
        <textarea
          value={JSON.stringify(formData.content, null, 2)}
          onChange={(e) => {
            try {
              const content = JSON.parse(e.target.value);
              setFormData({ ...formData, content });
              setError('');
            } catch (err) {
              setError('Invalid JSON format');
            }
          }}
          className="w-full p-2 border rounded font-mono"
          rows={6}
          placeholder="{}"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Meta Title</label>
        <input
          type="text"
          value={formData.meta_title}
          onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Meta Description</label>
        <textarea
          value={formData.meta_description}
          onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
          className="w-full p-2 border rounded"
          rows={2}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="mr-2"
        />
        <label className="text-sm font-medium">Active</label>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Page
      </button>
    </form>
  );
}
