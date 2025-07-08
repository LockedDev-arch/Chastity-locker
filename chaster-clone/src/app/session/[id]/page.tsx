'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SessionPage() {
  const { id } = useParams();
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase
        .from('lock_sessions')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Error fetching session:', error);
        setLoading(false);
        return;
      }

      const updateCountdown = () => {
        const now = Date.now();
        const diff = data.end_time - now;
        if (diff <= 0) {
          setRemainingTime(0);
          setIsLocked(false);
        } else {
          setRemainingTime(diff);
          setIsLocked(true);
        }
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);

      setLoading(false);

      return () => clearInterval(interval);
    };

    if (id) fetchSession();
  }, [id]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#343541] text-pink-200 flex flex-col items-center justify-center p-6 space-y-4">
        <p className="text-lg text-pink-200">Loading session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#343541] text-pink-200 flex flex-col items-center justify-center p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-4 text-pink-200">Lock Session</h1>
      <p className="text-lg mb-2 text-pink-100">Session ID: {id}</p>
      {remainingTime !== null ? (
        <p className="text-xl font-mono mb-4 text-pink-100">
          {isLocked ? `Locked: ${formatTime(remainingTime)}` : 'Unlocked'}
        </p>
      ) : (
        <p className="text-red-400">No session found.</p>
      )}
    </div>
  );
}
