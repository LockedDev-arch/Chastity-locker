

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProfileSetupPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'wearer' | 'keyholder'>('wearer');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/auth');
        return;
      }
      setSession(data.session);

      const { data: existingProfile } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', data.session.user.id)
        .single();

      if (existingProfile) {
        router.push('/dashboard');
        return;
      }

      setLoading(false);
    };

    init();
  }, [router]);

  const handleSubmit = async () => {
    setError(null);
    if (!username.trim()) {
      setError('Username required');
      return;
    }

    const { error } = await supabase.from('users').insert({
      auth_user_id: session.user.id,
      username,
      role,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  if (loading) return <div className="text-white p-6">Checking profile...</div>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 gap-6">
      <h1 className="text-2xl font-bold">Complete Your Profile</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="text-black p-2 rounded"
      />
      <div className="flex gap-4">
        <label>
          <input
            type="radio"
            name="role"
            value="wearer"
            checked={role === 'wearer'}
            onChange={() => setRole('wearer')}
          />
          Wearer
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="keyholder"
            checked={role === 'keyholder'}
            onChange={() => setRole('keyholder')}
          />
          Keyholder
        </label>
      </div>
      <button onClick={handleSubmit} className="bg-purple-600 px-4 py-2 rounded">
        Submit
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}