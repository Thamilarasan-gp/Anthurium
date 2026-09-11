import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { Collection } from '../models/Collection';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      collection,
      search,
      minPrice,
      maxPrice,
      color,
      size,
      fabric,
      badge,
      inStock,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query: any = { status: 'active' };

    if (category) {
      const catDoc = await Category.findOne({ slug: category });
      if (catDoc) {
        query.category = catDoc._id;
      } else if (category !== 'all') {
        query.category = category;
      }
    }

    if (collection) {
      const colDoc = await Collection.findOne({ slug: collection });
      if (colDoc) {
        query.collections = colDoc._id;
      }
    }

    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }, { sku: searchRegex }, { fabric: searchRegex }];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (color) {
      query['colors.name'] = new RegExp(String(color), 'i');
    }

    if (size) {
      query.sizes = String(size);
    }

    if (fabric) {
      query.fabric = new RegExp(String(fabric), 'i');
    }

    if (badge) {
      query.badges = String(badge);
    }

    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    if (sort === 'price_desc') sortOptions = { price: -1 };
    if (sort === 'popularity') sortOptions = { numReviews: -1, rating: -1 };
    if (sort === 'featured') sortOptions = { featured: -1, createdAt: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(50, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('collections', 'title slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: products.length,
      total: totalProducts,
      page: pageNum,
      pages: Math.ceil(totalProducts / limitNum),
      products
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching products' });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug })
      .populate('category')
      .populate('collections');

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching product' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('category').populate('collections');

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching product' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = req.body;

    if (!productData.slug && productData.title) {
      productData.slug = productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const product = await Product.create(productData);
    res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error creating product' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json({ success: true, message: 'Product updated successfully', product });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error updating product' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting product' });
  }
};

export const getAllProductsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find()
      .populate('category', 'name slug')
      .populate('collections', 'title slug')
      .sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching admin products' });
  }
};

