'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useStoreConfig } from '../../components/providers/StoreConfigContext';

export default function ContactPage() {
  const { config } = useStoreConfig();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-20">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose-700">GET IN TOUCH</span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-botanical">Contact Anthurium</h1>
        <p className="text-xs text-gray-500 font-light">We are here to assist with custom styling, sizing questions, or order inquiries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 sm:p-12 rounded-3xl border border-rose-100/60 shadow-soft">
        {/* Contact Form */}
        <div className="space-y-6">
          <h3 className="font-editorial text-2xl font-bold text-botanical">Send Us a Message</h3>

          {submitted ? (
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 text-center space-y-2 text-emerald-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base">Message Sent Successfully!</h4>
              <p className="text-xs">Thank you for reaching out. Our boutique styling team will respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-ivory text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-ivory text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-ivory text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-ivory text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-botanical hover:bg-botanical-dark text-ivory py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg flex items-center justify-center space-x-2 transition"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Info Column */}
        <div className="space-y-6 bg-cream p-8 rounded-2xl border border-rose-100/60">
          <h3 className="font-editorial text-2xl font-bold text-botanical">Boutique Details</h3>
          <div className="space-y-4 text-xs text-charcoal/80">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-rose-700 shrink-0" />
              <span>{config.address.street}, {config.address.city}, {config.address.state} - {config.address.pincode}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-rose-700 shrink-0" />
              <span>{config.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-rose-700 shrink-0" />
              <span>{config.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
