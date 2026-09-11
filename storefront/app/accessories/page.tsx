import React from 'react';
import { CategoryView } from '../../components/category/CategoryView';

export default function AccessoriesPage() {
  return (
    <CategoryView
      slug="accessories"
      title="Boutique Accessories"
      tagline="The finishing touch of Indian artistry."
      description="Handmade velvet zardozi potli bags, antique brass Anthurium leaf earrings with kundan, and artisan embroidered silk scarves."
      heroImage="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=80"
    />
  );
}
