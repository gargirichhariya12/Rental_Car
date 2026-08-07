import React, { useRef } from 'react';
import { CalendarDays } from 'lucide-react';

const DateInput = ({
  id,
  label,
  value,
  onChange,
  min,
  required = false,
  className = '',
}) => {
  const inputRef = useRef(null);

  const openPicker = () => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.focus();

    if (typeof inputRef.current.showPicker === 'function') {
      inputRef.current.showPicker();
      return;
    }

    inputRef.current.click();
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-white">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="date"
          min={min}
          value={value}
          onChange={onChange}
          required={required}
          className="date-input w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white outline-none transition-colors focus:border-red-500"
        />
        <button
          type="button"
          onClick={openPicker}
          aria-label={`Open ${label || 'date'} picker`}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-300 transition-colors hover:text-white"
        >
          <CalendarDays size={18} />
        </button>
      </div>
    </div>
  );
};

export default DateInput;
