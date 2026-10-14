import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Sparkles, ZoomIn } from 'lucide-react';

const categories = [
  'All',
  'Minimal',
  'French Tips',
  'Chrome',
  'Floral',
  'Bridal',
  'Glitter',
  '3D Art',
  'Seasonal Trends',
];

const GalleryGrid = ({ items = [], showFilters = true }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filteredItems =
    selectedCategory === 'All'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  return (
    <div>
      {/* Category Filter Pills */}
      {showFilters && (
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#572A39] text-[#FAF7F2] shadow-sm'
                  : 'bg-white border border-[#F2DDE1] text-[#252124]/70 hover:border-[#572A39] hover:text-[#572A39]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Masonry-Style Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredItems.map((item, index) => {
          // Asymmetrical height variations for editorial aesthetic
          const isSpan = index % 5 === 0;

          return (
            <motion.div
              layout
              key={item._id || index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className={`relative group overflow-hidden rounded-xl bg-[#F2DDE1]/30 cursor-pointer ${
                isSpan ? 'col-span-2 row-span-2 aspect-[4/3] md:aspect-[1/1]' : 'aspect-square'
              }`}
              onClick={() => openLightbox(index)}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Editorial Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#252124]/90 via-[#252124]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end text-white">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#D8BE9A] font-semibold mb-1">
                  {item.category}
                </span>
                <h4 className="font-serif text-lg md:text-xl font-normal leading-snug">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-xs text-white/80 font-light line-clamp-2 mt-1">
                    {item.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#D8BE9A]">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Enlarge Artwork</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#252124]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              aria-label="Previous artwork"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              aria-label="Next artwork"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Lightbox Content */}
            <div
              className="max-w-4xl max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredItems[lightboxIndex].imageUrl}
                alt={filteredItems[lightboxIndex].title}
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl"
              />
              <div className="mt-4 text-center text-white">
                <span className="text-xs uppercase tracking-widest text-[#D8BE9A] font-medium block">
                  {filteredItems[lightboxIndex].category}
                </span>
                <h3 className="font-serif text-2xl font-normal mt-1">
                  {filteredItems[lightboxIndex].title}
                </h3>
                {filteredItems[lightboxIndex].description && (
                  <p className="text-xs text-white/70 mt-1 max-w-lg font-light">
                    {filteredItems[lightboxIndex].description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryGrid;
