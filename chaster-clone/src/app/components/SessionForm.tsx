'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type Props = {
  onSessionCreated?: () => void;
};

export default function SessionForm({ onSessionCreated }: Props) {
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const mins = parseInt(duration, 10);
    if (isNaN(mins) || mins < 1) {
      setError('Enter a valid duration (minutes).');
      return;
    }

    setSubmitting(true);
    // Get the currently signed-in user
    const { data, error: userError } = await supabase.auth.getUser();
    if (userError || !data.user) {
      setError('Not logged in.');
      setSubmitting(false);
      return;
    }
    const user_id = data.user.id;

    const ends_at = new Date(Date.now() + mins * 60 * 1000).toISOString();

    const { error: insertError } = await supabase.from('sessions').insert({
      user_id,
      duration_minutes: mins,
      notes,
      status: 'active',
      started_at: new Date().toISOString(),
      ends_at,
    });

    setSubmitting(false);

    if (insertError) {
      setError('Failed to create session: ' + insertError.message);
      return;
    }

    setSuccess('Session started!');
    setDuration('');
    setNotes('');
    if (onSessionCreated) onSessionCreated();
  };

  return (
    <div>
    <h2 className="text-3xl font-bold mb-2 text-center text-white">Start a New Session</h2>
    <form onSubmit={handleSubmit} className="bg-gray-700 rounded p-6 flex flex-col gap-4 shadow-xl mx-auto text-white">
      <label className="flex flex-col">
        Duration (minutes)
        <input
          type="number"
          min="1"
          className="mt-1 rounded p-2 border-2 border-purple-400/40 bg-gray-600"
          value={duration}
          onChange={e => setDuration(e.target.value)}
          placeholder="60"
        />
      </label>
      <label className="flex flex-col">
        Notes (optional)
        <textarea
          className="mt-1 rounded p-2 border-2 border-purple-400/40 bg-gray-600"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="For your keyholder or reminders…"
        />
      </label>
      <button
        type="submit"
        className="bg-purple-400 hover:bg-purple-600 px-4 py-2 rounded font-bold text-white"
        disabled={submitting}
      >
        {submitting ? 'Starting...' : 'Start Session'}
      </button>
      {error && <p className="text-red-400">{error}</p>}
      {success && <p className="text-green-400">{success}</p>}
    </form>
    </div>
  );
}