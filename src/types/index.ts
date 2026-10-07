export type ServiceCategory = 'HAIR' | 'SKIN' | 'GROOMING' | 'WOMEN';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  price: number;
  duration?: string;
  image?: string;
  is_active: boolean;
  created_at?: string;
}

export interface Stylist {
  id: string;
  name: string;
  speciality: string;
  image?: string;
  is_active: boolean;
  bio?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  customer_name: string;
  phone: string;
  email?: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  service_id: string;
  service_name: string;
  stylist_id: string;
  stylist_name: string;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // e.g. "11:30 AM"
  special_request?: string;
  status: AppointmentStatus;
  created_at: string;
}

export type GalleryCategory = 'ALL' | 'HAIR' | 'STYLING' | 'GROOMING' | 'SALON' | 'TRANSFORMATIONS';

export interface GalleryItem {
  id: string;
  image_url: string;
  category: Exclude<GalleryCategory, 'ALL'>;
  caption: string;
  created_at?: string;
}

export interface SalonSettings {
  salon_name: string;
  tagline: string;
  location_short: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  opening_hours: string;
  instagram: string;
  google_maps_url: string;
  hero_title: string;
  hero_subtitle: string;
  about_headline: string;
  about_description: string;
}
