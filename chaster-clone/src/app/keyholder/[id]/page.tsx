'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
 
type LockSession = {
  id: string;
  end_time: number;
  updated_by: string;
};
import { supabase } from '@/lib/supabase';

export default function KeyholderPage() {
  const id = useParams()?.id as string;
  const [session, setSession] = useState<LockSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateEndTime = async (msDelta: number) => {
    if (!session) return;
    const newEndTime = session.end_time + msDelta;

    const { error } = await supabase
      .from('lock_sessions')
      .update({ end_time: newEndTime, updated_by: 'keyholder' })
      .eq('id', id);

    if (!error) {
      setSession({ ...session, end_time: newEndTime });
    }
  };

  const unlockNow = () => updateEndTime(-999999999999); // force it to expire

  useEffect(() => {
    const fetchSession = async () => {
      if (!id) {
        setError('Invalid session ID');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('lock_sessions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setError('Session not found');
      } else {
        setSession(data);
      }
      setLoading(false);
    };
    fetchSession();
  }, [id]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
  };

  const getRemaining = () =>
    session ? Math.max(0, session.end_time - Date.now()) : 0;

  if (loading) return <p className="text-white p-6">Loading session…</p>;
  if (error) return <p className="text-red-400 p-6">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold">Keyholder Controls</h1>
      <p>Session ID: {id}</p>
      <p>Time Remaining: {formatTime(getRemaining())}</p>

      <div className="flex gap-4">
        <button
          onClick={() => updateEndTime(15 * 60 * 1000)}
          className="bg-green-600 px-4 py-2 rounded"
        >
          +15 min
        </button>
        <button
          onClick={() => updateEndTime(-5 * 60 * 1000)}
          className="bg-yellow-600 px-4 py-2 rounded"
        >
          -5 min
        </button>
        <button
          onClick={unlockNow}
          className="bg-red-600 px-4 py-2 rounded"
        >
          Unlock Now
        </button>
      </div>
    </div>
  );
}