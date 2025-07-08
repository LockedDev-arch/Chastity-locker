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
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 space-y-4">
      <h1 className="text-3xl font-bold">Register</h1>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="p-2 text-black rounded w-full max-w-md"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="p-2 text-black rounded w-full max-w-md"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        className="p-2 text-black rounded w-full max-w-md"
      />
      <button
        onClick={handleSignup}
        disabled={authing}
        className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {authing ? 'Registering...' : 'Register'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
    </div>
  );
}