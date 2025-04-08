'use client';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

export default function LoadingSpinner({ fullScreen = false, message = 'Loading...' }: LoadingSpinnerProps) {
  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-4';

  return (
    <div className={containerClasses}>
      <div className="bg-white rounded-lg p-4 flex flex-col items-center space-y-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
}
