import React from 'react';

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-[#0F0C29] via-[#302B63] to-[#24243E] border border-white/20 shadow-lg">
      <div>
        <h1 className="text-sm text-gray-300">{title}</h1>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>

      <div className="flex items-center justify-center w-11 h-11 rounded-full bg-white text-blue-600 shadow">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
