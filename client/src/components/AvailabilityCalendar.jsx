import React from 'react';
import StatusBadge from './StatusBadge';

const formatShortDate = (value) =>
  new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const toDateKey = (date) => date.toISOString().split('T')[0];

const isDateBlocked = (dateKey, blockedRanges) =>
  blockedRanges.some((range) => dateKey >= range.startDate && dateKey < range.endDate);

const isDateSelected = (dateKey, selection) => {
  if (!selection.pickupDate) return false;
  if (!selection.returnDate) return dateKey === selection.pickupDate;
  return dateKey >= selection.pickupDate && dateKey <= selection.returnDate;
};

function AvailabilityCalendar({ blockedRanges = [], selection }) {
  const days = Array.from({ length: 28 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + index);

    const key = toDateKey(date);
    return {
      key,
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      day: date.getDate(),
      blocked: isDateBlocked(key, blockedRanges),
      selected: isDateSelected(key, selection),
    };
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Next 4 weeks</h3>
          <p className="text-xs text-gray-400">Unavailable dates are marked before you book.</p>
        </div>
        <StatusBadge label={blockedRanges.length ? 'Live availability' : 'Open schedule'} tone="info" />
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div
            key={day.key}
            className={[
              'rounded-xl border px-2 py-3 text-center text-xs transition-colors',
              day.blocked ? 'border-red-500/30 bg-red-500/10 text-red-200' : 'border-white/10 bg-black/20 text-gray-200',
              day.selected && !day.blocked ? 'border-indigo-400 bg-indigo-500/20 text-white' : '',
            ].join(' ')}
          >
            <div className="text-[10px] uppercase tracking-wide text-gray-500">{day.label}</div>
            <div className="mt-1 text-sm font-semibold">{day.day}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Blocked ranges</h4>
        {blockedRanges.length ? (
          blockedRanges.slice(0, 4).map((range) => (
            <div key={`${range.startDate}-${range.endDate}`} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm">
              <span className="text-gray-200">
                {formatShortDate(range.startDate)} - {formatShortDate(range.endDate)}
              </span>
              <StatusBadge label={range.status} />
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">No blocked dates right now.</p>
        )}
      </div>
    </div>
  );
}

export default AvailabilityCalendar;
