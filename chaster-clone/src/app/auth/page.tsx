'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authing, setAuthing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setError('');
    setMessage('');

    if (!email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setAuthing(true);
    const { error: signupError } = await supabase.auth.signUp({ email, password });

    if (signupError) {
      if (
        signupError.status === 400 &&
        signupError.message.toLowerCase().includes('user already registered')
      ) {
        setError('Oops! That email is already associated with an account. Try logging in instead.');
      } else {
        setError(signupError.message);
      }
      setAuthing(false);
      return;
    }

    setAuthing(false);
    setMessage('Signup successful! Please check your email to confirm your account.');
  };

  return (
    <div className="min-h-screen bg-[#343541] text-pink-200 flex flex-col items-center justify-center p-6 space-y-4">
      <h1 className="text-3xl font-bold text-pink-200">Register</h1>

      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full max-w-md p-2 placeholder-pink-200 text-white border-2 border-pink-200 rounded"
      />

      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full max-w-md p-2 placeholder-pink-200 text-white border-2 border-pink-200 rounded"
      />

      <input
        type="password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        className="w-full max-w-md p-2 placeholder-pink-200 text-white border-2 border-pink-200 rounded"
      />

      <button
        onClick={handleSignup}
        disabled={authing}
        className="bg-purple-300 px-6 py-2 rounded hover:bg-purple-400 disabled:opacity-50 text-white transition"
      >
        {authing ? 'Registering...' : 'Register'}
      </button>

      {error && <p className="text-red-400">{error}</p>}
      {message && <p className="text-green-400">{message}</p>}
    </div>
  );
}
