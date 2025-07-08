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
    <div className="min-h-screen bg-[#343541] text-pink-200 flex flex-col items-center justify-center p-6 space-y-4">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold mb-4  text-center">
          Start a Lock Session
        </h1>
        <input
          type="number"
          value={lockMinutes}
          onChange={(e) => setLockMinutes(Number(e.target.value))}
          placeholder="Enter minutes"
          className="w-1/2 p-2 bg-gray-700 placeholder-pink-200 text-white border-2 border-pink-200 rounded mx-auto"
        />
        <button
          onClick={handleStartLock}
          disabled={loading || lockMinutes <= 0}
          className="w-1/2 max-w-md p-2 bg-purple-400 px-6 py-2 rounded hover:bg-purple-600 text-white transition mx-auto">
          {loading ? "Creating..." : "Lock Me In"}
        </button>
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </main>
    </div>
  );
}
