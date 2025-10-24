import React, { useState } from 'react';

const InputForm = ({ onGenerateBlueprint, isLoading }) => {
  const [formData, setFormData] = useState({
    area: '',
    shape: 'rectangle',
    location: '',
    floors: 1
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.area && formData.area > 0) {
      onGenerateBlueprint({
        area: parseFloat(formData.area),
        shape: formData.shape,
        location: formData.location,
        floors: parseInt(formData.floors),
        buildingType: formData.buildingType
      });
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Configuration</h2>
          <p className="text-gray-600">Configure your building parameters for AI-powered blueprint generation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="area" className="block text-sm font-semibold text-gray-700">
              <span className="flex items-center space-x-2">
                <span>Plot Area</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Required</span>
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                placeholder="Enter area in square feet"
                min="100"
                max="10000"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                sq ft
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="shape" className="block text-sm font-semibold text-gray-700">
              Plot Shape
            </label>
            <select
              id="shape"
              name="shape"
              value={formData.shape}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50"
            >
              <option value="rectangle">📐 Rectangle</option>
              <option value="square">⬜ Square</option>
              <option value="custom">🎨 Custom Shape</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="buildingType" className="block text-sm font-semibold text-gray-700">
              Building Type
            </label>
            <select
              id="buildingType"
              name="buildingType"
              value={formData.buildingType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50"
            >
              <option value="residential">🏠 Residential</option>
              <option value="hotel">🏨 Hotel</option>
              <option value="school">🏫 School</option>
              <option value="bank">🏦 Bank</option>
            </select>
          </div>


          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
              <span className="flex items-center space-x-2">
                <span>Location</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Optional</span>
              </span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, State (for context)"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="floors" className="block text-sm font-semibold text-gray-700">
              Number of Floors
            </label>
            <div className="relative">
              <input
                type="number"
                id="floors"
                name="floors"
                value={formData.floors}
                onChange={handleInputChange}
                min="1"
                max="5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                floors
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading || !formData.area}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <span className="flex items-center justify-center space-x-3">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>AI is generating your blueprint...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Generate AI Blueprint</span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
