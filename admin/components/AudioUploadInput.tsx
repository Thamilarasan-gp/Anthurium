'use client';

import React, { useState, useRef, useEffect } from 'react';
import { adminApi } from '../lib/adminApi';
import { Upload, Music, Loader2, X, Play, Pause, ExternalLink } from 'lucide-react';

interface AudioUploadInputProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  required?: boolean;
  description?: string;
  className?: string;
}

export const AudioUploadInput: React.FC<AudioUploadInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Enter audio URL or upload MP3 / WAV file...',
  required = false,
  description,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Stop playback if value changes or clears
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      audioRef.current = null;
    }
  }, [value]);

  const handleTogglePlayPreview = () => {
    if (!value) return;

    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(value);
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.onerror = () => {
          setIsPlaying(false);
          setUploadError('Failed to play preview audio. Please check format or URL.');
        };
      }
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Audio preview play error:', err);
          setIsPlaying(false);
        });
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Check audio extension or MIME
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/m4a', 'audio/x-m4a', 'audio/aac', 'audio/ogg', 'audio/flac'];
    const hasAudioExt = /\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(file.name);

    if (!file.type.startsWith('audio/') && !validTypes.includes(file.type) && !hasAudioExt) {
      setUploadError('Please select a valid audio file (.mp3, .wav, .m4a, .aac, .ogg)');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const res = await adminApi.uploadAudio(file);
      if (res.success && res.url) {
        onChange(res.url);
      } else {
        setUploadError(res.message || 'Audio upload to Cloudinary failed');
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

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-300">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 bg-[#0F172A] border border-[#334155] rounded-xl focus-within:border-emerald-500/80 transition">
        {/* Play/Pause Audio Preview Pill if URL exists */}
        {value && (
          <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
            <button
              type="button"
              onClick={handleTogglePlayPreview}
              title={isPlaying ? 'Pause Preview' : 'Play Audio Preview'}
              className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center hover:bg-emerald-400 transition"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
            <span className="text-[11px] font-mono text-emerald-300 hidden sm:inline">
              {isPlaying ? 'Playing...' : 'Audio Ready'}
            </span>
          </div>
        )}

        {/* Audio URL Input */}
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
            className="w-full px-3 py-1.5 bg-transparent text-slate-100 text-xs sm:text-sm font-mono placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {/* Upload Audio Button */}
        <div className="flex items-center gap-1.5 shrink-0 px-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
            accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
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
                <span>Uploading Audio...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Audio</span>
              </>
            )}
          </button>

          {value && (
            <>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                title="Open audio file in new tab"
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => onChange('')}
                title="Clear Audio"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {description && <p className="text-[11px] text-slate-400">{description}</p>}
      {uploadError && <p className="text-[11px] text-rose-400">{uploadError}</p>}
    </div>
  );
};
