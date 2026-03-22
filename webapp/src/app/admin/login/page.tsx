'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Error d'autenticació");
      }
    } catch (err) {
      setError('Error de xarxa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative">
      <div className="absolute top-4 left-4">
        <Link href="/" className="p-3 bg-white rounded-full shadow-sm text-navy/60 hover:text-navy transition-colors flex items-center justify-center">
          <ArrowLeft size={24} />
        </Link>
      </div>

      <div className="mb-12">
        <Logo className="w-16 h-16 scale-110" />
      </div>

      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-sm border border-navy/5">
        <h1 className="text-xl font-bold text-navy mb-6 text-center">Accés Recepció</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Nom d'usuari"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent text-lg"
              autoFocus
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Contrasenya"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent text-lg"
            />
          </div>
          
          {error && <p className="text-rose-500 text-sm font-medium text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-white font-medium py-3 rounded-xl hover:bg-navy/90 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Verificant...' : 'Accedir'}
          </button>
        </form>
      </div>
    </main>
  );
}
