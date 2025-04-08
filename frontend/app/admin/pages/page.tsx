import { Suspense } from 'react';
import PageList from './components/PageList';
import PageForm from './components/PageForm';

export default function PageManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Page Management</h1>
      <div className="grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Create New Page</h2>
          <PageForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Pages</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <PageList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
