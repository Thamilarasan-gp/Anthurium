'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, MessageCircle, Star, ShieldCheck, Truck, RotateCcw, ChevronDown, Sparkles, Play } from 'lucide-react';
import { Product } from '@shared/types';
import { api } from '../../../lib/api';
import { useCart } from '../../../components/providers/CartContext';
import { useWishlist } from '../../../components/providers/WishlistContext';
import { useStoreConfig } from '../../../components/providers/StoreConfigContext';
import { ProductCard } from '../../../components/product/ProductCard';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const { config } = useStoreConfig();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'fabric' | 'care' | 'fit' | 'shipping'>('fabric');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const res = await api.getProductBySlug(slug);
        if (res.success && res.product) {
          setProduct(res.product);
          if (res.product.colors && res.product.colors.length > 0) {
            setSelectedColor(res.product.colors[0]);
          }
          if (res.product.sizes && res.product.sizes.length > 0) {
            setSelectedSize(res.product.sizes[0]);
          }

          // Fetch related items
          const catId = typeof res.product.category === 'object' ? res.product.category._id : res.product.category;
          const relatedRes = await api.getProducts({ category: catId, limit: 4 });
          if (relatedRes.success && Array.isArray(relatedRes.products)) {
            setRelatedProducts(relatedRes.products.filter((p) => p._id !== res.product._id));
          }
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-serif text-charcoal">
        Loading Anthurium Silk & Handloom Details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-editorial text-3xl font-bold text-botanical">Style Not Found</h2>
        <p className="text-xs text-gray-500">The requested boutique product is no longer available.</p>
        <Link href="/shop" className="inline-block bg-botanical text-ivory px-6 py-2.5 rounded-full text-xs font-bold uppercase">
          Back To Catalogue
        </Link>
      </div>
    );
  }

  const isLiked = isInWishlist(product._id);
  const hasSale = product.salePrice && product.salePrice < product.price;
  const currentPrice = hasSale ? product.salePrice! : product.price;

  const whatsappMsg = `Hi ${config.brandName}, I would like to enquire about buying: ${product.title} (SKU: ${product.sku}). Page URL: ${typeof window !== 'undefined' ? window.location.href : ''}`;
  const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 space-x-2">
        <Link href="/" className="hover:text-botanical">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-botanical">Catalogue</Link>
        <span>/</span>
        <span className="text-botanical font-semibold">{product.title}</span>
      </nav>

      {/* Main Product Layout (2-Column Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-warm-beige/40 shadow-soft border border-rose-100/60">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-top transition-all duration-500"
            />
            {product.badges && product.badges.length > 0 && (
              <div className="absolute top-4 left-4 z-10 flex flex-col space-y-1.5">
                {product.badges.map((b: string) => (
                  <span key={b} className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold bg-botanical text-ivory shadow-sm">
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image Thumbnails Slider */}
          {product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    activeImageIndex === idx ? 'border-rose-600 shadow-md' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.title} thumbnail ${idx}`} className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Controls */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-rose-700">
              SKU: {product.sku}
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-botanical mt-1 leading-tight">
              {product.title}
            </h1>
            <div className="flex items-center space-x-3 mt-2">
              <div className="flex items-center text-amber-500 text-xs font-bold space-x-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-gray-400">({product.numReviews || 12} reviews)</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
                In Stock ({product.stock} left)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline space-x-3 pt-1 border-t border-rose-100/60">
            <span className="text-3xl font-bold text-botanical">
              {config.currency.symbol}{currentPrice}
            </span>
            {hasSale && (
              <span className="text-lg text-gray-400 line-through">
                {config.currency.symbol}{product.price}
              </span>
            )}
            <span className="text-xs text-gray-500 font-light">Inclusive of all taxes</span>
          </div>

          <p className="text-xs text-charcoal/80 leading-relaxed font-light">
            {product.shortDescription}
          </p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal">
                Color: <span className="text-rose-700">{selectedColor?.name}</span>
              </label>
              <div className="flex items-center space-x-3">
                {product.colors.map((col: { name: string; hex: string }, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(col)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform transform active:scale-95 shadow-inner ${
                      selectedColor?.name === col.name ? 'border-botanical scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal">
                  Select Size
                </label>
                <Link href="/size-guide" className="text-xs text-rose-700 underline font-medium">
                  Size Guide
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz: string) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase border transition ${
                      selectedSize === sz
                        ? 'bg-botanical text-ivory border-botanical shadow-md'
                        : 'bg-white text-charcoal border-gray-200 hover:border-botanical'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-gray-600 font-bold hover:text-botanical"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-gray-600 font-bold hover:text-botanical"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(product, selectedColor, selectedSize, quantity)}
                className="flex-1 bg-botanical hover:bg-botanical-dark text-ivory py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center space-x-2 transition transform active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Bag</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border transition shadow-sm ${
                  isLiked ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-charcoal border-gray-200 hover:text-rose-600'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* WhatsApp Direct Enquiry */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg flex items-center justify-center space-x-2 transition"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>Enquire on WhatsApp</span>
            </a>
          </div>

          {/* Product Accordion / Spec Tabs */}
          <div className="border border-rose-100 rounded-2xl p-4 bg-white space-y-3">
            <div className="flex border-b border-gray-100 pb-2 space-x-4 text-xs font-bold uppercase tracking-wider">
              {[
                { id: 'fabric', label: 'Fabric & Material' },
                { id: 'care', label: 'Care Instructions' },
                { id: 'fit', label: 'Fit & Measurements' },
                { id: 'shipping', label: 'Delivery & Returns' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-2 transition ${
                    activeTab === tab.id ? 'text-rose-700 border-b-2 border-rose-600' : 'text-gray-400 hover:text-charcoal'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-charcoal/80 leading-relaxed font-light min-h-[60px] pt-1">
              {activeTab === 'fabric' && <p>{product.fabric}. {product.description}</p>}
              {activeTab === 'care' && <p>{product.careInstructions || 'Dry clean recommended for initial washes to preserve artisan dyes and gold embroidery.'}</p>}
              {activeTab === 'fit' && <p>{product.fit || 'Relaxed traditional Indian drape silhouette designed for comfort.'}</p>}
              {activeTab === 'shipping' && <p>Express dispatch within 24 hours from our Coimbatore boutique. Free shipping across India on orders over ₹2,999.</p>}
            </div>
          </div>
        </div>
      </div>

      {/* "See It In Motion" Section */}
      <section className="bg-cream/50 p-8 sm:p-12 rounded-3xl border border-rose-100 space-y-6 text-center">
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-rose-700">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>SEE IT IN MOTION</span>
        </div>
        <h3 className="font-editorial text-3xl font-bold text-botanical">Styled by Our Boutique Artisans</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Watch how this piece drapes in natural sunlight and movement.
        </p>

        <div className="max-w-md mx-auto rounded-2xl overflow-hidden shadow-xl aspect-[3/4] bg-black relative group">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition">
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </div>
          </div>
        </div>
      </section>

      {/* "You May Also Like" Recommendations */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose-700">Curated Pairing</p>
            <h3 className="font-editorial text-3xl font-bold text-botanical">You May Also Like</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct._id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
