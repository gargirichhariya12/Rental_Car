import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className = '',
}) => {
  const Icon = icon || Inbox;

  return (
    <div className={`rounded-3xl border border-dashed border-gray-800 bg-gray-900/30 px-6 py-16 text-center ${className}`.trim()}>
      <div className='mb-4 flex justify-center'>
        <div className='rounded-2xl bg-white/[0.03] p-4 text-gray-500'>
          <Icon className='h-8 w-8' />
        </div>
      </div>
      <h3 className='text-lg font-semibold text-white'>{title}</h3>
      {description && <p className='mt-2 text-sm text-gray-400'>{description}</p>}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant='link'
          className='mt-6 font-semibold'
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
