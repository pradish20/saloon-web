import React, { useState } from 'react';
import { X, ZoomIn, Eye } from 'lucide-react';
import { GalleryCategory, GalleryItem } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface GalleryPageProps {
  galleryItems: GalleryItem[];
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ galleryItems }) => {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('ALL');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  const categories: GalleryCategory[] = [
    'ALL',
    'HAIR',
    'STYLING',
    'GROOMING',
    'SALON',
    'TRANSFORMATIONS',
  ];

  const filteredItems = galleryItems.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="bg-[#0D0D10] text-[#EDE8E0] min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-medium block mb-3">
            Visual Portfolio
          </span>
          <h1
            className="font-serif text-3xl sm:text-5xl text-[#FAF7F2] font-normal mb-4"
            style={{ textWrap: 'balance' }}
          >
            Looks that speak for themselves.
          </h1>
          <p className="text-xs sm:text-sm text-[#9E9A92] font-light leading-relaxed">
            A glimpse inside our studio atmosphere, bespoke transformations, and signature artistry in Trichy.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto p-1.5 bg-[#121217] rounded-sm border border-[#21212B] max-w-2xl mx-auto mb-14">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-[11px] uppercase tracking-wider font-medium rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#C5A880] text-[#0D0D10]'
                    : 'text-[#99958F] hover:text-[#EDE8E0]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-24 bg-[#111116] rounded-sm border border-[#1F1F2B]">
            <p className="text-sm text-[#8E8A83]">No photographs found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveLightboxItem(item)}
                className="group relative h-80 sm:h-96 overflow-hidden rounded-sm bg-[#14141B] border border-[#20202B] cursor-pointer"
              >
                <ImageWithFallback
                  src={item.image_url}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95 group-hover:brightness-100"
                />

                {/* Scrim Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D10] via-[#0D0D10]/30 to-transparent opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-mono block mb-1">
                      {item.category}
                    </span>
                    <p className="text-xs text-[#EDE8E0] font-light leading-relaxed line-clamp-2">
                      {item.caption}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#0D0D10]/80 backdrop-blur-xs border border-[#2D2D3A] flex items-center justify-center text-[#C5A880] opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-[#09090C]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setActiveLightboxItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#111116] border border-[#272736] rounded-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveLightboxItem(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#09090C]/80 border border-[#2E2E3E] text-[#EDE8E0] hover:text-[#C5A880] flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Close photo preview"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Large Image */}
            <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
              <ImageWithFallback
                src={activeLightboxItem.image_url}
                alt={activeLightboxItem.caption}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Caption & Category */}
            <div className="p-6 bg-[#13131A] border-t border-[#20202C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-mono block mb-1">
                  {activeLightboxItem.category}
                </span>
                <p className="text-sm text-[#EDE8E0] font-light">
                  {activeLightboxItem.caption}
                </p>
              </div>

              <div className="text-[11px] text-[#7A7771] shrink-0">
                AURA Studio Portfolio
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
