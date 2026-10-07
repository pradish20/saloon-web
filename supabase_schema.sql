-- ==========================================================
-- AURA PREMIUM UNISEX SALON - SUPABASE DATABASE SCHEMA & RLS
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SALON SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.salon_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_name TEXT NOT NULL DEFAULT 'AURA Unisex Salon',
    tagline TEXT NOT NULL DEFAULT 'Your Style. Our Signature.',
    location_short TEXT NOT NULL DEFAULT 'Trichy, Tamil Nadu',
    phone TEXT NOT NULL DEFAULT '+91 94431 23456',
    whatsapp TEXT NOT NULL DEFAULT '+91 94431 23456',
    email TEXT NOT NULL DEFAULT 'contact@aurasalon.in',
    address TEXT NOT NULL DEFAULT '45, Thillai Nagar Main Road, 10th Cross West, Tiruchirappalli, Tamil Nadu 620018',
    opening_hours TEXT NOT NULL DEFAULT 'Monday – Sunday: 10:00 AM – 8:00 PM',
    instagram TEXT NOT NULL DEFAULT 'https://instagram.com/aurasalon_trichy',
    google_maps_url TEXT NOT NULL DEFAULT 'https://maps.google.com/?q=Thillai+Nagar+Trichy',
    hero_title TEXT NOT NULL DEFAULT 'Your Style. Our Signature.',
    hero_subtitle TEXT NOT NULL DEFAULT 'Premium Unisex Salon in Trichy',
    about_headline TEXT NOT NULL DEFAULT 'Where modern style meets personalised care.',
    about_description TEXT NOT NULL DEFAULT 'Crafted for discerning individuals who appreciate quiet luxury, precision hairdressing, and bespoke skin rituals in the cultural heart of Trichy.',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('HAIR', 'SKIN', 'GROOMING', 'WOMEN')),
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    duration TEXT DEFAULT '30-45 mins',
    image TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. STYLISTS TABLE
CREATE TABLE IF NOT EXISTS public.stylists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    speciality TEXT NOT NULL,
    bio TEXT,
    image TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    gender TEXT NOT NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    service_name TEXT NOT NULL,
    stylist_id UUID REFERENCES public.stylists(id) ON DELETE SET NULL,
    stylist_name TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    special_request TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('HAIR', 'STYLING', 'GROOMING', 'SALON', 'TRANSFORMATIONS')),
    caption TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

-- Enable RLS on all tables
ALTER TABLE public.salon_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- SALON SETTINGS POLICIES:
-- Anyone can view settings
CREATE POLICY "Public can view salon settings"
ON public.salon_settings FOR SELECT
USING (true);

-- Only authenticated admins can update settings
CREATE POLICY "Admins can update salon settings"
ON public.salon_settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- SERVICES POLICIES:
-- Anyone can view active services
CREATE POLICY "Public can view active services"
ON public.services FOR SELECT
USING (is_active = true OR auth.role() = 'authenticated');

-- Only authenticated admins can insert/update/delete services
CREATE POLICY "Admins can manage services"
ON public.services FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- STYLISTS POLICIES:
-- Anyone can view active stylists
CREATE POLICY "Public can view stylists"
ON public.stylists FOR SELECT
USING (is_active = true OR auth.role() = 'authenticated');

-- Only authenticated admins can manage stylists
CREATE POLICY "Admins can manage stylists"
ON public.stylists FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- GALLERY POLICIES:
-- Anyone can view gallery
CREATE POLICY "Public can view gallery"
ON public.gallery FOR SELECT
USING (true);

-- Only authenticated admins can manage gallery
CREATE POLICY "Admins can manage gallery"
ON public.gallery FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- APPOINTMENTS POLICIES:
-- Anyone can create an appointment request (INSERT)
CREATE POLICY "Anyone can create appointment requests"
ON public.appointments FOR INSERT
WITH CHECK (true);

-- Only authenticated admins can view all appointments
CREATE POLICY "Only authenticated admins can view appointments"
ON public.appointments FOR SELECT
TO authenticated
USING (true);

-- Only authenticated admins can update/delete appointments
CREATE POLICY "Only authenticated admins can modify appointments"
ON public.appointments FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Only authenticated admins can delete appointments"
ON public.appointments FOR DELETE
TO authenticated
USING (true);

-- ==========================================================
-- INITIAL SEED DATA
-- ==========================================================

INSERT INTO public.salon_settings (
    salon_name, tagline, location_short, phone, whatsapp, email,
    address, opening_hours, instagram, hero_title, hero_subtitle,
    about_headline, about_description
) VALUES (
    'AURA Unisex Salon',
    'Your Style. Our Signature.',
    'Trichy, Tamil Nadu',
    '+91 94431 23456',
    '+91 94431 23456',
    'contact@aurasalon.in',
    '45, Thillai Nagar Main Road, 10th Cross West, Tiruchirappalli, Tamil Nadu 620018',
    'Monday – Sunday: 10:00 AM – 8:00 PM',
    'https://instagram.com/aurasalon_trichy',
    'Your Style. Our Signature.',
    'Premium Unisex Salon in Trichy',
    'Where modern style meets personalised care.',
    'Crafted for discerning individuals who appreciate quiet luxury, precision hairdressing, and bespoke skin rituals in the cultural heart of Trichy.'
) ON CONFLICT DO NOTHING;
