'use client';

import React, { useState, useRef } from 'react';
import { adminApi } from '../lib/adminApi';
import { Upload, Image as ImageIcon, Loader2, X, Check, ExternalLink } from 'lucide-react';

interface ImageUploadInputProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  required?: boolean;
  description?: string;
  className?: string;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Enter image URL or upload file...',
  required = false,
  description,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP, etc.)');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const res = await adminApi.uploadImage(file);
      if (res.success && res.url) {
        onChange(res.url);
      } else {
        setUploadError(res.message || 'Image upload failed');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-300">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 bg-[#0F172A] border rounded-xl transition ${isDragOver
            ? 'border-emerald-500 bg-emerald-950/20'
            : 'border-[#334155] focus-within:border-emerald-500/80'
          }`}
      >
        {/* Preview thumbnail if URL exists */}
        {value && (
          <div className="relative group shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <button
              type="button"
              onClick={() => onChange('')}
              title="Clear Image"
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition"
            >
              <X className="w-4 h-4 text-rose-400" />
            </button>
          </div>
        )}

        {/* URL Input */}
        <div className="relative flex-1">
          <input
            type="url"
            value={value}
            onChange={(e) => {
              setUploadError(null);
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            required={required && !value}
            className="w-full px-3 py-1.5 bg-transparent text-slate-100 text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {/* Upload Button */}
        <div className="flex items-center gap-1.5 shrink-0 px-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </>
            )}
          </button>

          {value && (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              title="Open full image in new tab"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {description && <p className="text-[11px] text-slate-400">{description}</p>}
      {uploadError && <p className="text-[11px] text-rose-400">{uploadError}</p>}
    </div>
  );
};
