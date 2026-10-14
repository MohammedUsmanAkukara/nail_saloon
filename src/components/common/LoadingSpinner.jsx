import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-2',
    lg: 'w-16 h-16 border-3',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div
        className={`${sizeClasses} border-[#F2DDE1] border-t-[#572A39] rounded-full animate-spin`}
      ></div>
      {text && (
        <p className="mt-4 text-xs uppercase tracking-widest text-[#572A39]/70 font-medium">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
