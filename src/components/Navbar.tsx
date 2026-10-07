import React, { useState } from 'react';
import { Menu, X, Calendar, Lock } from 'lucide-react';
import { SalonSettings } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: SalonSettings;
  isAdminAuthenticated: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  isAdminAuthenticated,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'About' },
    { id: 'menu', label: 'Menu' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'appointment', label: 'Appointment' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0D0D10]/90 backdrop-blur-md border-b border-[#22222B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-serif text-2xl sm:text-3xl font-medium tracking-widest text-[#EDE8E0] group-hover:text-[#C5A880] transition-colors whitespace-nowrap">
            {settings.salon_name.toUpperCase()}
          </span>
        </button>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-[#C5A880] font-medium'
                    : 'text-[#B8B4AE] hover:text-[#EDE8E0]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A880] transition-all" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Admin quick access */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={() => handleNavClick('admin')}
            title="Admin Dashboard"
            className={`p-2 text-xs text-[#8E8A83] hover:text-[#C5A880] transition-colors cursor-pointer rounded border border-transparent hover:border-[#272733] flex items-center gap-1.5 ${
              activeTab === 'admin' ? 'text-[#C5A880] border-[#37353F]' : ''
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="text-[11px] tracking-wider uppercase font-medium">
              {isAdminAuthenticated ? 'Admin Panel' : 'Staff'}
            </span>
          </button>

          <button
            onClick={() => handleNavClick('appointment')}
            className="px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#0D0D10] bg-[#C5A880] hover:bg-[#D6BE96] transition-colors cursor-pointer whitespace-nowrap rounded-sm shadow-sm"
          >
            Book Appointment
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => handleNavClick('appointment')}
            className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-[#0D0D10] bg-[#C5A880] rounded-sm whitespace-nowrap"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#EDE8E0] hover:text-[#C5A880] cursor-pointer focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111116] border-b border-[#22222B] px-6 py-6 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-4 text-base">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left py-2 border-b border-[#1E1E26] tracking-wide transition-colors ${
                  activeTab === link.id
                    ? 'text-[#C5A880] font-medium'
                    : 'text-[#D4CFCA]'
                }`}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => handleNavClick('admin')}
              className="text-left py-2 text-xs text-[#8E8A83] hover:text-[#C5A880] flex items-center gap-2 border-b border-[#1E1E26]"
            >
              <Lock className="w-4 h-4" />
              <span>Admin Access & Settings</span>
            </button>

            <button
              onClick={() => handleNavClick('appointment')}
              className="mt-2 w-full py-3 text-center text-xs font-semibold tracking-widest uppercase bg-[#C5A880] text-[#0D0D10] rounded-sm flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment Now
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
