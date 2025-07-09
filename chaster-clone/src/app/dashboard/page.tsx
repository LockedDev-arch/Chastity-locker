'use client';

export type Session = {
  id: string;
  user_id: string;
  status: string;
  ends_at: string;
  duration_minutes: number;
  notes: string;
  started_at: string;
  // Add other fields as needed based on your 'sessions' table structure
};

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import SessionForm from '../components/SessionForm';
import SessionList from '../components/SessionList';
import CountDown from '../components/CountDown';
import PendingRequests from '../components/PendingRequests';

type UserInfo = {
  email: string | null;
  lastSignIn: string | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push('/auth/signin');
        return;
      }
      setUser({
        email: data.user.email ?? null,
        lastSignIn: data.user.last_sign_in_at
          ? new Date(data.user.last_sign_in_at).toLocaleString()
          : null,
      });
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchActiveSession = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;
      const { data } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', authData.user.id)
        .eq('status', 'active')
        .order('ends_at', { ascending: true })
        .limit(1);
      setActiveSession(data && data.length > 0 ? data[0] : null);
    };
    fetchActiveSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/signin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-700 text-white flex items-center justify-center">
        <p className="text-xl">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-700 text-pink-500 flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="mmin-h-screen bg-[#343541] text-pink-200 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full flex flex-col items-center gap-8">
        <header className="w-full flex flex-col items-center gap-2">
          <h1 className="text-4xl font-extrabold mb-2 text-pink-200 tracking-tight">
            Welcome!
          </h1>
          <p className="text-pink-200">
            {user?.lastSignIn && <>Last signed in: <span className="font-mono">{user.lastSignIn}</span></>}
          </p>
        </header>

        {activeSession && (
          <div className = "w-full mt-8">
            <CountDown
              sessions={[activeSession]}
              endsAt={activeSession.ends_at}
              label="Session Countdown:"
            />
          </div>
        )}

        <section className="w-full mt-8">
          <SessionForm />
        </section>

        <section className="w-full mt-8">
          <SessionList />
        </section>
        <section className="w-full mt-8">
          <PendingRequests />
        </section>
        <footer className="mt-10 w-full flex justify-center">
          <button
            onClick={handleLogout}
            className="bg-purple-400 hover:bg-purple-600 px-6 py-2 rounded text-lg font-bold text-white transition shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            Logout
          </button>
        </footer>
      </div>
    </div>
  );
}
