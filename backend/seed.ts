import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { User } from './src/models/User';
import { Category } from './src/models/Category';
import { Collection } from './src/models/Collection';
import { Product } from './src/models/Product';
import { HeroSection } from './src/models/HeroSection';
import { Story } from './src/models/Story';
import { Lookbook } from './src/models/Lookbook';
import { Mood } from './src/models/Mood';
import { Review } from './src/models/Review';
import { Coupon } from './src/models/Coupon';
import { WebsiteSettings } from './src/models/WebsiteSettings';

dotenv.config();

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore fallback if restricted
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anthurium';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Collection.deleteMany({}),
      Product.deleteMany({}),
      HeroSection.deleteMany({}),
      Story.deleteMany({}),
      Lookbook.deleteMany({}),
      Mood.deleteMany({}),
      Review.deleteMany({}),
      Coupon.deleteMany({}),
      WebsiteSettings.deleteMany({})
    ]);

    console.log('Cleared existing collections.');

    // 1. Create Admin & Customer Users
    const adminUser = await User.create({
      name: 'Anthurium Admin',
      email: 'admin@anthurium.com',
      password: 'adminpassword123',
      phone: '+91 98765 43210',
      role: 'admin',
      addresses: [
        {
          name: 'Anthurium Boutique Store',
          phone: '+91 98765 43210',
          street: 'Perumal alai, Thiruchengode',
          city: 'Namakkal',
          state: 'Tamil Nadu',
          pincode: '641018',
          country: 'India',
          isDefault: true
        }
      ]
    });

    const demoCustomer = await User.create({
      name: 'Ananya Sharma',
      email: 'customer@anthurium.com',
      password: 'customerpassword123',
      phone: '+91 99887 76655',
      role: 'customer',
      addresses: [
        {
          name: 'Ananya Sharma',
          phone: '+91 99887 76655',
          street: '45, RS Puram, West Club Road',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          pincode: '641002',
          country: 'India',
          isDefault: true
        }
      ]
    });

    console.log('Created Users (Admin & Customer).');

    // 2. Categories
    const categoriesData = [
      {
        name: 'Sarees',
        slug: 'sarees',
        description: 'Handcrafted drapes woven with elegance, heritage silk, organza, and tissue.',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        displayOrder: 1,
        featured: true
      },
      {
        name: 'Kurtis',
        slug: 'kurtis',
        description: 'Breezy handcrafted silhouettes, chanderi weaves, and everyday elegance.',
        image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80',
        displayOrder: 2,
        featured: true
      },
      {
        name: 'Dresses',
        slug: 'dresses',
        description: 'Contemporary fusion dresses with subtle Indian botanical motifs.',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
        displayOrder: 3,
        featured: true
      },
      {
        name: 'Sets',
        slug: 'sets',
        description: 'Coordinated kurti-pant sets with delicate organza dupattas.',
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
        displayOrder: 4,
        featured: true
      },
      {
        name: 'Co-ords',
        slug: 'co-ords',
        description: 'Sleek luxury linen and silk co-ord sets for modern effortless style.',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        displayOrder: 5,
        featured: true
      },
      {
        name: 'Festive Wear',
        slug: 'festive-wear',
        description: 'Opulent regal ensembles adorned with zardozi and gota patti craftsmanship.',
        image: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=800&q=80',
        displayOrder: 6,
        featured: true
      },
      {
        name: 'Office Wear',
        slug: 'office-wear',
        description: 'Sophisticated cotton-linen handloom edit tailored for power and grace.',
        image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80',
        displayOrder: 7,
        featured: true
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Handmade potli bags, brass jewellery, and botanical embroidered scarves.',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
        displayOrder: 8,
        featured: true
      }
    ];

    const categories = await Category.insertMany(categoriesData);
    const catMap = new Map(categories.map((c) => [c.slug, c._id]));
    console.log('Created 8 Categories.');

    // 3. Collections
    const collectionsData = [
      {
        title: 'New Arrivals',
        slug: 'new-arrivals',
        description: 'Fresh off the loom. Explore the latest botanical fashion drop.',
        bannerImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
        displayOrder: 1,
        featured: true
      },
      {
        title: 'Festive Edit',
        slug: 'festive',
        description: 'Celebrate in deep jewel tones, radiant silks, and zardozi detailing.',
        bannerImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=80',
        displayOrder: 2,
        featured: true
      },
      {
        title: 'Wedding Stories',
        slug: 'wedding',
        description: 'Timeless couture ensembles crafted for memorable Indian wedding celebrations.',
        bannerImage: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80',
        displayOrder: 3,
        featured: true
      },
      {
        title: 'Everyday Grace',
        slug: 'everyday',
        description: 'Comfort meets refined elegance in pure breathable handlooms.',
        bannerImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80',
        displayOrder: 4,
        featured: true
      },
      {
        title: 'Occasion Wear',
        slug: 'occasion',
        description: 'Statement sarees and silk sets tailored for cocktail & dinner evenings.',
        bannerImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80',
        displayOrder: 5,
        featured: true
      }
    ];

    const collections = await Collection.insertMany(collectionsData);
    const colMap = new Map(collections.map((c) => [c.slug, c._id]));
    console.log('Created 5 Collections.');

    // 4. Products (30 Realistic Fashion Products)
    const rawProducts = [
      // Sarees
      {
        title: 'Rose Organza Saree',
        slug: 'rose-organza-saree',
        description: 'Ethereal sheer rose pink organza saree featuring hand-painted botanical Anthurium floral motifs and delicate hand embroidery along the borders.',
        shortDescription: 'Rose pink sheer organza saree with hand-painted floral embroidery.',
        category: catMap.get('sarees'),
        collections: [colMap.get('new-arrivals'), colMap.get('occasion')],
        price: 8999,
        salePrice: 7499,
        sku: 'ANT-SAR-001',
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80'
        ],
        colors: [{ name: 'Rose Pink', hex: '#E8C5C8' }],
        sizes: ['Free Size'],
        fabric: 'Pure Silk Organza',
        careInstructions: 'Dry clean only',
        fit: 'Standard Drape 5.5m + Unstitched Blouse Piece 0.8m',
        stock: 12,
        badges: ['Bestseller', 'New'],
        featured: true,
        bestseller: true,
        trending: true,
        newArrival: true
      },
      {
        title: 'Madhubani Love Saree',
        slug: 'madhubani-love-saree',
        description: 'Authentic hand-painted Madhubani art saree on pure Tussar silk. Features traditional Indian bird and floral narratives crafted by master artisans.',
        shortDescription: 'Tussar silk saree adorned with hand-painted Madhubani folk art.',
        category: catMap.get('sarees'),
        collections: [colMap.get('festive'), colMap.get('wedding')],
        price: 14500,
        salePrice: 12999,
        sku: 'ANT-SAR-002',
        images: [
          'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80'
        ],
        colors: [{ name: 'Beige & Terracotta', hex: '#A3524E' }],
        sizes: ['Free Size'],
        fabric: 'Handloom Tussar Silk',
        careInstructions: 'Dry clean only',
        fit: 'Standard Drape 5.5m + Blouse',
        stock: 5,
        badges: ['Limited'],
        featured: true,
        bestseller: true
      },
      {
        title: 'Blush Pink Georgette Saree',
        slug: 'blush-pink-georgette-saree',
        description: 'Soft pastel pink georgette saree featuring intricate silver zari weave and hand-sewn pearl tassels.',
        shortDescription: 'Pastel blush pink georgette saree with silver zari embroidery.',
        category: catMap.get('sarees'),
        collections: [colMap.get('occasion'), colMap.get('wedding')],
        price: 9800,
        salePrice: 8499,
        sku: 'ANT-SAR-003',
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'
        ],
        colors: [{ name: 'Blush Pink', hex: '#F3D2D5' }],
        sizes: ['Free Size'],
        fabric: 'Viscose Georgette',
        careInstructions: 'Dry clean only',
        stock: 8,
        badges: ['Trending'],
        trending: true
      },
      {
        title: 'Emerald Kanjeevaram Silk Saree',
        slug: 'emerald-kanjeevaram-silk-saree',
        description: 'Regal deep emerald green handloom Kanjeevaram silk saree with pure gold zari borders and rich pallu detailing.',
        shortDescription: 'Regal emerald green Kanjeevaram silk saree with gold zari.',
        category: catMap.get('sarees'),
        collections: [colMap.get('wedding'), colMap.get('festive')],
        price: 24999,
        salePrice: 21999,
        sku: 'ANT-SAR-004',
        images: [
          'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=1000&q=80'
        ],
        colors: [{ name: 'Emerald Green', hex: '#2E4036' }],
        sizes: ['Free Size'],
        fabric: 'Pure Mulberry Silk',
        careInstructions: 'Dry clean only',
        stock: 4,
        badges: ['Bestseller'],
        bestseller: true
      },
      {
        title: 'Sage Green Tissue Silk Saree',
        slug: 'sage-green-tissue-silk-saree',
        description: 'Luminous sage green tissue silk drape infused with subtle metallic sheen and scallop embroidered edges.',
        shortDescription: 'Shimmering tissue silk saree in soothing sage green tone.',
        category: catMap.get('sarees'),
        collections: [colMap.get('new-arrivals')],
        price: 11200,
        sku: 'ANT-SAR-005',
        images: [
          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80'
        ],
        colors: [{ name: 'Sage Green', hex: '#8FA382' }],
        sizes: ['Free Size'],
        fabric: 'Tissue Silk',
        careInstructions: 'Dry clean only',
        stock: 7,
        badges: ['New'],
        newArrival: true
      },

      // Kurtis
      {
        title: 'Classic Off White Kurti',
        slug: 'classic-off-white-kurti',
        description: 'Graceful straight-cut A-line kurti woven in pure Chanderi cotton silk with delicate chikankari hand embroidery.',
        shortDescription: 'Chanderi cotton silk off-white kurti with fine chikankari work.',
        category: catMap.get('kurtis'),
        collections: [colMap.get('everyday')],
        price: 3499,
        salePrice: 2999,
        sku: 'ANT-KUR-001',
        images: [
          'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1000&q=80'
        ],
        colors: [{ name: 'Off White', hex: '#FAF7F2' }],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        fabric: 'Chanderi Cotton Silk',
        careInstructions: 'Gentle hand wash in cold water',
        fit: 'Relaxed Straight Fit',
        stock: 20,
        badges: ['Bestseller'],
        featured: true,
        bestseller: true
      },
      {
        title: 'Leaf Green Kurti',
        slug: 'leaf-green-kurti',
        description: 'Soothing leaf green handblock printed cotton kurti with wooden button detailing and quarter sleeves.',
        shortDescription: 'Pure handblock cotton kurti in serene leaf green shade.',
        category: catMap.get('kurtis'),
        collections: [colMap.get('everyday')],
        price: 2499,
        sku: 'ANT-KUR-002',
        images: [
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
        ],
        colors: [{ name: 'Leaf Green', hex: '#3B5945' }],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        fabric: '100% Mulmul Cotton',
        careInstructions: 'Machine wash soft cycle',
        stock: 15,
        badges: ['New'],
        newArrival: true
      },
      {
        title: 'Aaliyah Kurti Set',
        slug: 'aaliyah-kurti-set',
        description: 'Designer 3-piece kurti set in subtle lilac tone featuring flared Anarkali silhouette, straight trousers, and hand-embroidered organza dupatta.',
        shortDescription: 'Lilac Anarkali kurti set with embroidered organza dupatta.',
        category: catMap.get('sets'),
        collections: [colMap.get('festive'), colMap.get('new-arrivals')],
        price: 6999,
        salePrice: 5999,
        sku: 'ANT-SET-001',
        images: [
          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80'
        ],
        colors: [{ name: 'Lilac Rose', hex: '#D8B4C8' }],
        sizes: ['S', 'M', 'L', 'XL'],
        fabric: 'Mulberry Silk Blend',
        careInstructions: 'Dry clean recommended',
        fit: 'Tailored Anarkali Fit',
        stock: 10,
        badges: ['Trending', 'Bestseller'],
        featured: true,
        trending: true,
        bestseller: true
      },
      {
        title: 'Lavender Kurti Set',
        slug: 'lavender-kurti-set',
        description: 'Pastel lavender silk blend straight tunic with cutwork embroidered neckline, tapered pants, and printed silk scarf.',
        shortDescription: 'Elegant pastel lavender tunic set with cutwork embroidery.',
        category: catMap.get('sets'),
        collections: [colMap.get('everyday'), colMap.get('occasion')],
        price: 5499,
        salePrice: 4799,
        sku: 'ANT-SET-002',
        images: [
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80'
        ],
        colors: [{ name: 'Lavender', hex: '#E2D5F8' }],
        sizes: ['S', 'M', 'L', 'XL'],
        fabric: 'Pure Cotton Silk',
        careInstructions: 'Hand wash with mild detergent',
        stock: 14,
        badges: ['New'],
        newArrival: true
      },

      // Dresses
      {
        title: 'Gulmarg Floral Tiered Maxi Dress',
        slug: 'gulmarg-floral-tiered-maxi-dress',
        description: 'Vibrant hand-drawn Indian botanical print tiered maxi dress with cinched waist and breezy puff sleeves.',
        shortDescription: 'Hand-printed botanical tiered maxi dress in soft natural fabric.',
        category: catMap.get('dresses'),
        collections: [colMap.get('everyday'), colMap.get('new-arrivals')],
        price: 4999,
        salePrice: 4299,
        sku: 'ANT-DRS-001',
        images: [
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80'
        ],
        colors: [{ name: 'Terracotta Floral', hex: '#C47B89' }],
        sizes: ['XS', 'S', 'M', 'L'],
        fabric: 'Organic Bamboo Viscose',
        careInstructions: 'Hand wash cold',
        stock: 9,
        badges: ['Trending'],
        featured: true,
        trending: true
      },
      {
        title: 'Ivory Gold Midi Wrap Dress',
        slug: 'ivory-gold-midi-wrap-dress',
        description: 'Contemporary wrap dress crafted from handwoven ivory cotton embellished with subtle woven gold lurex stripes.',
        shortDescription: 'Handwoven ivory wrap midi dress with delicate gold metallic yarn.',
        category: catMap.get('dresses'),
        collections: [colMap.get('occasion')],
        price: 5200,
        sku: 'ANT-DRS-002',
        images: [
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80'
        ],
        colors: [{ name: 'Ivory Gold', hex: '#F5EFE6' }],
        sizes: ['S', 'M', 'L', 'XL'],
        fabric: 'Handloom Cotton Lurex',
        careInstructions: 'Dry clean only',
        stock: 11,
        badges: ['New'],
        newArrival: true
      },

      // Co-ords
      {
        title: 'Terracotta Linen Co-ord Set',
        slug: 'terracotta-linen-co-ord-set',
        description: 'Minimalist 2-piece modern boutique co-ord consisting of a button-down asymmetric tunic and wide-leg trousers.',
        shortDescription: 'Pure linen terracotta tunic and trouser co-ord set.',
        category: catMap.get('co-ords'),
        collections: [colMap.get('everyday'), colMap.get('new-arrivals')],
        price: 4599,
        salePrice: 3999,
        sku: 'ANT-CRD-001',
        images: [
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
        ],
        colors: [{ name: 'Warm Terracotta', hex: '#A3524E' }],
        sizes: ['S', 'M', 'L', 'XL'],
        fabric: '100% European Linen',
        careInstructions: 'Gentle machine wash',
        stock: 8,
        badges: ['Bestseller'],
        featured: true,
        bestseller: true
      },
      {
        title: 'Botanical Green Silk Blazer Co-ord',
        slug: 'botanical-green-silk-blazer-co-ord',
        description: 'Statement tailored silk jacket with hand-embroidered Anthurium lapel accent paired with matching trousers.',
        shortDescription: 'Tailored botanical green silk blazer & trouser set.',
        category: catMap.get('co-ords'),
        collections: [colMap.get('occasion'), colMap.get('new-arrivals')],
        price: 8499,
        sku: 'ANT-CRD-002',
        images: [
          'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1000&q=80'
        ],
        colors: [{ name: 'Botanical Green', hex: '#2E4036' }],
        sizes: ['XS', 'S', 'M', 'L'],
        fabric: 'Raw Silk',
        careInstructions: 'Dry clean only',
        stock: 6,
        badges: ['Limited'],
        trending: true
      },

      // Festive Wear
      {
        title: 'Royal Ruby Zardozi Lehenga',
        slug: 'royal-ruby-zardozi-lehenga',
        description: 'Opulent crimson velvet lehenga hand-embroidered with antique gold zardozi, dabka, and pearl work for festive bridal grandeur.',
        shortDescription: 'Opulent crimson red velvet lehenga with handcrafted gold zardozi.',
        category: catMap.get('festive-wear'),
        collections: [colMap.get('wedding'), colMap.get('festive')],
        price: 38900,
        salePrice: 34999,
        sku: 'ANT-FST-001',
        images: [
          'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80'
        ],
        colors: [{ name: 'Crimson Red', hex: '#8B1E24' }],
        sizes: ['S', 'M', 'L', 'Custom'],
        fabric: 'Micro Velvet & Net Dupatta',
        careInstructions: 'Specialist Dry Clean',
        stock: 3,
        badges: ['Limited', 'Bestseller'],
        featured: true,
        bestseller: true
      },
      {
        title: 'Marigold Yellow Gota Patti Sharara Set',
        slug: 'marigold-yellow-gota-patti-sharara-set',
        description: 'Festive marigold yellow georgette kurti with multi-flared sharara and heavy gota patti gold borders.',
        shortDescription: 'Radiant marigold sharara set adorned with intricate gold gota patti.',
        category: catMap.get('festive-wear'),
        collections: [colMap.get('festive')],
        price: 8999,
        sku: 'ANT-FST-002',
        images: [
          'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=1000&q=80'
        ],
        colors: [{ name: 'Marigold Yellow', hex: '#E5A93C' }],
        sizes: ['S', 'M', 'L', 'XL'],
        fabric: 'Faux Georgette',
        careInstructions: 'Dry clean only',
        stock: 9,
        badges: ['Trending'],
        trending: true
      },

      // Office Wear
      {
        title: 'Khadi Cotton Handloom Tunic',
        slug: 'khadi-cotton-handloom-tunic',
        description: 'Structured formal khadi cotton shirt tunic featuring Mandarin collar and concealed placket.',
        shortDescription: 'Handspun khadi cotton formal tunic for effortless office style.',
        category: catMap.get('office-wear'),
        collections: [colMap.get('everyday')],
        price: 2199,
        sku: 'ANT-OFF-001',
        images: [
          'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1000&q=80'
        ],
        colors: [{ name: 'Natural Khadi', hex: '#EFE8DE' }],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        fabric: '100% Handloom Khadi Cotton',
        careInstructions: 'Hand wash separately',
        stock: 18,
        badges: ['Bestseller']
      },
      {
        title: 'Charcoal Linen Formal Trousers',
        slug: 'charcoal-linen-formal-trousers',
        description: 'High-waisted pleated tailored trousers in breathable charcoal linen with side pockets.',
        shortDescription: 'Tailored high-waisted charcoal linen trousers for power dressing.',
        category: catMap.get('office-wear'),
        collections: [colMap.get('everyday')],
        price: 2799,
        sku: 'ANT-OFF-002',
        images: [
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'
        ],
        colors: [{ name: 'Charcoal Grey', hex: '#333333' }],
        sizes: ['26', '28', '30', '32', '34'],
        fabric: 'Pure Linen',
        careInstructions: 'Machine wash gentle',
        stock: 15,
        badges: ['New']
      },

      // Accessories
      {
        title: 'Zardozi Embroidered Velvet Potli',
        slug: 'zardozi-embroidered-velvet-potli',
        description: 'Handmade dark forest green velvet potli bag with gold pearl drawstring handle and floral zardozi motifs.',
        shortDescription: 'Handcrafted velvet potli bag with pearl handle and zardozi embroidery.',
        category: catMap.get('accessories'),
        collections: [colMap.get('wedding'), colMap.get('festive')],
        price: 1999,
        salePrice: 1699,
        sku: 'ANT-ACC-001',
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80'
        ],
        colors: [{ name: 'Forest Green', hex: '#1C3125' }],
        sizes: ['One Size'],
        fabric: 'Velvet & Pearls',
        careInstructions: 'Wipe clean with dry cloth',
        stock: 25,
        badges: ['Bestseller'],
        featured: true,
        bestseller: true
      },
      {
        title: 'Antique Brass Anthurium Earrings',
        slug: 'antique-brass-anthurium-earrings',
        description: 'Hand-carved antique gold brass statement earrings inspired by Anthurium flower petals with kundan stones.',
        shortDescription: 'Handmade antique brass statement earrings with kundan accents.',
        category: catMap.get('accessories'),
        collections: [colMap.get('occasion'), colMap.get('new-arrivals')],
        price: 1499,
        sku: 'ANT-ACC-002',
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80'
        ],
        colors: [{ name: 'Antique Gold', hex: '#C59B27' }],
        sizes: ['One Size'],
        fabric: 'Brass & Kundan',
        careInstructions: 'Keep away from moisture',
        stock: 30,
        badges: ['New'],
        newArrival: true
      }
    ];

    // Duplicate & populate remaining products to reach 30 products
    const allProductsToInsert = [...rawProducts];
    let counter = 1;
    while (allProductsToInsert.length < 30) {
      const base = rawProducts[counter % rawProducts.length];
      const newSlug = `${base.slug}-edition-${counter}`;
      allProductsToInsert.push({
        ...base,
        title: `${base.title} (Heritage Edit ${counter})`,
        slug: newSlug,
        sku: `${base.sku}-${counter}`,
        price: base.price + counter * 150,
        stock: Math.floor(Math.random() * 15) + 3
      });
      counter++;
    }

    const insertedProducts = await Product.insertMany(allProductsToInsert);
    console.log(`Created ${insertedProducts.length} Products.`);

    // 5. Hero Sections (CMS Dynamic Sliders)
    await HeroSection.create([
      {
        heading: 'For Her Every Chapter',
        highlightedHeading: 'Looks Beautiful',
        supportingText: 'Graceful handcrafted styles for your everyday moments and special festive days.',
        primaryCtaText: 'Explore Collection',
        primaryCtaLink: '/shop',
        secondaryCtaText: 'Play Our Story',
        secondaryCtaLink: '/lookbook',
        desktopImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
        mobileImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        audioTrack: {
          title: 'Anthurium Vibes',
          subtitle: 'Fashion Blooms Here',
          audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
          thumbnailUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80'
        },
        sideText: 'Good Outfits. Better Moods.',
        displayOrder: 1,
        isActive: true
      },
      {
        heading: 'Festive Blossom',
        highlightedHeading: 'Couture Edit 2026',
        supportingText: 'Celebrate Indian heritage with regal silk sarees and handcrafted zardozi ensembles.',
        primaryCtaText: 'Shop Festive Edit',
        primaryCtaLink: '/collections/festive',
        secondaryCtaText: 'View Lookbook',
        secondaryCtaLink: '/lookbook',
        desktopImageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=80',
        mobileImageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
        audioTrack: {
          title: 'Royal Indian Sitar Mood',
          subtitle: 'Anthurium Festive Beats',
          audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
          thumbnailUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=300&q=80'
        },
        sideText: 'Handcrafted Heritage.',
        displayOrder: 2,
        isActive: true
      }
    ]);
    console.log('Created Hero Sections.');

    // 6. Instagram Stories / Reels ("Shop This Look")
    const sampleProductIds = insertedProducts.slice(0, 3).map((p) => p._id);
    await Story.create([
      {
        title: 'Everyday Elegance',
        caption: 'Breezy Chanderi cotton kurti styled for morning coffee & boutique visits.',
        instagramUrl: 'https://instagram.com/anthurium.official',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=400&q=80',
        viewsCount: 12400,
        likesCount: 1890,
        linkedProducts: [sampleProductIds[0], sampleProductIds[1]],
        category: 'Everyday Elegance',
        featured: true,
        displayOrder: 1,
        isActive: true
      },
      {
        title: 'Fabric Stories',
        caption: 'Behind the loom: Hand-painted rose organza drape details.',
        instagramUrl: 'https://instagram.com/anthurium.official',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
        viewsCount: 8100,
        likesCount: 1240,
        linkedProducts: [sampleProductIds[0]],
        category: 'Fabric Stories',
        featured: true,
        displayOrder: 2,
        isActive: true
      },
      {
        title: 'Festive Fits',
        caption: 'Royal ruby velvet lehenga draped for a Coimbatore wedding celebration.',
        instagramUrl: 'https://instagram.com/anthurium.official',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80',
        viewsCount: 24700,
        likesCount: 3820,
        linkedProducts: [sampleProductIds[2]],
        category: 'Festive Fits',
        featured: true,
        displayOrder: 3,
        isActive: true
      },
      {
        title: 'Customers Love',
        caption: 'Ananya wearing our Aaliyah Kurti Set in Coimbatore.',
        instagramUrl: 'https://instagram.com/anthurium.official',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80',
        viewsCount: 18300,
        likesCount: 2950,
        linkedProducts: [sampleProductIds[1]],
        category: 'Customers Love',
        featured: true,
        displayOrder: 4,
        isActive: true
      }
    ]);
    console.log('Created Instagram Stories.');

    // 7. Lookbook
    await Lookbook.create([
      {
        title: 'The Festive Edit 2026',
        subtitle: 'Heritage woven in every thread',
        description: 'An editorial tribute to classical Indian textiles, warm blush tones, and gold zardozi artistry.',
        imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=80',
        storyQuote: '"Elegance is the only beauty that never fades."',
        hotspots: [
          { x: 35, y: 40, product: sampleProductIds[0], title: 'Rose Organza Saree' },
          { x: 70, y: 65, product: sampleProductIds[2], title: 'Royal Ruby Lehenga' }
        ],
        displayOrder: 1,
        isActive: true
      }
    ]);

    // 8. Experiential Mood Tracks
    await Mood.create([
      {
        name: 'Morning',
        tagline: 'Fresh crisp cottons & gentle morning light',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
        bgImageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
        themeColor: '#8FA382',
        products: [insertedProducts[5]._id, insertedProducts[6]._id],
        displayOrder: 1,
        isActive: true
      },
      {
        name: 'Festive',
        tagline: 'Deep jewel tones & celebratory sangeet rhythms',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
        bgImageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80',
        themeColor: '#C47B89',
        products: [insertedProducts[0]._id, insertedProducts[1]._id],
        displayOrder: 2,
        isActive: true
      },
      {
        name: 'Wedding',
        tagline: 'Bridal grandeur & timeless gold zardozi',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
        bgImageUrl: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=1200&q=80',
        themeColor: '#2E4036',
        products: [insertedProducts[3]._id, insertedProducts[13]._id],
        displayOrder: 3,
        isActive: true
      }
    ]);

    // 9. Customer Reviews & Testimonials
    await Review.create([
      {
        product: insertedProducts[0]._id,
        user: demoCustomer._id,
        customerName: 'Priya Sundaram',
        rating: 5,
        title: 'Breathtaking organza quality!',
        comment: 'The Rose Organza Saree is even more exquisite in person. The hand-painted flowers feel like a piece of wearable art. Highly recommended!',
        status: 'approved',
        featured: true
      },
      {
        product: insertedProducts[5]._id,
        customerName: 'Meera Iyer',
        rating: 5,
        title: 'Perfect for Coimbatore heat',
        comment: 'Loved the fabric of the Classic Off White Kurti. Soft, breathable, and so elegant for my boutique meetings.',
        status: 'approved',
        featured: true
      },
      {
        product: insertedProducts[7]._id,
        customerName: 'Kavita Menon',
        rating: 5,
        title: 'Stunning fit!',
        comment: 'The Aaliyah Kurti Set fits like a dream! Received so many compliments at a family function.',
        status: 'approved',
        featured: true
      }
    ]);

    // 10. Coupons
    await Coupon.create([
      {
        code: 'BLOOM10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 2000,
        maxDiscountAmount: 1000,
        isActive: true
      },
      {
        code: 'WELCOME500',
        discountType: 'fixed',
        discountValue: 500,
        minOrderAmount: 3000,
        isActive: true
      }
    ]);

    // 11. Website Settings (Multi-Client Configuration)
    await WebsiteSettings.create({
      storeId: 'anthurium-default',
      brandName: 'ANTHURIUM',
      tagline: 'FASHION BLOOMS HERE',
      primaryColor: '#2E4036',
      accentColor: '#E8C5C8',
      bgIvory: '#FAF7F2',
      fontSerif: 'Playfair Display',
      fontSans: 'Outfit',
      phone: '+91 98765 43210',
      whatsappNumber: '919876543210',
      email: 'hello@anthuriumboutique.com',
      address: {
        street: '142, Race Course Road, Near Thomas Park',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        pincode: '641018',
        country: 'India'
      },
      socialLinks: {
        instagram: 'https://instagram.com/anthurium.official',
        facebook: 'https://facebook.com/anthuriumboutique',
        pinterest: 'https://pinterest.com/anthuriumboutique',
        youtube: 'https://youtube.com/@anthuriumboutique'
      },
      currency: { code: 'INR', symbol: '₹' },
      taxRate: 0.05,
      freeShippingThreshold: 2999,
      shippingFee: 150,
      codEnabled: true,
      codFee: 99,
      announcementBarText: '✨ Free Express Shipping across India on orders above ₹2,999 | Handcrafted Festive Collection Live'
    });

    console.log('✅ Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
