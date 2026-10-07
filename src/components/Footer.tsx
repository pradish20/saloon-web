import React from 'react';
import { Phone, MessageCircle, Instagram, MapPin, Clock, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { SalonSettings } from '../types';

interface FooterProps {
  settings: SalonSettings;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  // Format clean numbers for tel and whatsapp
  const cleanPhone = settings.phone.replace(/[^0-9+]/g, '');
  const cleanWhatsApp = settings.whatsapp.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#09090C] border-t border-[#1C1C24] text-[#A6A29C] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-[#1A1A22]">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-[#EDE8E0] tracking-widest font-medium">
              {settings.salon_name.toUpperCase()}
            </h3>
            <p className="text-xs text-[#8E8A83] leading-relaxed max-w-sm">
              {settings.tagline} A sanctuary for personalized hairdressing, bespoke skin care, and tailored grooming rituals in Tiruchirappalli.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noreferrer noopener"
                className="w-9 h-9 rounded-full bg-[#16161D] hover:bg-[#C5A880] hover:text-[#0D0D10] text-[#EDE8E0] flex items-center justify-center transition-colors border border-[#262633]"
                aria-label="Contact us on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`tel:${cleanPhone}`}
                className="w-9 h-9 rounded-full bg-[#16161D] hover:bg-[#C5A880] hover:text-[#0D0D10] text-[#EDE8E0] flex items-center justify-center transition-colors border border-[#262633]"
                aria-label="Call salon phone"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="w-9 h-9 rounded-full bg-[#16161D] hover:bg-[#C5A880] hover:text-[#0D0D10] text-[#EDE8E0] flex items-center justify-center transition-colors border border-[#262633]"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Timings & Location */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#EDE8E0] font-medium">
              Hours & Location
            </h4>
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[#EDE8E0] font-medium">Opening Hours</span>
                  <span className="text-[#8E8A83]">{settings.opening_hours}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[#EDE8E0] font-medium">Salon Address</span>
                  <span className="text-[#8E8A83]">{settings.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Direct Reach / Quick Actions */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#EDE8E0] font-medium">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-between p-2.5 rounded bg-[#13131A] border border-[#22222E] hover:border-[#C5A880]/50 transition-colors group"
              >
                <span className="text-[#EDE8E0] font-mono">{settings.phone}</span>
                <span className="text-[11px] text-[#C5A880] flex items-center gap-1 group-hover:underline">
                  Call Now <ArrowUpRight className="w-3 h-3" />
                </span>
              </a>

              <a
                href={`https://wa.me/${cleanWhatsApp}?text=Hi%20${encodeURIComponent(settings.salon_name)},%20I%20would%20like%20to%20inquire%20about%20your%20services.`}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center justify-between p-2.5 rounded bg-[#13131A] border border-[#22222E] hover:border-[#25D366]/50 transition-colors group"
              >
                <span className="text-[#EDE8E0]">WhatsApp Direct</span>
                <span className="text-[11px] text-[#25D366] flex items-center gap-1 group-hover:underline">
                  Chat <ArrowUpRight className="w-3 h-3" />
                </span>
              </a>

              <a
                href={settings.google_maps_url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center justify-between p-2.5 rounded bg-[#13131A] border border-[#22222E] hover:border-[#C5A880]/50 transition-colors group"
              >
                <span className="text-[#EDE8E0]">Google Maps Direction</span>
                <span className="text-[11px] text-[#C5A880] flex items-center gap-1 group-hover:underline">
                  Navigate <ArrowUpRight className="w-3 h-3" />
                </span>
              </a>
            </div>
          </div>

          {/* Col 4: Quick Navigation & Admin Access */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#EDE8E0] font-medium">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#C5A880] transition-colors cursor-pointer text-left"
                >
                  About Our Shop
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#C5A880] transition-colors cursor-pointer text-left"
                >
                  Service Menu & Prices
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-[#C5A880] transition-colors cursor-pointer text-left"
                >
                  Visual Portfolio Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('appointment')}
                  className="hover:text-[#C5A880] transition-colors cursor-pointer text-left text-[#C5A880]"
                >
                  Book Appointment Online
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-[11px] text-[#6E6A63] hover:text-[#C5A880] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin & Staff Portal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6B6862] gap-4">
          <p>
            © {new Date().getFullYear()} {settings.salon_name}. {settings.location_short}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span>Sterilized & Certified Unisex Salon</span>
            <span>·</span>
            <span>Thillai Nagar, Tiruchirappalli</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
