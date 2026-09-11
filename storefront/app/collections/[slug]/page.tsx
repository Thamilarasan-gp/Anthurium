'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Collection, Product } from '@shared/types';
import { api } from '../../../lib/api';
import { ProductCard } from '../../../components/product/ProductCard';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../../../components/motion/ScrollReveal';

export default function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCollectionData = async () => {
      try {
        const [colRes, prodRes] = await Promise.all([
          api.getCollectionBySlug(slug),
          api.getProducts({ collection: slug, limit: 24 })
        ]);

        if (isMounted) {
          if (colRes.success && colRes.collection) {
            setCollection(colRes.collection);
          }
          if (prodRes.success && Array.isArray(prodRes.products)) {
            setProducts(prodRes.products);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading collection:', err);
        if (isMounted) setLoading(false);
      }
    };

    fetchCollectionData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const fallbackTitle = slug.replace(/-/g, ' ').toUpperCase();

  return (
    <div className="space-y-12 pb-16">
      {/* Editorial Banner */}
      <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-cream">
        <img
          src={collection?.bannerImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80'}
          alt={collection?.title || fallbackTitle}
          className="absolute inset-0 w-full h-full object-cover opacity-90 will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ivory/95 via-ivory/80 to-transparent md:w-1/2" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
          <ScrollReveal variant="fade-up" duration={0.6} className="max-w-md space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose-700">EDITORIAL CAMPAIGN</span>
            <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-botanical uppercase tracking-wide">
              {collection?.title || fallbackTitle}
            </h1>
            <p className="text-xs text-charcoal/80 font-light leading-relaxed">
              {collection?.description || 'Curated boutique ensembles crafted for special fashion moments.'}
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-rose-100">
          <p className="text-xs text-gray-500 font-medium">
            Showing <span className="font-bold text-botanical">{products.length}</span> curated styles
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-rose-100/60" />
            ))}
          </div>
        ) : (
          <StaggerContainer staggerDelay={0.06} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            {products.map((product) => (
              <StaggerItem key={product._id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}
