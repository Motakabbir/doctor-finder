'use client';

import { useState, useEffect } from 'react';
import { Blog } from '../types';

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/admin/blogs');
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete blog');
      await fetchBlogs();
    } catch (err) {
      setError('Failed to delete blog');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <div key={blog.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{blog.title}</h3>
              <p className="text-gray-600">{blog.excerpt}</p>
              <div className="mt-2 text-sm text-gray-500">
                <span>Category: {blog.category}</span>
                <span className="mx-2">•</span>
                <span>Published: {blog.is_published ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleDelete(blog.id)}
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
