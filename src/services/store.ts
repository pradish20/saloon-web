import { Appointment, GalleryItem, SalonSettings, Service, Stylist } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Initial default settings for AURA Unisex Salon, Trichy
export const DEFAULT_SETTINGS: SalonSettings = {
  salon_name: 'AURA Unisex Salon',
  tagline: 'Your Style. Our Signature.',
  location_short: 'Trichy, Tamil Nadu',
  phone: '+91 94431 23456',
  whatsapp: '+91 94431 23456',
  email: 'contact@aurasalon.in',
  address: '45, Thillai Nagar Main Road, 10th Cross West, Tiruchirappalli, Tamil Nadu 620018',
  opening_hours: 'Monday – Sunday: 10:00 AM – 8:00 PM',
  instagram: 'https://instagram.com/aurasalon_trichy',
  google_maps_url: 'https://maps.google.com/?q=Thillai+Nagar+Tiruchirappalli',
  hero_title: 'Your Style. Our Signature.',
  hero_subtitle: 'Premium Unisex Salon in Trichy',
  about_headline: 'Where modern style meets personalised care.',
  about_description: 'Designed for discerning individuals in Tiruchirappalli who appreciate bespoke hairdressing, curated skin therapies, and quiet modern luxury.',
};

export const DEFAULT_SERVICES: Service[] = [
  // HAIR
  {
    id: 'srv-1',
    name: 'Precision Haircut',
    category: 'HAIR',
    description: 'Consultation, scalp massage, tailored haircut and precision finish.',
    price: 699,
    duration: '45 mins',
    is_active: true,
  },
  {
    id: 'srv-2',
    name: 'Artisanal Hair Styling',
    category: 'HAIR',
    description: 'Editorial blowout, heat sculpting, and lightweight matte finish.',
    price: 599,
    duration: '35 mins',
    is_active: true,
  },
  {
    id: 'srv-3',
    name: 'Clarifying Hair Wash',
    category: 'HAIR',
    description: 'Purifying botanical wash with invigorating acupressure scalp massage.',
    price: 399,
    duration: '25 mins',
    is_active: true,
  },
  {
    id: 'srv-4',
    name: 'Intense Keratin Hair Spa',
    category: 'HAIR',
    description: 'Deep moisture replenishment, steam infusion, and fiber repair.',
    price: 1499,
    duration: '60 mins',
    is_active: true,
  },
  {
    id: 'srv-5',
    name: 'Custom Hair Colour',
    category: 'HAIR',
    description: 'Ammonia-free global formulation tailored to your skin undertone.',
    price: 2499,
    duration: '90 mins',
    is_active: true,
  },
  {
    id: 'srv-6',
    name: 'Dimensional Highlights & Balayage',
    category: 'HAIR',
    description: 'Hand-painted sun-kissed dimension with gloss toner glaze.',
    price: 3299,
    duration: '120 mins',
    is_active: true,
  },

  // SKIN
  {
    id: 'srv-7',
    name: 'Luxury Hydra Glow Facial',
    category: 'SKIN',
    description: 'Multi-step vortex dermal infusion for instant radiance and deep hydration.',
    price: 1899,
    duration: '60 mins',
    is_active: true,
  },
  {
    id: 'srv-8',
    name: 'Deep Pore Botanical Cleanup',
    category: 'SKIN',
    description: 'Gentle ultrasonic extraction, pore refinement, and antioxidant mask.',
    price: 899,
    duration: '40 mins',
    is_active: true,
  },
  {
    id: 'srv-9',
    name: 'Organic De-Tan Therapy',
    category: 'SKIN',
    description: 'Natural fruit AHA peel and cooling aloe wrap to reverse sun exposure.',
    price: 799,
    duration: '35 mins',
    is_active: true,
  },
  {
    id: 'srv-10',
    name: 'Advanced Skin Brightening Ritual',
    category: 'SKIN',
    description: 'Vitamin C micro-infusion paired with cold hammer therapy and algae pack.',
    price: 2199,
    duration: '75 mins',
    is_active: true,
  },

  // GROOMING
  {
    id: 'srv-11',
    name: 'Bespoke Beard Styling',
    category: 'GROOMING',
    description: 'Sharp razor lines, hot towel steam, and nourishing beard oil ritual.',
    price: 499,
    duration: '30 mins',
    is_active: true,
  },
  {
    id: 'srv-12',
    name: 'Classic Beard Trim & Shape',
    category: 'GROOMING',
    description: 'Uniform clipper tapering and mustache precision balance.',
    price: 299,
    duration: '20 mins',
    is_active: true,
  },
  {
    id: 'srv-13',
    name: 'Traditional Hot Towel Shave',
    category: 'GROOMING',
    description: 'Warm lather brush massage, straight razor glide, and ice toner finish.',
    price: 399,
    duration: '30 mins',
    is_active: true,
  },
  {
    id: 'srv-14',
    name: 'Aromatherapy Head Massage',
    category: 'GROOMING',
    description: 'Warm herbal blend massage targeting tension nodes and cranial pressure points.',
    price: 699,
    duration: '40 mins',
    is_active: true,
  },

  // WOMEN
  {
    id: 'srv-15',
    name: 'Signature Women’s Haircut',
    category: 'WOMEN',
    description: 'Structure analysis, customized layering, wash, and luxury finish.',
    price: 999,
    duration: '60 mins',
    is_active: true,
  },
  {
    id: 'srv-16',
    name: 'Moroccan Argan Hair Spa',
    category: 'WOMEN',
    description: 'Pure argan elixir infusion for silky shine, frizz control, and volume.',
    price: 1999,
    duration: '75 mins',
    is_active: true,
  },
  {
    id: 'srv-17',
    name: 'Occasion Hair Styling & Waves',
    category: 'WOMEN',
    description: 'Hollywood waves, textured updos, or sleek architectural parting.',
    price: 1199,
    duration: '50 mins',
    is_active: true,
  },
  {
    id: 'srv-18',
    name: 'Global Hair Colouring',
    category: 'WOMEN',
    description: 'Seamless rich color transition with ammonia-free Italian formulation.',
    price: 3499,
    duration: '110 mins',
    is_active: true,
  },
  {
    id: 'srv-19',
    name: 'Bridal & Reception Styling Ritual',
    category: 'WOMEN',
    description: 'Complete high-definition hair artistry, floral placement, and veil draping.',
    price: 5999,
    duration: '150 mins',
    is_active: true,
  },
];

export const DEFAULT_STYLISTS: Stylist[] = [
  {
    id: 'sty-1',
    name: 'Alex',
    speciality: 'Creative Hair Director & Precision Cuts',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    is_active: true,
    bio: '8+ years crafting bespoke hair architectures and international runway styles.',
  },
  {
    id: 'sty-2',
    name: 'Priya',
    speciality: 'Senior Aesthetician & Skin Therapist',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    is_active: true,
    bio: 'Certified clinical facialist specialising in botanical peels and hydration rituals.',
  },
  {
    id: 'sty-3',
    name: 'Arun',
    speciality: 'Master Barber & Beard Architect',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    is_active: true,
    bio: 'Renowned for sharp straight-edge fades, beard detailing, and hot towel rituals.',
  },
  {
    id: 'sty-4',
    name: 'Meera',
    speciality: 'Senior Colourist & Bridal Artisan',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    is_active: true,
    bio: 'Passionate about custom dimensional highlights and classical South Indian bridal styling.',
  },
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80',
    category: 'SALON',
    caption: 'Minimalist interior suite with warm brass lighting and bespoke leather stations.',
  },
  {
    id: 'gal-2',
    image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
    category: 'HAIR',
    caption: 'Textured soft layers and sunlit balayage finish by Meera.',
  },
  {
    id: 'gal-3',
    image_url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1000&q=80',
    category: 'GROOMING',
    caption: 'Sharp beard contour and precision fade groom by Arun.',
  },
  {
    id: 'gal-4',
    image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80',
    category: 'STYLING',
    caption: 'Voluminous red carpet blowout and silk finish by Alex.',
  },
  {
    id: 'gal-5',
    image_url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1000&q=80',
    category: 'SALON',
    caption: 'Dedicated spa treatment lounge for deep hair and skin rejuvenation.',
  },
  {
    id: 'gal-6',
    image_url: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1000&q=80',
    category: 'TRANSFORMATIONS',
    caption: 'Before-and-after dimensional global bronze tone transformation.',
  },
  {
    id: 'gal-7',
    image_url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1000&q=80',
    category: 'HAIR',
    caption: 'Sharp modern French bob with feathered edges.',
  },
  {
    id: 'gal-8',
    image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80',
    category: 'GROOMING',
    caption: 'Classic gentlemen’s executive cut and beard definition.',
  },
];

export const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    customer_name: 'Karthik Subramanian',
    phone: '+91 98401 55672',
    email: 'karthik.s@gmail.com',
    gender: 'male',
    service_id: 'srv-1',
    service_name: 'Precision Haircut',
    stylist_id: 'sty-1',
    stylist_name: 'Alex',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '11:00 AM',
    special_request: 'Low skin fade on the sides, scissor work on top.',
    status: 'confirmed',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'apt-102',
    customer_name: 'Ananya Raman',
    phone: '+91 97910 88231',
    email: 'ananya.raman@yahoo.com',
    gender: 'female',
    service_id: 'srv-7',
    service_name: 'Luxury Hydra Glow Facial',
    stylist_id: 'sty-2',
    stylist_name: 'Priya',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '02:30 PM',
    special_request: 'Sensitive skin, please use hypoallergenic products.',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'apt-103',
    customer_name: 'Vigneshwaran M',
    phone: '+91 99420 33144',
    email: 'vignesh.m@gmail.com',
    gender: 'male',
    service_id: 'srv-11',
    service_name: 'Bespoke Beard Styling',
    stylist_id: 'sty-3',
    stylist_name: 'Arun',
    appointment_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    appointment_time: '04:00 PM',
    special_request: 'Need sharp edging for an evening family function.',
    status: 'confirmed',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'apt-104',
    customer_name: 'Divya Lakshmi',
    phone: '+91 98840 99871',
    email: 'divya.l@outlook.com',
    gender: 'female',
    service_id: 'srv-19',
    service_name: 'Bridal & Reception Styling Ritual',
    stylist_id: 'sty-4',
    stylist_name: 'Meera',
    appointment_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    appointment_time: '10:30 AM',
    special_request: 'Consultation for engagement ceremony hair ornamentation.',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

// Helper to get from LocalStorage or seed fallback
function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(`aura_salon_${key}`);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
  }
  return defaultValue;
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`aura_salon_${key}`, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error saving ${key} to storage:`, err);
  }
}

// Data Repository Layer
export const salonService = {
  // SETTINGS
  async getSettings(): Promise<SalonSettings> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('salon_settings').select('*').limit(1).maybeSingle();
      if (!error && data) return data as SalonSettings;
    }
    return getLocalItem<SalonSettings>('settings', DEFAULT_SETTINGS);
  },

  async updateSettings(settings: Partial<SalonSettings>): Promise<SalonSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    setLocalItem('settings', updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('salon_settings').upsert(updated);
      } catch (e) {
        console.error('Supabase updateSettings error:', e);
      }
    }
    return updated;
  },

  // SERVICES
  async getServices(): Promise<Service[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('services').select('*').order('name');
      if (!error && data && data.length > 0) return data as Service[];
    }
    return getLocalItem<Service[]>('services', DEFAULT_SERVICES);
  },

  async saveService(service: Omit<Service, 'id'> & { id?: string }): Promise<Service> {
    const all = await this.getServices();
    let saved: Service;

    if (service.id) {
      saved = { ...service, id: service.id } as Service;
      const index = all.findIndex((s) => s.id === service.id);
      if (index >= 0) all[index] = saved;
      else all.push(saved);
    } else {
      saved = {
        ...service,
        id: `srv-${Date.now()}`,
        created_at: new Date().toISOString(),
      } as Service;
      all.push(saved);
    }

    setLocalItem('services', all);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('services').upsert(saved);
      } catch (e) {
        console.error('Supabase saveService error:', e);
      }
    }
    return saved;
  },

  async deleteService(id: string): Promise<void> {
    const all = await this.getServices();
    const filtered = all.filter((s) => s.id !== id);
    setLocalItem('services', filtered);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('services').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase deleteService error:', e);
      }
    }
  },

  // STYLISTS
  async getStylists(): Promise<Stylist[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('stylists').select('*').order('name');
      if (!error && data && data.length > 0) return data as Stylist[];
    }
    return getLocalItem<Stylist[]>('stylists', DEFAULT_STYLISTS);
  },

  async saveStylist(stylist: Omit<Stylist, 'id'> & { id?: string }): Promise<Stylist> {
    const all = await this.getStylists();
    let saved: Stylist;

    if (stylist.id) {
      saved = { ...stylist, id: stylist.id } as Stylist;
      const index = all.findIndex((s) => s.id === stylist.id);
      if (index >= 0) all[index] = saved;
      else all.push(saved);
    } else {
      saved = {
        ...stylist,
        id: `sty-${Date.now()}`,
      } as Stylist;
      all.push(saved);
    }

    setLocalItem('stylists', all);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('stylists').upsert(saved);
      } catch (e) {
        console.error('Supabase saveStylist error:', e);
      }
    }
    return saved;
  },

  async deleteStylist(id: string): Promise<void> {
    const all = await this.getStylists();
    const filtered = all.filter((s) => s.id !== id);
    setLocalItem('stylists', filtered);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('stylists').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase deleteStylist error:', e);
      }
    }
  },

  // GALLERY
  async getGallery(): Promise<GalleryItem[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as GalleryItem[];
    }
    return getLocalItem<GalleryItem[]>('gallery', DEFAULT_GALLERY);
  },

  async addGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
    const all = await this.getGallery();
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    all.unshift(newItem);
    setLocalItem('gallery', all);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('gallery').insert(newItem);
      } catch (e) {
        console.error('Supabase addGalleryItem error:', e);
      }
    }
    return newItem;
  },

  async deleteGalleryItem(id: string): Promise<void> {
    const all = await this.getGallery();
    const filtered = all.filter((g) => g.id !== id);
    setLocalItem('gallery', filtered);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('gallery').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase deleteGalleryItem error:', e);
      }
    }
  },

  // APPOINTMENTS
  async getAppointments(): Promise<Appointment[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Appointment[];
    }
    return getLocalItem<Appointment[]>('appointments', DEFAULT_APPOINTMENTS);
  },

  async createAppointment(appointment: Omit<Appointment, 'id' | 'status' | 'created_at'>): Promise<Appointment> {
    const all = await this.getAppointments();
    const newApt: Appointment = {
      ...appointment,
      id: `apt-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    all.unshift(newApt);
    setLocalItem('appointments', all);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('appointments').insert(newApt);
      } catch (e) {
        console.error('Supabase createAppointment error:', e);
      }
    }
    return newApt;
  },

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment | null> {
    const all = await this.getAppointments();
    const target = all.find((a) => a.id === id);
    if (!target) return null;

    target.status = status;
    setLocalItem('appointments', all);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('appointments').update({ status }).eq('id', id);
      } catch (e) {
        console.error('Supabase updateAppointmentStatus error:', e);
      }
    }
    return target;
  },

  async deleteAppointment(id: string): Promise<void> {
    const all = await this.getAppointments();
    const filtered = all.filter((a) => a.id !== id);
    setLocalItem('appointments', filtered);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('appointments').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase deleteAppointment error:', e);
      }
    }
  },
};
