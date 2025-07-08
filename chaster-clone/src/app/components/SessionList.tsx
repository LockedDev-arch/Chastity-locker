'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Session = {
  id: string;
  duration_minutes: number;
  notes: string | null;
  status: string;
  started_at: string;
  ends_at: string;
};

type Props = {
  refreshFlag?: number; // change this prop to force a reload
};

export default function SessionList({ refreshFlag }: Props) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError('');

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        setError('Not logged in.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', authData.user.id)
        .order('started_at', { ascending: false });

      if (error) {
        setError('Failed to load sessions: ' + error.message);
      } else {
        setSessions(data || []);
      }
      setLoading(false);
    };

    fetchSessions();
  }, [refreshFlag]);

  if (loading) {
    return (
      <div className="w-full text-center text-gray-400 mt-4">Loading sessions…</div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center text-red-400 mt-4">{error}</div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="w-full text-center text-gray-500 mt-4">
        No sessions yet. Start a new one above!
      </div>
    );
  }

  return (
    <div className="w-full mt-6 space-y-4">
      {sessions.map((s) => (
        <div
          key={s.id}
          className={`bg-gray-800/90 rounded-lg p-4 shadow flex flex-col gap-1 border-l-4 ${
            s.status === 'active'
              ? 'border-purple-500'
              : s.status === 'completed'
              ? 'border-green-500'
              : s.status === 'expired'
              ? 'border-yellow-500'
              : 'border-gray-700'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="font-semibold">
              {s.status === 'active' && '🔒'}
              {s.status === 'completed' && '✅'}
              {s.status === 'expired' && '⏰'}
              Session ({s.duration_minutes} min)
            </span>
            <span className="text-xs text-gray-400">
              {new Date(s.started_at).toLocaleString()}
            </span>
          </div>
          <div className="text-sm text-gray-300">
            Ends: {new Date(s.ends_at).toLocaleString()}
          </div>
          {s.notes && (
            <div className="text-sm text-gray-400 italic mt-1">Note: {s.notes}</div>
          )}
          <div className="text-xs text-gray-500">
            Status: {s.status}
          </div>
        </div>
      ))}
    </div>
  );
}