import React from 'react';

const TrackItemSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col space-y-2 p-3 border-b border-gray-100">
      <div className="flex items-center">
        <div className="w-8 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="ml-2 h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="ml-4 flex-1">
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
        <div className="h-6 w-12 bg-gray-200 rounded-full ml-4 animate-pulse"></div>
      </div>
      <div className="pl-8 md:pl-16">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default TrackItemSkeleton;