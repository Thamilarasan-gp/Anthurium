'use client';

import React from 'react';
import { MapPin, Phone, Clock, MessageCircle, Navigation, Mail } from 'lucide-react';
import { useStoreConfig } from '../../components/providers/StoreConfigContext';

export default function StorePage() {
  const { config } = useStoreConfig();

  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${config.brandName} Boutique ${config.address.street} ${config.address.city}`
  )}`;

  const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
    `Hi ${config.brandName}, I am planning to visit your store in ${config.address.city}. Could you confirm boutique hours today?`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-20">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose-700">BOUTIQUE ATELIER</span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-botanical">Store Locator</h1>
        <p className="text-xs text-gray-500 font-light leading-relaxed">
          Come experience Anthurium in person. Touch pure organza fabrics, try on bespoke fits, and enjoy filter coffee.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-8 sm:p-12 rounded-3xl border border-rose-100/60 shadow-soft">
        {/* Store Info */}
        <div className="space-y-6">
          <div>
            <h2 className="font-editorial text-3xl font-bold text-botanical">{config.brandName} Flagship Boutique</h2>
            <p className="text-xs text-rose-700 font-serif italic mt-1">"Come experience Anthurium."</p>
          </div>

          <div className="space-y-4 text-xs text-charcoal/80">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-botanical uppercase tracking-wider text-[11px]">Address</h4>
                <p className="font-light mt-0.5">{config.address.street}</p>
                <p className="font-light">{config.address.city}, {config.address.state} - {config.address.pincode}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-botanical uppercase tracking-wider text-[11px]">Boutique Hours</h4>
                <p className="font-light mt-0.5">Monday - Saturday: 10:00 AM - 8:30 PM</p>
                <p className="font-light">Sunday: 11:00 AM - 7:00 PM</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-botanical uppercase tracking-wider text-[11px]">Phone & WhatsApp</h4>
                <p className="font-light mt-0.5">{config.phone}</p>
                <p className="font-light">{config.email}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-botanical hover:bg-botanical-dark text-ivory px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center space-x-2 transition"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center space-x-2 transition"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Store Image / Map Preview */}
        <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] relative bg-warm-beige">
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=80"
            alt="Anthurium Boutique Storefront"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl text-center shadow-xl max-w-xs">
              <MapPin className="w-8 h-8 text-rose-600 mx-auto mb-1 animate-bounce" />
              <h4 className="font-editorial text-base font-bold text-botanical">{config.brandName} Coimbatore</h4>
              <p className="text-[10px] text-gray-500">Race Course Road, Near Thomas Park</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
