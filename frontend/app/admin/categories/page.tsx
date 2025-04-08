import { Suspense } from 'react';
import CategoryList from './components/CategoryList';
import CategoryForm from './components/CategoryForm';

export default function CategoryManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>
      <div className="grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
          <CategoryForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <CategoryList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
