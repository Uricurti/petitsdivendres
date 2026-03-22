'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { insforge } from '@/lib/insforge';
import { StatusBadge, StatusType } from '@/components/StatusBadge';
import { CounterDisplay } from '@/components/CounterDisplay';
import { AttendanceManager } from '@/components/AttendanceManager';
import { AdminStats } from '@/components/AdminStats';
import { Logo } from '@/components/Logo';
import { LogOut, Play, Square } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [currentCount, setCurrentCount] = useState(0);
  const [maxCapacity, setMaxCapacity] = useState(20);
  const [isOpen, setIsOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  let status: StatusType = 'Tancat';
  if (isOpen) {
    if (currentCount >= maxCapacity) status = 'Ple';
    else if (currentCount >= maxCapacity * 0.7) status = 'Quasi ple';
    else status = 'Lliure';
  }

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/session');
        if (res.ok) {
          const data = await res.json();
          if (data.session) {
            setCurrentCount(data.session.current_count);
            setMaxCapacity(data.session.max_capacity);
            setIsOpen(data.session.is_open);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchSession();

    const handleRealtimeChanges = (payload: any) => {
      const newRecord = payload.new;
      if (newRecord) {
        setCurrentCount(newRecord.current_count);
        setMaxCapacity(newRecord.max_capacity);
        setIsOpen(newRecord.is_open);
      }
    };

    insforge.realtime.on('postgres_changes', handleRealtimeChanges);
    insforge.realtime.subscribe('admin:sessions');

    return () => {
      insforge.realtime.off('postgres_changes', handleRealtimeChanges);
      insforge.realtime.unsubscribe('admin:sessions');
    };
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const toggleSession = async () => {
    setLoadingAction(true);
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isOpen ? 'close' : 'open' })
      });
      if (res.ok) {
        setIsOpen(!isOpen);
        if (!isOpen) setCurrentCount(0);
      }
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center py-6 px-4 md:px-8 bg-transparent relative">
      {/* Admin Specific Glass Overlay to quiet the background photo */}
      <div className="fixed inset-0 z-[-1] bg-white/60 backdrop-blur-[12px]" />

      <div className="w-full max-w-6xl flex justify-between items-center mb-10 z-10">
        <div className="flex items-center space-x-3">
          <Logo className="w-10 h-10" />
          <h1 className="text-xl font-bold text-navy hidden sm:block drop-shadow-sm">Petits Divendres · Admin</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-navy/70 hover:text-rose-600 bg-white/70 backdrop-blur-2xl px-4 py-2 rounded-[1rem] shadow-sm text-sm font-medium transition-all border border-white/60"
          >
            <span className="hidden sm:block">Tancar sessió</span>
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-start z-10">
        
        {/* Col 1: Status & General Control */}
        <div className="flex flex-col space-y-6">
          <div className="bg-white/70 backdrop-blur-3xl p-6 rounded-[2rem] shadow-xl border border-white/60 flex flex-col items-center space-y-4">
            <h2 className="text-navy font-semibold text-lg w-full text-center mb-2 drop-shadow-sm">Estat Global</h2>
            <StatusBadge status={status} />
            <div className="w-full pt-4 drop-shadow-sm">
              <CounterDisplay currentCount={currentCount} maxCapacity={maxCapacity} />
            </div>
            
            <div className="w-full border-t border-navy/10 pt-6 mt-4">
              <button
                onClick={toggleSession}
                disabled={loadingAction}
                className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl text-white font-medium text-lg transition-all ${
                  isOpen ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'
                } disabled:opacity-50 shadow-md hover:shadow-lg`}
              >
                {isOpen ? <><Square size={20} fill="currentColor" /> <span>Tancar Sessió</span></> : <><Play size={20} fill="currentColor" /> <span>Obrir Sessió d'avui</span></>}
              </button>
            </div>
          </div>
        </div>

        {/* Col 2: Active Children Manager */}
        <div className="lg:col-span-1">
          <AttendanceManager 
            isOpen={isOpen}
            maxCapacity={maxCapacity}
            currentCount={currentCount}
            onCountUpdate={(c) => setCurrentCount(c)}
          />
        </div>

        {/* Col 3: Statistics */}
        <div className="lg:col-span-1 lg:pl-4">
          <AdminStats />
        </div>

      </div>
    </main>
  );
}
