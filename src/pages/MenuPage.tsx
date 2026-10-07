import React, { useState } from 'react';
import { Search, Clock, ArrowRight } from 'lucide-react';
import { Service, ServiceCategory } from '../types';

interface MenuPageProps {
  services: Service[];
  onSelectServiceToBook: (serviceId: string) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  services,
  onSelectServiceToBook,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All Services' },
    { id: 'HAIR', label: 'Hair' },
    { id: 'SKIN', label: 'Skin' },
    { id: 'GROOMING', label: 'Grooming' },
    { id: 'WOMEN', label: 'Women' },
  ];

  // Filter only active services for customer view
  const activeServices = services.filter((s) => s.is_active);

  const filteredServices = activeServices.filter((service) => {
    const matchesCategory =
      selectedCategory === 'ALL' || service.category === selectedCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#0D0D10] text-[#EDE8E0] min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-medium block mb-3">
            Bespoke Services
          </span>
          <h1
            className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#FAF7F2] font-normal mb-4"
            style={{ textWrap: 'balance' }}
          >
            Menu
          </h1>
          <p className="text-xs sm:text-sm text-[#9E9A92] font-light leading-relaxed">
            Every service is tailored to your hair texture, scalp physiology, and aesthetic preference using premium organic and ammonia-free products.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-[#1E1E26] pb-6">
          {/* Category Tabs (Segmented Controls) */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-[#13131A] rounded-sm border border-[#242432] max-w-full">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-medium rounded-xs transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#C5A880] text-[#0D0D10]'
                      : 'text-[#9E9A92] hover:text-[#EDE8E0]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#75716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#13131A] border border-[#242432] focus:border-[#C5A880] text-[#EDE8E0] text-xs pl-10 pr-4 py-2.5 rounded-sm outline-none placeholder:text-[#63605A] transition-colors"
            />
          </div>
        </div>

        {/* Services List / Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-24 bg-[#111116] rounded-sm border border-[#22222E]">
            <p className="text-sm text-[#8E8A83]">No services found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="mt-4 text-xs text-[#C5A880] underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-[#121217] rounded-sm border border-[#1F1F2A] hover:border-[#C5A880]/50 transition-all duration-200 p-6 flex flex-col justify-between group"
              >
                <div>
                  {/* Category metadata (Zero-Pill discipline: unboxed clean text) */}
                  <div className="flex items-center justify-between text-[11px] text-[#7A7771] tracking-wider uppercase mb-2">
                    <span>{service.category}</span>
                    {service.duration && (
                      <span className="flex items-center gap-1 font-mono text-[#99958F]">
                        <Clock className="w-3 h-3 text-[#C5A880]" />
                        {service.duration}
                      </span>
                    )}
                  </div>

                  {/* Service Name */}
                  <h3 className="font-serif text-xl text-[#FAF7F2] font-medium mb-2 group-hover:text-[#C5A880] transition-colors">
                    {service.name}
                  </h3>

                  {/* 1-line description */}
                  <p className="text-xs text-[#8E8A83] font-light leading-relaxed mb-6 line-clamp-2">
                    {service.description}
                  </p>
                </div>

                {/* Bottom Row: Price and Book CTA */}
                <div className="pt-4 border-t border-[#1C1C26] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#6D6A64] block">
                      Starting At
                    </span>
                    <span className="font-serif text-2xl font-light text-[#FAF7F2] tabular-nums tracking-tight">
                      ₹{service.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectServiceToBook(service.id)}
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#1B1B24] group-hover:bg-[#C5A880] text-[#EDE8E0] group-hover:text-[#0D0D10] border border-[#2B2B38] group-hover:border-[#C5A880] rounded-sm transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-16 text-center text-xs text-[#7A7771]">
          <span>Need a customized bridal package or corporate grooming session? </span>
          <button
            onClick={() => onSelectServiceToBook('')}
            className="text-[#C5A880] underline hover:text-[#D6BE96] cursor-pointer ml-1"
          >
            Inquire directly on our booking form
          </button>
        </div>
      </div>
    </div>
  );
};
