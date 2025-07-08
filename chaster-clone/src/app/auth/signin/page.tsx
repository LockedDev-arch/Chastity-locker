'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    setError('');
    setMessage('');

    if (!identifier || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);

    // Only allow email sign-in for now
    if (!identifier.includes('@')) {
      setError('Please log in with your email address.');
      setLoading(false);
      return;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: identifier,
      password,
    });

    if (loginError) {
      setError('Login failed. Check your credentials.');
      setLoading(false);
      return;
    }

    setMessage('Login successful! Redirecting...');
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 gap-6">
      <h1 className="text-2xl font-bold">Log In</h1>
      <input
        type="text"
        placeholder="Email"
        value={identifier}
        onChange={e => setIdentifier(e.target.value)}
        className="text-black p-2 rounded w-full max-w-md"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="text-black p-2 rounded w-full max-w-md"
      />
      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Log In'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
    </div>
  );
}