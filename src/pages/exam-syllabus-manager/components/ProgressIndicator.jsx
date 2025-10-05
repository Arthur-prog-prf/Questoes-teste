import React from 'react';

const ProgressIndicator = ({ percentage, label, size = 'default' }) => {
  const sizeClasses = {
    sm: 'h-2',
    default: 'h-3',
    lg: 'h-4'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="w-full">
      <div className={`flex items-center justify-between mb-1 ${textSizeClasses?.[size]}`}>
        <span className="text-text-secondary font-medium">{label}</span>
        <span className="text-foreground font-semibold">{percentage}%</span>
      </div>
      <div className={`w-full bg-muted rounded-full ${sizeClasses?.[size]}`}>
        <div
          className={`bg-primary rounded-full transition-all duration-300 ${sizeClasses?.[size]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;