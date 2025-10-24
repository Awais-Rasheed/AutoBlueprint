import React, { useState } from 'react';
import axios from 'axios';
import InputForm from './components/InputForm';
import Blueprint2D from './components/Blueprint2D';
import Blueprint3D from './components/Blueprint3D';

function App() {
  const [blueprint, setBlueprint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'

  const generateBlueprint = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:3001/api/generate-blueprint', formData);
      
      if (response.data.success) {
        setBlueprint(response.data.blueprint);
      } else {
        setError('Failed to generate blueprint');
      }
    } catch (err) {
      console.error('Error generating blueprint:', err);
      setError('Failed to connect to the server. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (data, filename) => {
    if (data) {
      const link = document.createElement('a');
      link.href = data;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For 3D exports, this would typically download a GLTF file
      console.log('3D export functionality would be implemented here');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AutoBlueprint
                </h1>
                <p className="text-gray-600 font-medium">AI-Powered Building Design</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {blueprint && (
                <div className="hidden md:flex items-center space-x-4 bg-gray-50 rounded-xl px-4 py-2">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{blueprint.totalArea} sq ft</span>
                    <span className="mx-2">•</span>
                    <span>{blueprint.plotDimensions.width} × {blueprint.plotDimensions.height} ft</span>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">AI Ready</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Form */}
        <InputForm onGenerateBlueprint={generateBlueprint} isLoading={isLoading} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blueprint Results */}
        {blueprint && (
          <div className="space-y-8">
            {/* Enhanced View Toggle */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Blueprint Views</h3>
                  <p className="text-gray-600">Switch between 2D and 3D visualizations</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>AI Generated</span>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setViewMode('2d')}
                  className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] ${
                    viewMode === '2d'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>📐</span>
                    <span>2D Blueprint</span>
                  </span>
                </button>
                <button
                  onClick={() => setViewMode('3d')}
                  className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] ${
                    viewMode === '3d'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>🏗️</span>
                    <span>3D Visualization</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Blueprint Display */}
            {viewMode === '2d' ? (
              <Blueprint2D blueprint={blueprint} onExport={handleExport} />
            ) : (
              <Blueprint3D blueprint={blueprint} onExport={handleExport} />
            )}

            {/* Enhanced Blueprint Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">AI Blueprint Analysis</h3>
                  <p className="text-gray-600">Detailed breakdown of your generated blueprint</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🏠</span>
                    </div>
                    <h4 className="font-bold text-gray-900">Rooms</h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mb-2">{blueprint.rooms.length}</p>
                  <div className="space-y-1">
                    {blueprint.rooms.map((room, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{room.name}</span>
                        <span className="font-medium text-gray-900">{Math.round(room.width * room.height)} sq ft</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🧱</span>
                    </div>
                    <h4 className="font-bold text-gray-900">Structure</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-600 mb-2">{blueprint.walls.length}</p>
                  <p className="text-sm text-gray-600">Wall segments</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🚪</span>
                    </div>
                    <h4 className="font-bold text-gray-900">Openings</h4>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 mb-2">
                    {blueprint.rooms.reduce((total, room) => total + room.doors.length, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Doors</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🪟</span>
                    </div>
                    <h4 className="font-bold text-gray-900">Windows</h4>
                  </div>
                  <p className="text-2xl font-bold text-orange-600 mb-2">
                    {blueprint.rooms.reduce((total, room) => total + room.windows.length, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Window openings</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>AutoBlueprint - AI-powered building design tool</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
