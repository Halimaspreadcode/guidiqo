import { Suspense } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ExploreSection from '@/components/ExploreSection';
import Footer from '@/components/Footer';

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <main className="min-h-screen bg-white">
        <Header />
        <HeroSection />
        <ExploreSection />
        <Footer />
      </main>
    </Suspense>
  );
}

