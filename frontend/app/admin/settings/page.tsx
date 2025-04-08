import { Suspense } from 'react';
import SettingsList from './components/SettingsList';
import SettingsForm from './components/SettingsForm';

export default function SettingsManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings Management</h1>
      <div className="grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Create New Setting</h2>
          <SettingsForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <SettingsList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
