'use client';

import React, { useEffect, useState } from 'react';
import { insforge } from '@/lib/insforge';
import { StatusBadge, StatusType } from '@/components/StatusBadge';
import { CounterDisplay } from '@/components/CounterDisplay';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { Info, Lock } from 'lucide-react';

export default function Home() {
  const [currentCount, setCurrentCount] = useState(0);
  const [maxCapacity, setMaxCapacity] = useState(20);
  const [isOpen, setIsOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [stats, setStats] = useState<any>(null);

  let status: StatusType = 'Tancat';
  let theme = 'closed';
  let textMode = 'text-white';
  let counterColor = 'text-white';

  if (isOpen) {
    if (currentCount >= maxCapacity) {
      status = 'Ple';
      theme = 'full';
      counterColor = 'text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.6)]';
    } else if (currentCount >= 15) {
      status = 'Quasi ple';
      theme = 'almost';
      counterColor = 'text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]';
    } else {
      status = 'Lliure';
      theme = 'free';
      counterColor = 'text-emerald-400 drop-shadow-[0_0_25px_rgba(52,211,153,0.6)]';
    }
  }

  const getMeshColors = () => {
    switch (theme) {
      case 'full': return ['bg-rose-500', 'bg-rose-700', 'bg-red-500'];
      case 'almost': return ['bg-amber-400', 'bg-orange-400', 'bg-amber-500'];
      case 'free': return ['bg-emerald-400', 'bg-teal-500', 'bg-emerald-500'];
      default: return ['bg-slate-800', 'bg-navy', 'bg-slate-700'];
    }
  };
  const [c1, c2, c3] = getMeshColors();

  useEffect(() => {
    const fetchSessionAndStats = async () => {
      try {
        const [res, statsRes] = await Promise.all([
          fetch('/api/session'),
          fetch('/api/stats')
        ]);
        if (res.ok) {
          const data = await res.json();
          if (data.session) {
            setCurrentCount(data.session.current_count);
            setMaxCapacity(data.session.max_capacity);
            setIsOpen(data.session.is_open);
            setLastUpdated(new Date(data.session.updated_at));
          }
        }
        if (statsRes.ok) setStats(await statsRes.json());
      } catch (e) {
        console.error(e);
      }
    };
    fetchSessionAndStats();

    const handleRealtimeChanges = (payload: any) => {
      const newRecord = payload.new;
      if (newRecord) {
        setCurrentCount(newRecord.current_count);
        setMaxCapacity(newRecord.max_capacity);
        setIsOpen(newRecord.is_open);
        setLastUpdated(new Date(newRecord.updated_at));
      }
    };
    insforge.realtime.on('postgres_changes', handleRealtimeChanges);
    insforge.realtime.subscribe('public:sessions');
    return () => {
      insforge.realtime.off('postgres_changes', handleRealtimeChanges);
      insforge.realtime.unsubscribe('public:sessions');
    };
  }, []);

  return (
    <main className={`h-[100dvh] w-full flex flex-col p-2 sm:p-4 overflow-hidden relative transition-colors duration-1000 ${textMode}`}>
      <div className="absolute inset-0 z-[-1] overflow-hidden bg-black">
        <div className={`mesh-blob mesh-1 w-[60vh] h-[60vh] -top-[10%] -left-[10%] ${c1} transition-colors duration-1000`} />
        <div className={`mesh-blob mesh-2 w-[50vh] h-[50vh] top-[20%] -right-[10%] ${c2} transition-colors duration-1000`} />
        <div className={`mesh-blob mesh-3 w-[70vh] h-[70vh] -bottom-[20%] left-[10%] ${c3} transition-colors duration-1000`} />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[60px]" />
      </div>

      {/* Header */}
      <div className="w-full flex-none flex justify-between items-center z-20">
        <Logo className="w-10 h-10 sm:w-16 sm:h-16" />
        <Link href="/info" className="p-2 sm:p-2.5 bg-white/20 backdrop-blur-md rounded-full shadow-sm text-current hover:bg-white/30 transition-colors">
          <Info size={18} className="opacity-90 sm:w-5 sm:h-5" />
        </Link>
      </div>

      {/* Compressed Core */}
      <div className="flex-1 w-full max-w-sm mx-auto flex flex-col justify-center gap-y-3 z-10">
        <div className="w-full text-current bg-white/30 backdrop-blur-xl px-4 py-5 sm:p-7 rounded-[1.5rem] shadow-xl border border-white/40 flex flex-col items-center gap-y-3 transition-all duration-500">
          <div className="text-center">
            <h1 className="font-extrabold text-xl sm:text-2xl tracking-tight leading-none drop-shadow-sm">Estat de l'espai</h1>
            <p className="opacity-80 text-[9px] sm:text-xs font-semibold uppercase tracking-widest leading-tight mt-1">Petits Divendres</p>
          </div>

          <div className="scale-75 sm:scale-90 origin-center -my-2 drop-shadow-md">
            <StatusBadge status={status} />
          </div>

          <div className="w-full flex flex-col items-center min-h-[120px] justify-center text-center">
            {isOpen ? (
              <>
                <p className="opacity-70 text-[9px] sm:text-xs font-semibold uppercase tracking-widest shadow-sm">Aforament Actual</p>
                <div className={`scale-90 sm:scale-100 origin-center mt-1 transition-colors duration-1000 ${counterColor}`}>
                  <CounterDisplay currentCount={currentCount} maxCapacity={maxCapacity} />
                </div>
                <p className="opacity-60 text-[10px] sm:text-xs font-medium -mt-1">famílies jugant</p>
                
                {lastUpdated && (
                  <p className="text-[9px] sm:text-xs opacity-50 font-medium px-3 py-0.5 mt-2 bg-black/5 rounded-full">
                    Actualitzat: {lastUpdated.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center py-4 space-y-2 animate-in fade-in zoom-in duration-500">
                <p className="text-base sm:text-xl font-bold leading-tight max-w-[200px] drop-shadow-sm">
                  Petits Divendres està tancat en aquests moments.
                </p>
                <p className="opacity-60 text-[10px] sm:text-xs font-medium">T'esperem el proper divendres!</p>
              </div>
            )}
          </div>
        </div>

        {stats && stats.lastFriday && (
          <div className="w-full text-current bg-white/25 backdrop-blur-xl px-4 py-3 sm:p-6 rounded-[1.25rem] shadow-lg border border-white/30 flex flex-col gap-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[8px] sm:text-xs font-bold uppercase tracking-widest opacity-70 leading-none">Darrer Divendres</p>
                <div className="font-bold text-xs sm:text-base drop-shadow-sm mt-0.5">
                  {new Date(stats.lastFriday.date).toLocaleDateString('ca-ES', { day: 'numeric', month: 'short' })}
                </div>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-lg sm:text-xl drop-shadow-sm leading-none">{stats.lastFriday.current_count} </span>
                <span className="text-[10px] sm:text-sm font-medium">assistents</span>
              </div>
            </div>
            
            {(stats.peakHour || stats.avgDuration > 0) && (
              <div className="flex justify-between border-t border-current/20 pt-2 mt-1">
                {stats.peakHour && (
                  <div className="flex flex-col text-left">
                    <span className="opacity-60 font-semibold text-[8px] sm:text-[10px] uppercase tracking-wide">Punta</span>
                    <span className="font-bold text-[10px] sm:text-sm">{stats.peakHour[0]}</span>
                  </div>
                )}
                {stats.avgDuration > 0 && (
                  <div className="flex flex-col text-right">
                    <span className="opacity-60 font-semibold text-[8px] sm:text-[10px] uppercase tracking-wide">Mitjana</span>
                    <span className="font-bold text-[10px] sm:text-sm">{Math.round(stats.avgDuration)} min</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full flex-none items-center justify-center text-center z-10 pt-2">
        <Link href="/admin/login" className="inline-flex items-center space-x-2 text-[10px] sm:text-sm text-white/50 hover:text-white/80 transition-colors backdrop-blur-md bg-black/20 px-4 py-1.5 rounded-full shadow-sm">
          <Lock size={12} />
          <span>Accés Recepció</span>
        </Link>
      </div>
    </main>
  );
}
