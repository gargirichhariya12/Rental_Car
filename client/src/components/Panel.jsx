import React from 'react';

const toneClasses = {
  default: 'border-gray-800 bg-gray-900',
  soft: 'border-white/10 bg-white/[0.03]',
  glass: 'border-gray-800 bg-gray-900/50 backdrop-blur-xl',
};

const Panel = ({
  children,
  className = '',
  tone = 'default',
  padding = 'p-6',
  rounded = 'rounded-3xl',
  borderStyle = 'border',
}) => {
  return (
    <div
      className={[
        borderStyle,
        rounded,
        padding,
        toneClasses[tone] || toneClasses.default,
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
};

export default Panel;
