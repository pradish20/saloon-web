import React from 'react';
import { Sparkles, Scissors, ShieldCheck, HeartHandshake, ArrowRight, Award, Users, Star } from 'lucide-react';
import { SalonSettings } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface HomePageProps {
  settings: SalonSettings;
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ settings, onNavigate }) => {
  return (
    <div className="bg-[#0D0D10] text-[#EDE8E0]">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-[#20202A]">
        {/* Background Image with Deep Scrim Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=85"
            alt="Luxury Salon Interior Trichy"
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.45] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D10] via-[#0D0D10]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D10]/80 via-transparent to-[#0D0D10]/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24 sm:py-32">
          {/* Subtle location indicator */}
          <div className="inline-flex items-center gap-2 mb-6 text-xs uppercase tracking-[0.25em] text-[#C5A880] font-medium">
            <span>Trichy, Tamil Nadu</span>
            <span aria-hidden="true">·</span>
            <span>Bespoke Unisex Hair & Aesthetics</span>
          </div>

          {/* Large Headline */}
          <h1
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#FAF7F2] leading-[1.1] mb-6 max-w-4xl mx-auto"
            style={{ textWrap: 'balance' }}
          >
            {settings.hero_title}
          </h1>

          {/* Small Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-[#B8B3AA] font-light max-w-2xl mx-auto mb-10 tracking-wide">
            {settings.hero_subtitle}. Where bespoke artistry, organic formulations, and quiet luxury converge.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => onNavigate('appointment')}
              className="w-full sm:w-auto px-8 py-3.5 text-xs uppercase tracking-widest font-semibold bg-[#C5A880] text-[#0D0D10] hover:bg-[#D6BE96] transition-all duration-200 cursor-pointer rounded-sm shadow-lg hover:shadow-[#C5A880]/10 flex items-center justify-center gap-2"
            >
              Book Appointment
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('menu')}
              className="w-full sm:w-auto px-8 py-3.5 text-xs uppercase tracking-widest font-medium border border-[#3A3945] text-[#EDE8E0] hover:border-[#C5A880] hover:text-[#C5A880] transition-colors cursor-pointer rounded-sm"
            >
              Explore Services
            </button>
          </div>
        </div>
      </section>

      {/* 2. ABOUT OUR SALON SECTION */}
      <section className="py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#1C1C24]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-medium block mb-3">
            About Our Salon
          </span>
          <h2
            className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-normal leading-snug mb-5"
            style={{ textWrap: 'balance' }}
          >
            {settings.about_headline}
          </h2>
          <p className="text-sm sm:text-base text-[#9E9A92] leading-relaxed font-light">
            {settings.about_description}
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#121217] p-8 rounded-sm border border-[#20202B] hover:border-[#C5A880]/40 transition-colors group">
            <div className="w-12 h-12 rounded-sm bg-[#1A1A22] text-[#C5A880] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#EDE8E0] mb-2 font-medium">Expert Stylists</h3>
            <p className="text-xs text-[#8E8A83] leading-relaxed">
              Certified master artists trained in precision scissor architecture and bespoke color transitions.
            </p>
          </div>

          <div className="bg-[#121217] p-8 rounded-sm border border-[#20202B] hover:border-[#C5A880]/40 transition-colors group">
            <div className="w-12 h-12 rounded-sm bg-[#1A1A22] text-[#C5A880] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#EDE8E0] mb-2 font-medium">Premium Products</h3>
            <p className="text-xs text-[#8E8A83] leading-relaxed">
              Ammonia-free, hypoallergenic, imported botanical elixirs that preserve hair and dermal integrity.
            </p>
          </div>

          <div className="bg-[#121217] p-8 rounded-sm border border-[#20202B] hover:border-[#C5A880]/40 transition-colors group">
            <div className="w-12 h-12 rounded-sm bg-[#1A1A22] text-[#C5A880] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#EDE8E0] mb-2 font-medium">Unisex Services</h3>
            <p className="text-xs text-[#8E8A83] leading-relaxed">
              Thoughtfully curated grooming, skin, and hair rituals engineered specifically for all genders.
            </p>
          </div>

          <div className="bg-[#121217] p-8 rounded-sm border border-[#20202B] hover:border-[#C5A880]/40 transition-colors group">
            <div className="w-12 h-12 rounded-sm bg-[#1A1A22] text-[#C5A880] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#EDE8E0] mb-2 font-medium">Personalised Experience</h3>
            <p className="text-xs text-[#8E8A83] leading-relaxed">
              Diagnostic consultation before every ritual ensuring your unique lifestyle and aesthetic shine.
            </p>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US - VISUAL CARDS SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#1C1C24]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-medium block mb-2">
              The AURA Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-normal">
              Why Choose Our Studio
            </h2>
          </div>
          <p className="text-xs text-[#8E8A83] max-w-md font-light">
            We reject the rushed assembly-line salon model. Every appointment is an unhurried, private experience in Tiruchirappalli.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Visual Card 1 */}
          <div className="relative group overflow-hidden rounded-sm border border-[#22222E] bg-[#121218]">
            <div className="h-64 overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80"
                alt="Precision Styling in Trichy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
              />
            </div>
            <div className="p-6">
              <span className="text-[11px] font-mono tracking-wider text-[#C5A880] uppercase block mb-1">
                Consultation First
              </span>
              <h3 className="font-serif text-lg text-[#EDE8E0] mb-2">Bespoke Face & Scalp Analysis</h3>
              <p className="text-xs text-[#8E8A83] leading-relaxed">
                We study facial angles, hair growth patterns, and skin sensitivity before proposing cuts or therapies.
              </p>
            </div>
          </div>

          {/* Visual Card 2 */}
          <div className="relative group overflow-hidden rounded-sm border border-[#22222E] bg-[#121218]">
            <div className="h-64 overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80"
                alt="Sterilized Tools and Luxury Products"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
              />
            </div>
            <div className="p-6">
              <span className="text-[11px] font-mono tracking-wider text-[#C5A880] uppercase block mb-1">
                Clinical Hygiene
              </span>
              <h3 className="font-serif text-lg text-[#EDE8E0] mb-2">Hospital-Grade Sterilization</h3>
              <p className="text-xs text-[#8E8A83] leading-relaxed">
                UV-sterilized scissors, autoclaved razors, and disposable single-use capes for uncompromising hygiene.
              </p>
            </div>
          </div>

          {/* Visual Card 3 */}
          <div className="relative group overflow-hidden rounded-sm border border-[#22222E] bg-[#121218]">
            <div className="h-64 overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
                alt="Luxury Salon Ambiance in Thillai Nagar"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
              />
            </div>
            <div className="p-6">
              <span className="text-[11px] font-mono tracking-wider text-[#C5A880] uppercase block mb-1">
                Serene Sanctuary
              </span>
              <h3 className="font-serif text-lg text-[#EDE8E0] mb-2">Acoustic & Sensory Calm</h3>
              <p className="text-xs text-[#8E8A83] leading-relaxed">
                Warm ambient lighting, artisanal brewed herbal infusions, and zero loud salon chatter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STATISTICS SECTION */}
      <section className="py-20 bg-[#0A0A0D] border-b border-[#1C1C24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-[#1D1D28]">
            <div className="pt-4 lg:pt-0">
              <span className="font-serif text-4xl sm:text-5xl font-light text-[#C5A880] block mb-2 tabular-nums">
                5+
              </span>
              <span className="text-xs uppercase tracking-wider text-[#9E9A92]">Years Experience</span>
            </div>

            <div className="pt-4 lg:pt-0">
              <span className="font-serif text-4xl sm:text-5xl font-light text-[#C5A880] block mb-2 tabular-nums">
                1000+
              </span>
              <span className="text-xs uppercase tracking-wider text-[#9E9A92]">Happy Clients</span>
            </div>

            <div className="pt-4 lg:pt-0">
              <span className="font-serif text-4xl sm:text-5xl font-light text-[#C5A880] block mb-2 tabular-nums">
                10+
              </span>
              <span className="text-xs uppercase tracking-wider text-[#9E9A92]">Expert Services</span>
            </div>

            <div className="pt-4 lg:pt-0">
              <span className="font-serif text-4xl sm:text-5xl font-light text-[#C5A880] block mb-2 tabular-nums">
                4.9★
              </span>
              <span className="text-xs uppercase tracking-wider text-[#9E9A92]">Google Review Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA SECTION */}
      <section className="py-24 sm:py-28 relative overflow-hidden text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-medium block mb-4">
            Begin Your Transformation
          </span>
          <h2
            className="font-serif text-3xl sm:text-5xl text-[#FAF7F2] font-normal leading-tight mb-6"
            style={{ textWrap: 'balance' }}
          >
            Ready for your next look?
          </h2>
          <p className="text-sm sm:text-base text-[#9E9A92] font-light max-w-xl mx-auto mb-10">
            Book your consultation with our master stylists in Thillai Nagar, Trichy. We look forward to welcoming you.
          </p>

          <button
            onClick={() => onNavigate('appointment')}
            className="px-10 py-4 text-xs uppercase tracking-widest font-semibold bg-[#C5A880] text-[#0D0D10] hover:bg-[#D6BE96] transition-all cursor-pointer rounded-sm shadow-xl inline-flex items-center gap-3"
          >
            Book Appointment
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
