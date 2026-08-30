import React from "react";

export default function HighlightCard({ icon, title, points }) {
  return (
    <div className="group relative w-full max-w-[270px] rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_60px_rgba(2,8,23,0.55)] transition-transform duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,rgba(76,74,224,0.22),transparent_55%)] opacity-80" />
      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-border text-red-600">
          {icon}
        </div>
        <h3 className="text-lg font-bold gradient-text">
          {title}
        </h3>
        <ul className="space-y-1 text-sm text-[#AEB7ED]">
          {points.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
