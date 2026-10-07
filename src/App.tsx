import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { GalleryPage } from './pages/GalleryPage';
import { AppointmentPage } from './pages/AppointmentPage';
import { AdminPage } from './pages/AdminPage';
import { salonService, DEFAULT_SETTINGS } from './services/store';
import { authService, AdminUser } from './services/auth';
import { Appointment, AppointmentStatus, GalleryItem, SalonSettings, Service, Stylist } from './types';
import { Calendar, MessageCircle, Phone } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [preSelectedServiceId, setPreSelectedServiceId] = useState<string>('');

  // Application Data States
  const [settings, setSettings] = useState<SalonSettings>(DEFAULT_SETTINGS);
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Auth State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial Data Load
  useEffect(() => {
    async function loadData() {
      try {
        const [settingsData, servicesData, stylistsData, galleryData, appointmentsData, user] =
          await Promise.all([
            salonService.getSettings(),
            salonService.getServices(),
            salonService.getStylists(),
            salonService.getGallery(),
            salonService.getAppointments(),
            authService.getCurrentUser(),
          ]);

        setSettings(settingsData);
        setServices(servicesData);
        setStylists(stylistsData);
        setGallery(galleryData);
        setAppointments(appointmentsData);
        setCurrentUser(user);
      } catch (err) {
        console.error('Error loading salon initial data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Handlers for Services
  const handleSelectServiceToBook = (serviceId: string) => {
    setPreSelectedServiceId(serviceId);
    setActiveTab('appointment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookAppointment = async (
    data: Omit<Appointment, 'id' | 'status' | 'created_at'>
  ): Promise<Appointment> => {
    const created = await salonService.createAppointment(data);
    setAppointments((prev) => [created, ...prev]);
    return created;
  };

  const handleUpdateAppointmentStatus = async (
    id: string,
    status: AppointmentStatus
  ) => {
    await salonService.updateAppointmentStatus(id, status);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const handleDeleteAppointment = async (id: string) => {
    await salonService.deleteAppointment(id);
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSaveService = async (
    service: Omit<Service, 'id'> & { id?: string }
  ) => {
    const saved = await salonService.saveService(service);
    setServices((prev) => {
      const idx = prev.findIndex((s) => s.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [...prev, saved];
    });
  };

  const handleDeleteService = async (id: string) => {
    await salonService.deleteService(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveStylist = async (
    stylist: Omit<Stylist, 'id'> & { id?: string }
  ) => {
    const saved = await salonService.saveStylist(stylist);
    setStylists((prev) => {
      const idx = prev.findIndex((s) => s.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [...prev, saved];
    });
  };

  const handleDeleteStylist = async (id: string) => {
    await salonService.deleteStylist(id);
    setStylists((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
    const saved = await salonService.addGalleryItem(item);
    setGallery((prev) => [saved, ...prev]);
  };

  const handleDeleteGalleryItem = async (id: string) => {
    await salonService.deleteGalleryItem(id);
    setGallery((prev) => prev.filter((g) => g.id !== id));
  };

  const handleUpdateSettings = async (newSettings: Partial<SalonSettings>) => {
    const updated = await salonService.updateSettings(newSettings);
    setSettings(updated);
  };

  const handleLogin = (user: AdminUser) => {
    setCurrentUser(user);
    setActiveTab('admin');
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setActiveTab('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D10] flex items-center justify-center text-[#EDE8E0]">
        <div className="text-center space-y-3">
          <div className="font-serif text-3xl tracking-widest text-[#C5A880] animate-pulse">
            AURA
          </div>
          <p className="text-xs tracking-wider uppercase text-[#8E8A83]">
            Tiruchirappalli · Loading Experience...
          </p>
        </div>
      </div>
    );
  }

  const cleanWhatsApp = settings.whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-[#0D0D10] text-[#EDE8E0] flex flex-col font-sans selection:bg-[#C5A880]/30 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        isAdminAuthenticated={Boolean(currentUser)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage settings={settings} onNavigate={setActiveTab} />
        )}

        {activeTab === 'menu' && (
          <MenuPage
            services={services}
            onSelectServiceToBook={handleSelectServiceToBook}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryPage galleryItems={gallery} />
        )}

        {activeTab === 'appointment' && (
          <AppointmentPage
            services={services}
            stylists={stylists}
            settings={settings}
            preSelectedServiceId={preSelectedServiceId}
            onBookAppointment={handleBookAppointment}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPage
            currentUser={currentUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
            appointments={appointments}
            services={services}
            stylists={stylists}
            gallery={gallery}
            settings={settings}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onDeleteAppointment={handleDeleteAppointment}
            onSaveService={handleSaveService}
            onDeleteService={handleDeleteService}
            onSaveStylist={handleSaveStylist}
            onDeleteStylist={handleDeleteStylist}
            onAddGalleryItem={handleAddGalleryItem}
            onDeleteGalleryItem={handleDeleteGalleryItem}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </main>

      {/* Sticky Mobile Quick Booking & WhatsApp Bar (Only on customer views and when not on appointment page) */}
      {activeTab !== 'admin' && activeTab !== 'appointment' && (
        <div className="sm:hidden fixed bottom-3 left-3 right-3 z-40 bg-[#121217]/95 backdrop-blur-md border border-[#272736] p-2 rounded-sm shadow-2xl flex items-center gap-2">
          <a
            href={`https://wa.me/${cleanWhatsApp}`}
            target="_blank"
            rel="noreferrer noopener"
            className="p-3 bg-[#1B1B26] text-[#25D366] rounded-sm flex items-center justify-center shrink-0 border border-[#29293B]"
            aria-label="Direct WhatsApp Message"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <button
            onClick={() => {
              setActiveTab('appointment');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex-1 py-3 text-xs uppercase tracking-widest font-semibold bg-[#C5A880] text-[#0D0D10] rounded-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Appointment</span>
          </button>
        </div>
      )}

      {/* Customer Footer (Show on all customer pages) */}
      {activeTab !== 'admin' && (
        <Footer settings={settings} onNavigate={setActiveTab} />
      )}
    </div>
  );
}
