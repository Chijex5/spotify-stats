import React from 'react';

const PlaylistItemSkeleton: React.FC = () => {
  return (
    <div className="bg-white bg-opacity-70 rounded-lg overflow-hidden shadow-md border border-gray-100">
      <div className="aspect-square bg-gray-200 animate-pulse"></div>
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mt-2 animate-pulse"></div>
      </div>
    </div>
  );
};

export default PlaylistItemSkeleton;