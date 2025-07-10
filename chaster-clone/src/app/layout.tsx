'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const supabase = createPagesBrowserClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Keyholders', href: '/keyholders' },
    { label: 'Explore', href: '/explore' },
    { label: 'Activity', href: '/activity' },
    { label: 'Challenges', href: '/challenges' },
    { label: 'Rankings', href: '/rankings' },
  ];

  const communityItems = [
    { label: 'Forums', href: '/forums' },
    { label: 'Groups', href: '/groups' },
    { label: 'Events', href: '/events' },
    { label: 'Support', href: '/support' },
    { label: 'Blog', href: '/blog' },
  ]
  
  const websiteItems = [
    { label: 'Developers', href: '/developers' },
    { label: 'Change Log', href: '/change_log' },
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy_policy' },
  ]
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionContextProvider supabaseClient={supabase}>
          <div className="text-2xl flex min-h-screen bg-[#343541] text-white text-center">
            {/* Desktop sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-[#25232f] p-6 space-y-6">
              {navItems.map(item => (
                <Link key={item.href} href={item.href} className="hover:bg-stone-600 hover:text-3xl hover:text-purple-400 transition rounded-2xl p-2">
                  {item.label}
                </Link>
              ))}
              ---
              {communityItems.map(item => (
                <Link key={item.href} href={item.href} className="hover:bg-stone-600 hover:text-3xl hover:text-purple-400 transition rounded-2xl p-2">
                  {item.label}
                </Link>
              ))}
              ---
              {websiteItems.map(item => (
                <Link key={item.href} href = {item.href} className = "text-sm caption mb-3">
                  {item.label}
                </Link>
              ))}
            </aside>
            {/* Mobile header & menu */}
            <div className="md:hidden w-full">
              <header className="flex items-center justify-between bg-[#2c2a38] p-4">
                <button
                  onClick={() => setMobileOpen(o => !o)}
                  aria-label="Toggle menu"
                  className="text-2xl"
                >
                  ☰
                </button>
              </header>
              {mobileOpen && (
                <nav className="flex flex-col bg-[#2c2a38] p-4 space-y-2">
                  {navItems.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="hover:text-white transition"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              )}
            </div>
            {/* Main content */}
            <main className="flex-1 p-8">
              {children}
            </main>
          </div>
        </SessionContextProvider>
      </body>
    </html>
  )};
