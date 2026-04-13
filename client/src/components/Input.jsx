import React from 'react';

const baseClasses =
  'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors placeholder:text-gray-500 focus:border-indigo-500';

const Input = ({
  label,
  id,
  icon = null,
  className = '',
  wrapperClassName = '',
  textarea = false,
  rows = 4,
  options = null,
  ...props
}) => {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const hasIcon = Boolean(icon);

  const sharedClassName = [
    baseClasses,
    hasIcon ? 'pl-12' : '',
    className,
  ].filter(Boolean).join(' ');

  const field = textarea ? (
    <textarea id={fieldId} rows={rows} className={sharedClassName} {...props} />
  ) : options ? (
    <select id={fieldId} className={sharedClassName} {...props}>
      {options.map((option) => (
        <option
          key={option.value || option.label}
          value={option.value}
          disabled={option.value === ''}
          className='bg-black text-white'
        >
          {option.label}
        </option>
      ))}
    </select>
  ) : (
    <input id={fieldId} className={sharedClassName} {...props} />
  );

  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={fieldId} className='mb-2 block text-sm font-semibold text-white'>
          {label}
        </label>
      )}
      <div className='relative'>
        {hasIcon && (
          <div className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500'>
            {icon}
          </div>
        )}
        {field}
      </div>
    </div>
  );
};

export default Input;
