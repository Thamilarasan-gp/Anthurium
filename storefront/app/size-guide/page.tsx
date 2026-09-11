'use client';

import React from 'react';

export default function SizeGuidePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-20">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose-700">FIT & MEASUREMENTS</span>
        <h1 className="font-editorial text-4xl font-bold text-botanical">Anthurium Size Guide</h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          All measurements are in inches. Our silhouettes are designed with comfortable Indian tailoring standards.
        </p>
      </div>

      {/* Kurtis & Tunic Table */}
      <div className="bg-white rounded-3xl p-6 border border-rose-100/60 shadow-soft space-y-4">
        <h3 className="font-editorial text-xl font-bold text-botanical">Kurtis & Sets Measurements (Inches)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-cream text-botanical font-bold border-b border-rose-100">
                <th className="p-3">Size</th>
                <th className="p-3">Bust (Inches)</th>
                <th className="p-3">Waist (Inches)</th>
                <th className="p-3">Hip (Inches)</th>
                <th className="p-3">Kurti Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-charcoal/80">
              <tr>
                <td className="p-3 font-bold">XS</td>
                <td className="p-3">34"</td>
                <td className="p-3">30"</td>
                <td className="p-3">37"</td>
                <td className="p-3">44"</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">S</td>
                <td className="p-3">36"</td>
                <td className="p-3">32"</td>
                <td className="p-3">39"</td>
                <td className="p-3">45"</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">M</td>
                <td className="p-3">38"</td>
                <td className="p-3">34"</td>
                <td className="p-3">41"</td>
                <td className="p-3">45"</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">L</td>
                <td className="p-3">40"</td>
                <td className="p-3">36"</td>
                <td className="p-3">43"</td>
                <td className="p-3">46"</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">XL</td>
                <td className="p-3">42"</td>
                <td className="p-3">38"</td>
                <td className="p-3">45"</td>
                <td className="p-3">46"</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">XXL</td>
                <td className="p-3">44"</td>
                <td className="p-3">40"</td>
                <td className="p-3">47"</td>
                <td className="p-3">47"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
