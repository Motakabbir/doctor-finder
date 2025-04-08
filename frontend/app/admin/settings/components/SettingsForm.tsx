'use client';

import { useState } from 'react';

export default function SettingsForm() {
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    group: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let parsedValue = formData.value;
      try {
        // Attempt to parse as JSON if it looks like JSON
        if (formData.value.trim().startsWith('{') || 
            formData.value.trim().startsWith('[')) {
          parsedValue = JSON.parse(formData.value);
        }
      } catch (err) {
        // If parsing fails, use the original string value
      }

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          value: parsedValue,
        }),
      });

      if (!response.ok) throw new Error('Failed to create setting');
      
      setSuccess('Setting created successfully');
      setFormData({
        key: '',
        value: '',
        group: '',
      });
    } catch (err) {
      setError('Failed to create setting');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      
      <div>
        <label className="block text-sm font-medium mb-1">Key</label>
        <input
          type="text"
          value={formData.key}
          onChange={(e) => setFormData({ ...formData, key: e.target.value })}
          className="w-full p-2 border rounded"
          required
          placeholder="e.g., site.title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Value</label>
        <textarea
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          className="w-full p-2 border rounded font-mono"
          rows={4}
          required
          placeholder="String value or JSON"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Group</label>
        <input
          type="text"
          value={formData.group}
          onChange={(e) => setFormData({ ...formData, group: e.target.value })}
          className="w-full p-2 border rounded"
          placeholder="e.g., general"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Setting
      </button>
    </form>
  );
}
