import React from 'react';

const toneClasses = {
  success: 'bg-green-500/10 text-green-500',
  warning: 'bg-yellow-500/10 text-yellow-500',
  danger: 'bg-red-500/10 text-red-500',
  info: 'bg-blue-500/10 text-blue-500',
  neutral: 'bg-gray-800 text-gray-300',
};

const inferToneFromLabel = (label = '') => {
  const normalizedLabel = String(label).toLowerCase();

  if (['confirmed', 'completed', 'paid', 'available', 'success'].includes(normalizedLabel)) {
    return 'success';
  }

  if (['pending', 'warning', 'processing'].includes(normalizedLabel)) {
    return 'warning';
  }

  if (['cancelled', 'failed', 'unavailable', 'error'].includes(normalizedLabel)) {
    return 'danger';
  }

  return 'neutral';
};

const StatusBadge = ({ label, tone, className = '' }) => {
  const resolvedTone = tone || inferToneFromLabel(label);

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${toneClasses[resolvedTone] || toneClasses.neutral} ${className}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
