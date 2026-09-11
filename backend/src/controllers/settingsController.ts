import { Request, Response } from 'express';
import { WebsiteSettings } from '../models/WebsiteSettings';

export const getWebsiteSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await WebsiteSettings.findOne({ storeId: 'anthurium-default' });

    if (!settings) {
      settings = await WebsiteSettings.create({
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
    }

    res.json({ success: true, settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching website settings' });
  }
};

export const updateWebsiteSettingsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await WebsiteSettings.findOneAndUpdate(
      { storeId: 'anthurium-default' },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, message: 'Website settings updated successfully', settings });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Error updating website settings' });
  }
};
