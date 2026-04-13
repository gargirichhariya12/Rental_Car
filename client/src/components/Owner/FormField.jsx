import React from 'react';

const fieldInputClasses = 'relative z-10 mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40';

const FormField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  options,
  textarea = false,
  min,
  accept,
  id,
  name,
  required = false,
  rows = 4,
  step,
}) => {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');
  const sharedProps = {
    id: fieldId,
    name,
    value,
    onChange,
    placeholder,
    min,
    accept,
    required,
    step,
    className: fieldInputClasses,
  };

  return (
    <div className='flex flex-col w-full'>
      <label htmlFor={fieldId} className='text-base font-medium text-gray-200'>{label}</label>
      <div className='mt-1'>
        {textarea ? (
          <textarea {...sharedProps} rows={rows} />
        ) : options ? (
          <select {...sharedProps}>
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
          <input type={type} {...sharedProps} />
        )}
      </div>
    </div>
  );
};

export default FormField;
