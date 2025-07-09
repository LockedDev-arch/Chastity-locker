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
  sessions: Session[];
  endsAt: string;
  label: string;
  className?: string;
  expiredText?: string;
};

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

export default function CountDown({ sessions, expiredText = "Expired", label, className = "" }: Props) {
  return (
    <div className={`w-full mt-6 space-y-4 ${className}`}>
      {sessions.map((s: Session) => {
        const now = Date.now();
        const ends = new Date(s.ends_at).getTime();
        const msLeft = ends - now;

        let content;
        if (msLeft <= 0) {
          content = (
            <span className="text-red-100 font-bold">{expiredText}</span>
          );
        } else {
          const totalSeconds = Math.floor(msLeft / 1000);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          content = (
            <span className="font-mono text-lg text-green-300">
              {pad(hours)}:{pad(minutes)}:{pad(seconds)}
            </span>
          );
        }

        return (
          <div
            key={s.id}
            className={`bg-gray-700 rounded-lg p-4 shadow flex flex-col gap-1 border-l-4 ${
              s.status === 'active'
                ? 'border-purple-400'
                : s.status === 'completed'
                ? 'border-green-500'
                : s.status === 'failed'
                ? 'border-red-500'
                : 'border-gray-700'
            }`}
          >
            {label && <span className="text-gray-400">{label}</span>}
            {content}
          </div>
        );
      })}
    </div>
  );
}