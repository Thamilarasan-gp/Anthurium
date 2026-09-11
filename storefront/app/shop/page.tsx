'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, Search, RefreshCw, X, ChevronDown } from 'lucide-react';
import { Product, Category, Collection } from '@shared/types';
import { api } from '../../lib/api';
import { ProductCard } from '../../components/product/ProductCard';
import { useStoreConfig } from '../../components/providers/StoreConfigContext';
import { StaggerContainer, StaggerItem } from '../../components/motion/ScrollReveal';

function ShopContent() {
  const searchParams = useSearchParams();
  const { config } = useStoreConfig();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [collection, setCollection] = useState(searchParams.get('collection') || 'all');
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color') || '');
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '');
  const [fabric, setFabric] = useState(searchParams.get('fabric') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');

  const fetchProducts = async () => {
    if (products.length === 0) {
      setLoading(true);
    }
    try {
      const res = await api.getProducts({
        category: category !== 'all' ? category : undefined,
        collection: collection !== 'all' ? collection : undefined,
        search: search || undefined,
        color: selectedColor || undefined,
        size: selectedSize || undefined,
        fabric: fabric || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sort,
        limit: 24
      });
      if (res.success && Array.isArray(res.products)) {
        setProducts(res.products);
      }
    } catch (e) {
      console.error('Error fetching shop products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const [catRes, colRes] = await Promise.all([api.getCategories(), api.getCollections()]);
      if (catRes.success) setCategories(catRes.categories);
      if (colRes.success) setCollections(colRes.collections);
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [category, collection, search, selectedColor, selectedSize, fabric, minPrice, maxPrice, sort]);

  const resetFilters = () => {
    setSearch('');
    setCategory('all');
    setCollection('all');
    setSelectedColor('');
    setSelectedSize('');
    setFabric('');
    setMinPrice('');
    setMaxPrice('');
    setSort('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-2 pb-6 border-b border-rose-100">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose-700">HANDCRAFTED BOUTIQUE CATALOGUE</p>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-botanical">Shop All Styles</h1>
        <p className="text-xs text-gray-500 font-light max-w-md mx-auto">
          Explore pure organza sarees, chanderi kurtis, silk sets, and contemporary fusion dresses.
        </p>
      </div>

      {/* Filter & Sort Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-rose-100/60 shadow-sm">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden w-full sm:w-auto flex items-center justify-center space-x-2 bg-botanical text-ivory px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider"
        >
          <Filter className="w-4 h-4" />
          <span>Filter Styles</span>
        </button>

        {/* Total Results Count */}
        <p className="text-xs text-charcoal/70 font-medium">
          Showing <span className="font-bold text-botanical">{products.length}</span> styles
        </p>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Sort By:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-ivory text-xs px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-botanical text-botanical font-semibold"
          >
            <option value="featured">Featured First</option>
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popularity">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Main Grid & Filter Sidebar */}
      <div className="flex gap-8 items-start">
        {/* Desktop Sidebar Filter Panel */}
        <aside className="hidden lg:block w-64 bg-white p-6 rounded-2xl border border-rose-100/60 shadow-sm space-y-6 sticky top-28">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-editorial text-lg font-bold text-botanical flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-rose-700" />
              <span>Filter Catalogue</span>
            </h3>
            <button onClick={resetFilters} className="text-[11px] text-rose-600 font-semibold hover:underline">
              Reset All
            </button>
          </div>

          {/* Search Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal">Search Keyword</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Organza, Silk, Kurti..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-ivory text-xs pl-8 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal">Category</label>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              <button
                onClick={() => setCategory('all')}
                className={`block text-xs w-full text-left py-1 px-2 rounded-md ${
                  category === 'all' ? 'bg-rose-50 text-rose-800 font-bold' : 'text-gray-600 hover:text-botanical'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setCategory(cat.slug)}
                  className={`block text-xs w-full text-left py-1 px-2 rounded-md ${
                    category === cat.slug ? 'bg-rose-50 text-rose-800 font-bold' : 'text-gray-600 hover:text-botanical'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Collections Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal">Curated Collection</label>
            <div className="space-y-1">
              <button
                onClick={() => setCollection('all')}
                className={`block text-xs w-full text-left py-1 px-2 rounded-md ${
                  collection === 'all' ? 'bg-rose-50 text-rose-800 font-bold' : 'text-gray-600 hover:text-botanical'
                }`}
              >
                All Edits
              </button>
              {collections.map((col) => (
                <button
                  key={col._id}
                  onClick={() => setCollection(col.slug)}
                  className={`block text-xs w-full text-left py-1 px-2 rounded-md ${
                    collection === col.slug ? 'bg-rose-50 text-rose-800 font-bold' : 'text-gray-600 hover:text-botanical'
                  }`}
                >
                  {col.title}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal">Price Range ({config.currency.symbol})</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-ivory text-xs px-2.5 py-1.5 rounded-lg border border-gray-200"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-ivory text-xs px-2.5 py-1.5 rounded-lg border border-gray-200"
              />
            </div>
          </div>

          {/* Sizes Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal">Size</label>
            <div className="flex flex-wrap gap-1.5">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-medium border ${
                    selectedSize === sz
                      ? 'bg-botanical text-ivory border-botanical'
                      : 'bg-ivory text-gray-600 border-gray-200 hover:border-botanical'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Container */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-rose-100" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center border border-rose-100 space-y-4">
              <h3 className="font-editorial text-2xl font-bold text-botanical">We couldn't find that style.</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try clearing some filters or searching for another keyword like "Saree", "Organza", or "Kurti".
              </p>
              <button
                onClick={resetFilters}
                className="bg-botanical text-ivory px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-botanical-light transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <StaggerContainer staggerDelay={0.05} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <StaggerItem key={product._id}>
                  <ProductCard product={product} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-serif">Loading Anthurium Catalogue...</div>}>
      <ShopContent />
    </Suspense>
  );
}
