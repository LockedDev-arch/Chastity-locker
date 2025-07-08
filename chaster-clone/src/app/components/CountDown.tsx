'use client';

import { useEffect, useState } from 'react';

type Props = {
  endsAt: string; // ISO string
  expiredText?: string;
  label?: string;
  className?: string;
};

function pad(n: number) {
  return n < 10 ? `0${n}` : n;
}

export default function CountDown({ endsAt, expiredText = "Expired", label, className = "" }: Props) {
  const [now, setNow] = useState(Date.now());
  const ends = new Date(endsAt).getTime();
  const msLeft = ends - now;

  // Tick every second
  useEffect(() => {
    if (msLeft <= 0) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [ends]);

  // Calculate time left
  let content;
  if (msLeft <= 0) {
    content = (
      <span className="text-red-400 font-bold">{expiredText}</span>
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
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <span className="text-gray-400">{label}</span>}
      {content}
    </div>
  );
}