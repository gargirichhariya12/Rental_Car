import React from 'react';

const fieldInputClasses = 'relative z-10 px-3 py-2 mt-1 bg-black/40 text-gray-400 focus:outline-none w-full rounded-lg';

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
}) => {
  const sharedProps = {
    value,
    onChange,
    placeholder,
    min,
    accept,
    className: fieldInputClasses,
  };

  return (
    <div className='flex flex-col w-full'>
      <label className='text-lg'>{label}</label>
      <div className='gradient-border mt-1'>
        {textarea ? (
          <textarea {...sharedProps} />
        ) : options ? (
          <select {...sharedProps}>
            {options.map((option) => (
              <option key={option.value} value={option.value} className='bg-black/40 text-white'>
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
