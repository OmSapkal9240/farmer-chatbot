// @/src/components/LoadingSkeleton.jsx

import React from 'react';

const SkeletonElement = ({ className }) => <div className={`bg-gray-700/50 rounded-md animate-pulse ${className}`} />;

const LoadingSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6">
      {/* Sidebar Skeleton */}
      <aside className="w-full lg:w-1/3 lg:max-w-sm mb-6 lg:mb-0">
        <div className="bg-[#0f1b2e]/60 border border-teal-900/50 rounded-lg p-4 backdrop-blur-sm space-y-4">
          <SkeletonElement className="h-6 w-3/4" />
          <SkeletonElement className="h-4 w-1/2" />
          <div className="space-y-2 pt-2">
            <SkeletonElement className="h-16 w-full" />
            <SkeletonElement className="h-16 w-full" />
            <SkeletonElement className="h-16 w-full" />
          </div>
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="w-full lg:w-2/3">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3 space-y-6">
            <div className="bg-[#0f1b2e]/60 border border-teal-900/50 rounded-lg p-6 backdrop-blur-sm space-y-4">
              <SkeletonElement className="h-8 w-1/2" />
              <div className="grid grid-cols-3 gap-4">
                <SkeletonElement className="h-20" />
                <SkeletonElement className="h-20" />
                <SkeletonElement className="h-20" />
              </div>
              <SkeletonElement className="h-6 w-1/3 mt-4" />
              <SkeletonElement className="h-4 w-full" />
              <SkeletonElement className="h-4 w-full" />
              <SkeletonElement className="h-4 w-5/6" />
            </div>
          </div>
          <div className="lg:w-1/3">
            <div className="bg-[#0f1b2e]/80 border border-teal-900/50 rounded-lg p-4 space-y-4 backdrop-blur-sm">
              <SkeletonElement className="h-6 w-3/4" />
              <div className="flex gap-4">
                <SkeletonElement className="w-20 h-20 flex-shrink-0" />
                <div className="flex-grow space-y-2">
                  <SkeletonElement className="h-4 w-full" />
                  <SkeletonElement className="h-3 w-1/4" />
                  <SkeletonElement className="h-3 w-1/2" />
                </div>
              </div>
              <div className="flex gap-4">
                <SkeletonElement className="w-20 h-20 flex-shrink-0" />
                <div className="flex-grow space-y-2">
                  <SkeletonElement className="h-4 w-full" />
                  <SkeletonElement className="h-3 w-1/4" />
                  <SkeletonElement className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoadingSkeleton;
