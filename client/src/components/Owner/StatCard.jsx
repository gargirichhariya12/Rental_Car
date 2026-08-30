import React from 'react';

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-gradient-to-r from-[#0F0C29] via-[#302B63] to-[#24243E] p-5 shadow-lg">
      <div>
        <h1 className="text-sm text-gray-300">{title}</h1>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-blue-600 shadow">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
