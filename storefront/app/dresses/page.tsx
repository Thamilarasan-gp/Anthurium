import React from 'react';
import { CategoryView } from '../../components/category/CategoryView';

export default function DressesPage() {
  return (
    <CategoryView
      slug="dresses"
      title="Dresses"
      tagline="Contemporary silhouettes with Indian botanical souls."
      description="Tiered maxi dresses, wrap midis, and organic cotton fusion silhouettes tailored with subtle hand-printed floral motifs."
      heroImage="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1600&q=80"
    />
  );
}
