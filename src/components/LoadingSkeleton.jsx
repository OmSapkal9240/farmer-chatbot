import React from 'react';

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
    <div className="flex flex-col lg:flex-row lg:space-x-6">
      <div className="w-full lg:w-1/3 lg:max-w-sm mb-6 lg:mb-0">
        <div className="bg-black/20 p-4 rounded-lg h-full space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/2"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
          <div className="h-40 bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="w-full lg:w-2/3">
        <div className="bg-gradient-to-br from-[#0f1b2e] to-[#132b45] border border-teal-300/20 rounded-lg p-6">
          <div className="h-48 bg-gray-700 rounded mb-6"></div>
          <div className="flex justify-between mb-4">
            <div className="h-10 bg-gray-700 rounded w-1/2"></div>
            <div className="h-10 bg-gray-700 rounded w-1/4"></div>
          </div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;
