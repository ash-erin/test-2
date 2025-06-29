import React, { useState } from 'react';
import { Download, Upload, RotateCcw, Save, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useProjectState } from '../hooks/useProjectState';

interface StateManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StateManager: React.FC<StateManagerProps> = ({ isOpen, onClose }) => {
  const {
    state,
    loading,
    error,
    saving,
    resetState,
    exportState,
    importState,
    getStatistics
  } = useProjectState();

  const [importFile, setImportFile] = useState<File | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const statistics = getStatistics();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
  };

  const handleImport = async () => {
    if (importFile) {
      await importState(importFile);
      setImportFile(null);
    }
  };

  const handleReset = async () => {
    await resetState();
    setShowConfirmReset(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(8, 25, 50, 0.8)' }}>
      <div className="rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#0f2f5f' }}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-white text-2xl font-bold">State Management</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors p-2"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Section */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Current Status</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#081932' }}>
                <div className="flex items-center space-x-2 mb-2">
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-500 border-t-transparent"></div>
                  ) : error ? (
                    <AlertCircle size={16} className="text-red-400" />
                  ) : (
                    <CheckCircle size={16} className="text-green-400" />
                  )}
                  <span className="text-white font-medium">
                    {loading ? 'Loading...' : error ? 'Error' : 'Ready'}
                  </span>
                </div>
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#081932' }}>
                <div className="flex items-center space-x-2 mb-2">
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                  ) : (
                    <Save size={16} style={{ color: '#ddb870' }} />
                  )}
                  <span className="text-white font-medium">
                    {saving ? 'Saving...' : 'Auto-save Active'}
                  </span>
                </div>
                <p className="text-white/60 text-sm">
                  State is automatically saved every 30 seconds
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          {statistics && (
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">Statistics</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#081932' }}>
                  <div className="text-2xl font-bold" style={{ color: '#ddb870' }}>
                    {statistics.myListCount}
                  </div>
                  <div className="text-white/60 text-sm">My List Items</div>
                </div>
                
                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#081932' }}>
                  <div className="text-2xl font-bold" style={{ color: '#ddb870' }}>
                    {statistics.likedMoviesCount}
                  </div>
                  <div className="text-white/60 text-sm">Liked Movies</div>
                </div>
                
                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#081932' }}>
                  <div className="text-2xl font-bold" style={{ color: '#ddb870' }}>
                    {statistics.searchHistoryCount}
                  </div>
                  <div className="text-white/60 text-sm">Searches</div>
                </div>
                
                <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#081932' }}>
                  <div className="text-2xl font-bold" style={{ color: '#ddb870' }}>
                    {statistics.viewingHistoryCount}
                  </div>
                  <div className="text-white/60 text-sm">Views</div>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#081932' }}>
                <h4 className="text-white font-medium mb-2">Session Information</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Version:</span>
                    <span className="text-white">{statistics.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Last Saved:</span>
                    <span className="text-white">
                      {new Date(statistics.lastSaved).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Session ID:</span>
                    <span className="text-white font-mono text-xs">
                      {statistics.sessionId.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions Section */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Actions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Export */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#081932' }}>
                <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
                  <Download size={16} />
                  <span>Export State</span>
                </h4>
                <p className="text-white/60 text-sm mb-3">
                  Download your current state as a backup file
                </p>
                <button
                  onClick={exportState}
                  disabled={!state}
                  className="w-full px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#ddb870' }}
                  onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#ebdcb5')}
                  onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#ddb870')}
                >
                  Export State
                </button>
              </div>

              {/* Import */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#081932' }}>
                <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
                  <Upload size={16} />
                  <span>Import State</span>
                </h4>
                <p className="text-white/60 text-sm mb-3">
                  Restore state from a backup file
                </p>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                    className="w-full text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-700 file:text-white hover:file:bg-gray-600"
                  />
                  {importFile && (
                    <button
                      onClick={handleImport}
                      className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Import {importFile.name}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Reset */}
            <div className="p-4 rounded-lg border border-red-500/30" style={{ backgroundColor: '#081932' }}>
              <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
                <RotateCcw size={16} />
                <span>Reset State</span>
              </h4>
              <p className="text-white/60 text-sm mb-3">
                Clear all saved data and return to default state. This action cannot be undone.
              </p>
              
              {!showConfirmReset ? (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Reset State
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-red-400 text-sm font-medium">
                    Are you sure? This will delete all your data.
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Yes, Reset
                    </button>
                    <button
                      onClick={() => setShowConfirmReset(false)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#081932' }}>
            <div className="flex items-start space-x-2">
              <Info size={16} className="text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-white font-medium mb-1">How State Persistence Works</h4>
                <ul className="text-white/60 text-sm space-y-1">
                  <li>• Your preferences and data are automatically saved every 30 seconds</li>
                  <li>• State is also saved when you close the browser tab</li>
                  <li>• Data includes your list, likes, search history, and app settings</li>
                  <li>• Backup files are created before each save for data protection</li>
                  <li>• All data is stored locally in your browser</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};