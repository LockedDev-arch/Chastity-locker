'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [lockMinutes, setLockMinutes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleStartLock = async () => {
    setLoading(true);
    setError(null);

    const endTime = Date.now() + lockMinutes * 60 * 1000;

    const { data, error } = await supabase
      .from("lock_sessions")
      .insert([{ end_time: endTime, updated_by: "wearer" }])
      .select()
      .single();

    setLoading(false);

    if (error) {
      setError("Failed to create session. Try again.");
      return;
    }

    if (data?.id) {
      router.push(`/session/${data.id}`);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold mb-4 text-center">Start a Lock Session</h1>
        <input
          type="number"
          value={lockMinutes}
          onChange={(e) => setLockMinutes(Number(e.target.value))}
          placeholder="Enter minutes"
          className="px-4 py-2 text-black rounded mb-4"
        />
        <button
          onClick={handleStartLock}
          disabled={loading || lockMinutes <= 0}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Lock Me In"}
        </button>
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </main>
    </div>
  );
}
