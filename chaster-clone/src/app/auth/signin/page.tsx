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
    <div className="min-h-screen bg-[#343541] text-pink-200 flex flex-col items-center justify-center p-6 space-y-4">
      <h1 className="text-3xl font-bold">Log In</h1>
      <input
        type="text"
        placeholder="Email"
        value={identifier}
        onChange={e => setIdentifier(e.target.value)}
        className="w-full max-w-md p-2 bg-gray-700 placeholder-pink-200 text-white border-2 border-pink-200 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full max-w-md p-2 bg-gray-700 placeholder-pink-200 text-white border-2 border-pink-200 rounded"
      />
      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-purple-400 px-6 py-2 rounded hover:bg-purple-600 disabled:opacity-50 text-white transition"
      >
        {loading ? 'Logging in...' : 'Log In'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
    </div>
  );
}