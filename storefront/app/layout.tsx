import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../components/providers/AuthContext';
import { StoreConfigProvider } from '../components/providers/StoreConfigContext';
import { CartProvider } from '../components/providers/CartContext';
import { WishlistProvider } from '../components/providers/WishlistContext';
import { MusicProvider } from '../components/providers/MusicContext';
import { SmoothScrollProvider } from '../components/motion/SmoothScrollProvider';
import { PageTransition } from '../components/motion/PageTransition';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { NavigationProgress } from '../components/layout/NavigationProgress';
import { ScrollProgressBar } from '../components/layout/ScrollProgressBar';
import { BackToTop } from '../components/layout/BackToTop';
import { MusicPlayerWidget } from '../components/music/MusicPlayerWidget';
import { CartDrawer } from '../components/cart/CartDrawer';
import { WhatsAppButton } from '../components/social/WhatsAppButton';
import { PrefetchManager } from '../components/providers/PrefetchManager';

export const metadata: Metadata = {
  title: 'ANTHURIUM | Fashion Blooms Here | Women\'s Boutique Coimbatore',
  description: 'Premium modern Indian women\'s fashion boutique in Coimbatore. Handcrafted organza sarees, chanderi kurtis, designer sets, and festive couture.',
  keywords: ['Anthurium Boutique', 'Saree Boutique Coimbatore', 'Kurti Boutique Coimbatore', 'Women\'s Fashion Ukkadam', 'Handcrafted Sarees'],
  openGraph: {
    title: 'ANTHURIUM | Fashion Blooms Here',
    description: 'Premium modern Indian women\'s fashion boutique in Coimbatore.',
    url: 'https://anthuriumboutique.com',
    siteName: 'ANTHURIUM Boutique',
    locale: 'en_IN',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-ivory text-charcoal font-sans antialiased selection:bg-rose-200 selection:text-botanical relative">
        <SmoothScrollProvider>
          <AuthProvider>
            <StoreConfigProvider>
              <WishlistProvider>
                <CartProvider>
                  <MusicProvider>
                    <PrefetchManager />
                    <ScrollProgressBar />
                    <Suspense fallback={null}>
                      <NavigationProgress />
                    </Suspense>
                    <AnnouncementBar />
                    <Header />
                    <main className="flex-1 flex flex-col">
                      <PageTransition>{children}</PageTransition>
                    </main>
                    <Footer />
                    <MusicPlayerWidget />
                    <CartDrawer />
                    <BackToTop />
                    <WhatsAppButton />
                  </MusicProvider>
                </CartProvider>
              </WishlistProvider>
            </StoreConfigProvider>
          </AuthProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
