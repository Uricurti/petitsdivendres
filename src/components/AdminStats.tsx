import React, { useEffect, useState } from 'react';

export const AdminStats = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  if (!stats) return <div className="animate-pulse h-48 bg-white/40 backdrop-blur-xl rounded-3xl w-full border border-white/40"></div>;

  return (
    <div className="w-full">
      <div className="bg-white/60 backdrop-blur-2xl p-4 sm:p-5 rounded-3xl shadow-lg border border-white/50">
        <h4 className="text-[11px] uppercase tracking-widest text-navy/70 font-bold mb-3 flex items-center space-x-2">
          <span>Històric de Sessions</span>
        </h4>
        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
          {stats.history.length === 0 && <p className="text-xs text-navy/60 italic">Encara sense historial.</p>}
          {stats.history.map((h: any, i: number) => (
            <div key={i} className="flex justify-between items-center text-sm text-navy border-b border-navy/10 pb-2 font-medium last:border-0 last:pb-0">
              <span className={h.is_open ? 'text-emerald-600 font-bold' : ''}>
                {new Date(h.date).toLocaleDateString('ca-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
              <span className="bg-navy/5 px-2 py-0.5 rounded-md text-xs">{h.current_count} assistents</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
