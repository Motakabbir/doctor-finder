import { Suspense } from 'react';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';

export default function BlogManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Blog Management</h1>
      <div className="grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Create New Blog Post</h2>
          <BlogForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Blog Posts</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <BlogList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
