
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#343541] text-pink-200 flex flex-col items-center p-8">
      {/* Hero Section */}
      <section className="w-full max-w-4xl text-center py-20">
        <h1 className="text-5xl font-bold mb-4">Welcome to Chastity Hub</h1>
        <p className="text-xl mb-8">
          Embrace the beauty of chastity with secure and elegant sessions.
        </p>
        <Link href="/auth">
          <button className="bg-pink-400 text-white px-6 py-3 rounded-full hover:bg-pink-500 transition">
            Get Started
          </button>
        </Link>
      </section>

      {/* Feature Graphics */}
      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
        <div className="flex flex-col items-center">
          <Image
            src="/svgs/secure.svg"
            alt="Secure Lock"
            width={120}
            height={120}
          />
          <h3 className="mt-4 text-lg font-semibold">Ultimate Security</h3>
          <p className="mt-2 text-center">
            Complete control over your lock sessions.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src="/images/beauty.svg"
            alt="Elegant Design"
            width={120}
            height={120}
          />
          <h3 className="mt-4 text-lg font-semibold">Elegant Design</h3>
          <p className="mt-2 text-center">
            A sleek interface with pastel accents.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Image
            src="/images/privacy.svg"
            alt="Privacy First"
            width={120}
            height={120}
          />
          <h3 className="mt-4 text-lg font-semibold">Privacy First</h3>
          <p className="mt-2 text-center">
            Your data and sessions remain confidential.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-sm text-pink-400">
        © {new Date().getFullYear()} Chastity Hub. All rights reserved.
      </footer>
    </main>
  );
}
