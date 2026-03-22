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
    <div className="w-full space-y-6 mt-8">
      <h3 className="text-xl font-bold text-navy/90 text-center drop-shadow-sm">Estadístiques Clau</h3>
      
      <div className="bg-white/85 backdrop-blur-2xl p-6 rounded-3xl shadow-xl border border-white/50">
        <h4 className="text-sm uppercase tracking-widest text-navy/70 font-semibold mb-4">Darrers Divendres Oferts</h4>
        <div className="space-y-3">
          {stats.history.length === 0 && <p className="text-sm text-navy/60">Encara sense historial.</p>}
          {stats.history.map((h: any, i: number) => (
            <div key={i} className="flex justify-between items-center text-navy border-b border-navy/10 pb-3 font-medium last:border-0 last:pb-0">
              <span className={h.is_open ? 'text-emerald-600 font-bold' : ''}>
                {new Date(h.date).toLocaleDateString('ca-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
              <span>{h.current_count} assistents</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/85 backdrop-blur-2xl p-6 rounded-3xl shadow-xl border border-white/50 mb-8">
        <h4 className="text-sm uppercase tracking-widest text-navy/70 font-semibold mb-4">Els Més Assistents (Top 5)</h4>
        <div className="space-y-3">
          {stats.frequentChildren.length === 0 && <p className="text-sm text-navy/60">No hi ha dades arxivades suficients.</p>}
          {stats.frequentChildren.map((child: any, i: number) => (
            <div key={i} className="flex justify-between items-center text-navy border-b border-navy/10 pb-3 last:border-0 last:pb-0">
              <span className="font-semibold">{i + 1}. {child.name}</span>
              <span className="text-navy/80 text-sm bg-navy/5 px-2 py-1 rounded-lg">{child.count} visites</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
