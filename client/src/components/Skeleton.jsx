import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-white/5 rounded-2xl ${className}`}></div>
  );
};

export const CardSkeleton = () => (
  <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
    <div className="flex justify-between mb-4">
      <Skeleton className="w-12 h-12" />
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
    <Skeleton className="w-24 h-4 mb-2" />
    <Skeleton className="w-32 h-8" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-4 w-full">
    {Array(rows).fill(0).map((_, i) => (
      <div key={i} className="flex gap-4 items-center">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-1/3 h-4" />
          <Skeleton className="w-1/4 h-3" />
        </div>
        <Skeleton className="w-20 h-8 rounded-xl" />
      </div>
    ))}
  </div>
);

export default Skeleton;
