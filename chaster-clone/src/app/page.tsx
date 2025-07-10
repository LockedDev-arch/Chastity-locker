
'use client';

import SecureIcon from '@/svgs/secure.svg';
import BeautyIcon from '@/svgs/beauty.svg';
import PrivacyIcon from '@/svgs/privacy.svg';
import Link from 'next/link';
import type { ReactNode, FC, SVGProps } from 'react';

const features: { icon: FC<SVGProps<SVGSVGElement>>; title: string; description: string }[] = [
  {
    icon: SecureIcon,
    title: 'Ultimate Security',
    description: 'Complete control over your lock sessions.',
  },
  {
    icon: BeautyIcon,
    title: 'Elegant Design',
    description: 'A sleek interface with pastel accents.',
  },
  {
    icon: PrivacyIcon,
    title: 'Privacy First',
    description: 'Your data and sessions remain confidential.',
  },
];

const Hero: FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <header className="text-center bg-gray-400 p-10 rounded-lg shadow-lg">
    <h1 className="text-5xl font-bold mb-4">{title}</h1>
    <p className="text-xl">{subtitle}</p>
  </header>
);

const CTAButton: FC<{ href: string; children: ReactNode }> = ({ href, children }) => (
  <Link href={href} aria-label={`${children}`}>
    <a className="bg-purple-400 text-white px-6 py-3 rounded-full hover:bg-purple-600 transition">
      {children}
    </a>
  </Link>
);

const FeatureTile: FC<{ icon: FC<SVGProps<SVGSVGElement>>; title: string; description: string }> = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="flex flex-col items-center text-center space-y-2">
    <Icon className="w-24 h-24 text-purple-400 fill-current" aria-hidden="true" />
    <h2 className="text-xl font-semibold">{title}</h2>
    <p>{description}</p>
  </div>
);

export default function HomePage() {
  return (
    <main className="min-h-screen bg-backdrop text-white font-sans flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 space-y-12">
        <Hero
          title="Welcome!"
          subtitle="Embrace the beauty of chastity with secure and elegant sessions."
        />
        <div className="flex justify-center">
          <CTAButton href="/auth">Get Started</CTAButton>
        </div>
        <section aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((f) => (
              <FeatureTile
                key={f.title}
                icon={f.icon}
                title={f.title}
                description={f.description}
              />
            ))}
          </div>
        </section>
      </div>
      <footer className="bg-backdrop text-center text-sm py-4">
        © {new Date().getFullYear()} Chastity Hub. All rights reserved.
      </footer>
    </main>
  );
}
