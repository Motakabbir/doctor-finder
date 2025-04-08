import { Suspense } from 'react';
import FaqList from './components/FaqList';
import FaqForm from './components/FaqForm';

export default function FaqManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">FAQ Management</h1>
      <div className="grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Create New FAQ</h2>
          <FaqForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">FAQs</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <FaqList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
