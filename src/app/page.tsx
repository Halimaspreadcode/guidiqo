import { Suspense } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ExploreSection from '@/components/ExploreSection';
import SpotlightedCreators from '@/components/SpotlightedCreators';
import Footer from '@/components/Footer';
import PromoPopup from '@/components/PromoPopup';

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <main className="min-h-screen bg-white dark:bg-black">
        <PromoPopup />
        <Header />
        <HeroSection />
        <SpotlightedCreators />
        <ExploreSection />
        <Footer />
      </main>
    </Suspense>
  );
}

