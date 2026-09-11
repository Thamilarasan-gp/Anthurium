'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@shared/types';
import { api } from '../../lib/api';
import { ProductCard } from '../product/ProductCard';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../motion/ScrollReveal';

interface CategoryViewProps {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  heroImage: string;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  slug,
  title,
  tagline,
  description,
  heroImage,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCategoryProducts = async () => {
      try {
        const res = await api.getProducts({ category: slug, limit: 20 });
        if (isMounted && res.success && Array.isArray(res.products)) {
          setProducts(res.products);
          setLoading(false);
        }
      } catch (err) {
        console.error(`Error loading ${slug}:`, err);
        if (isMounted) setLoading(false);
      }
    };

    fetchCategoryProducts();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return (
    <div className="space-y-12 pb-16">
      {/* Category Hero Banner */}
      <div className="relative min-h-[45vh] flex items-center justify-center overflow-hidden bg-cream">
        <img
          src={heroImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-85 will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ivory/95 via-ivory/80 to-transparent md:w-1/2" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
          <ScrollReveal variant="fade-up" duration={0.6} className="max-w-md space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose-700">BOUTIQUE COLLECTION</span>
            <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-botanical uppercase tracking-wider">{title}</h1>
            <p className="font-serif italic text-lg text-rose-800">"{tagline}"</p>
            <p className="text-xs text-charcoal/70 font-light leading-relaxed">{description}</p>
          </ScrollReveal>
        </div>
      </div>

      {/* Category Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-rose-100">
          <p className="text-xs text-gray-500 font-medium">
            Showing <span className="font-bold text-botanical">{products.length}</span> handcrafted {title.toLowerCase()}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-rose-100/60" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-rose-100 space-y-4 my-6">
            <h3 className="font-editorial text-2xl font-bold text-botanical">New styles coming soon to this edit.</h3>
            <p className="text-xs text-gray-500">Explore our full catalogue for latest saree and kurti drops.</p>
            <Link
              href="/shop"
              prefetch={true}
              className="inline-block bg-botanical text-ivory px-6 py-2.5 rounded-full text-xs font-bold uppercase hover:bg-[#07361E] transition"
            >
              Explore All Styles
            </Link>
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
};
