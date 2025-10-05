import React from 'react';

const StatusBadge = ({ status, size = 'default' }) => {
  const statusConfig = {
    'not-studied': {
      label: 'Não Estudado',
      className: 'bg-gray-100 text-gray-700 border-gray-200'
    },
    'studying': {
      label: 'Estudando',
      className: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    'review': {
      label: 'Revisão',
      className: 'bg-amber-100 text-amber-700 border-amber-200'
    },
    'mastered': {
      label: 'Dominado',
      className: 'bg-green-100 text-green-700 border-green-200'
    }
  };

  const config = statusConfig?.[status] || statusConfig?.['not-studied'];
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${config?.className} ${sizeClasses}`}>
      {config?.label}
    </span>
  );
};

export default StatusBadge;