import React from 'react';

const TailwindTest = () => {
  return (
    <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2">TailwindCSS Test</h2>
      <p className="text-blue-100">If you can see this styled component, TailwindCSS is working!</p>
      <div className="mt-4 flex space-x-2">
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors">
          Success
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors">
          Error
        </button>
      </div>
    </div>
  );
};

export default TailwindTest;
