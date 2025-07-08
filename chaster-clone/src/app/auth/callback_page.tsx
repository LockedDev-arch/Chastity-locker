'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function CallbackPage() {
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      console.log('SESSION:', data);
    };
    check();
  }, []);

  return <div className="text-white">Checking session…</div>;
}