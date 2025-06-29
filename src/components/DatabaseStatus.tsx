import React from 'react';
import { Database, AlertCircle, CheckCircle, Loader, ExternalLink } from 'lucide-react';

interface DatabaseStatusProps {
  connected: boolean;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export const DatabaseStatus: React.FC<DatabaseStatusProps> = ({
  connected,
  loading,
  error,
  onRetry
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-3 text-white">
          <Loader size={24} className="animate-spin" style={{ color: '#ddb870' }} />
          <span>Connecting to database...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="flex items-center space-x-3 text-red-400 mb-4">
          <AlertCircle size={24} />
          <span className="text-lg font-semibold">Database Connection Failed</span>
        </div>
        <p className="text-white/70 mb-4 max-w-md">
          {error}
        </p>
        <p className="text-white/60 text-sm mb-6">
          To connect to Supabase and see recipe data, click the "Connect to Supabase" button in the top right corner.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-2 text-white rounded-lg transition-colors"
              style={{ backgroundColor: '#ddb870' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ebdcb5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ddb870'}
            >
              Retry Connection
            </button>
          )}
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <ExternalLink size={16} />
            <span>Learn about Supabase</span>
          </a>
        </div>
      </div>
    );
  }

  if (connected) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="flex items-center space-x-3 text-green-400">
          <CheckCircle size={20} />
          <span className="text-sm">Database connected successfully</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="flex items-center space-x-3 text-white/60 mb-4">
        <Database size={24} />
        <span className="text-lg">Database not connected</span>
      </div>
      <p className="text-white/60 text-sm mb-6 max-w-md">
        Connect to Supabase to see recipe carousels organized by cuisine type. Click the "Connect to Supabase" button in the top right corner to get started.
      </p>
      <a
        href="https://supabase.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
      >
        <ExternalLink size={16} />
        <span>Learn about Supabase</span>
      </a>
    </div>
  );
};