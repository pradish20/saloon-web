import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Plus,
  Search,
  Filter,
  Users,
  Scissors,
  Image as ImageIcon,
  Settings,
  LogOut,
  Database,
  ExternalLink,
  Phone,
  MessageCircle,
  Check,
  RefreshCw,
  Copy,
  ChevronDown,
} from 'lucide-react';
import {
  Appointment,
  AppointmentStatus,
  GalleryCategory,
  GalleryItem,
  SalonSettings,
  Service,
  ServiceCategory,
  Stylist,
} from '../types';
import { authService, AdminUser } from '../services/auth';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface AdminPageProps {
  currentUser: AdminUser | null;
  onLogin: (user: AdminUser) => void;
  onLogout: () => void;
  appointments: Appointment[];
  services: Service[];
  stylists: Stylist[];
  gallery: GalleryItem[];
  settings: SalonSettings;
  onUpdateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  onDeleteAppointment: (id: string) => Promise<void>;
  onSaveService: (service: Omit<Service, 'id'> & { id?: string }) => Promise<void>;
  onDeleteService: (id: string) => Promise<void>;
  onSaveStylist: (stylist: Omit<Stylist, 'id'> & { id?: string }) => Promise<void>;
  onDeleteStylist: (id: string) => Promise<void>;
  onAddGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  onDeleteGalleryItem: (id: string) => Promise<void>;
  onUpdateSettings: (settings: Partial<SalonSettings>) => Promise<void>;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  currentUser,
  onLogin,
  onLogout,
  appointments,
  services,
  stylists,
  gallery,
  settings,
  onUpdateAppointmentStatus,
  onDeleteAppointment,
  onSaveService,
  onDeleteService,
  onSaveStylist,
  onDeleteStylist,
  onAddGalleryItem,
  onDeleteGalleryItem,
  onUpdateSettings,
}) => {
  // Tabs: 'appointments' | 'services' | 'stylists' | 'gallery' | 'settings' | 'database'
  const [activeTab, setActiveTab] = useState<string>('appointments');

  // Login Form States
  const defaultCreds = authService.getDefaultCredentials();
  const [loginEmail, setLoginEmail] = useState(defaultCreds.email);
  const [loginPassword, setLoginPassword] = useState(defaultCreds.password);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Appointments Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');

  // Service Edit / Create Modal State
  const [editingService, setEditingService] = useState<(Omit<Service, 'id'> & { id?: string }) | null>(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);

  // Stylist Edit / Create Modal State
  const [editingStylist, setEditingStylist] = useState<(Omit<Stylist, 'id'> & { id?: string }) | null>(null);
  const [stylistModalOpen, setStylistModalOpen] = useState(false);

  // Gallery Add Modal State
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState<Exclude<GalleryCategory, 'ALL'>>('SALON');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState<SalonSettings>({ ...settings });
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Copied SQL state
  const [copiedSql, setCopiedSql] = useState(false);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const { user, error } = await authService.login(loginEmail, loginPassword);
      if (error || !user) {
        setLoginError(error || 'Invalid credentials.');
      } else {
        onLogin(user);
      }
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  // If NOT Authenticated, show strict login screen
  if (!currentUser) {
    return (
      <div className="bg-[#09090C] text-[#EDE8E0] min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-[#111116] border border-[#232330] rounded-sm p-8 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A880] font-mono block mb-2">
              Staff & Management Portal
            </span>
            <h1 className="font-serif text-3xl text-[#FAF7F2] font-normal">
              Admin Authentication
            </h1>
            <p className="text-xs text-[#8E8A83] mt-2">
              Protected area for appointments, catalog, and salon configuration.
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 bg-[#2A1515] border border-[#7A2A2A] text-[#F3A5A5] text-xs rounded-sm">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[#A9A59E] mb-1.5">
                Staff Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-[#16161F] border border-[#262635] focus:border-[#C5A880] text-[#EDE8E0] text-xs p-3 rounded-sm outline-none transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A9A59E] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-[#16161F] border border-[#262635] focus:border-[#C5A880] text-[#EDE8E0] text-xs p-3 rounded-sm outline-none transition-colors font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-[#C5A880] hover:bg-[#D6BE96] text-[#0D0D10] text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In as Administrator'}
            </button>
          </form>

          {/* Preset quick test helper */}
          <div className="mt-8 pt-6 border-t border-[#1C1C26] text-[11px] text-[#807D77] space-y-1 bg-[#0E0E14] p-3 rounded-sm">
            <span className="font-semibold text-[#C5A880] block">Pre-Configured Admin Credentials:</span>
            <div className="font-mono text-[10px] text-[#A6A29C]">
              Email: <code>{defaultCreds.email}</code>
            </div>
            <div className="font-mono text-[10px] text-[#A6A29C]">
              Password: <code>{defaultCreds.password}</code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- STATS COMPUTATION ---
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.appointment_date === todayDateStr);
  const upcomingAppointments = appointments.filter(
    (a) => a.appointment_date > todayDateStr && a.status !== 'cancelled'
  );
  const pendingRequests = appointments.filter((a) => a.status === 'pending');

  // Filtered appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.stylist_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
    const matchesDate = !dateFilter || apt.appointment_date === dateFilter;
    const matchesService = serviceFilter === 'ALL' || apt.service_id === serviceFilter;

    return matchesSearch && matchesStatus && matchesDate && matchesService;
  });

  // Handle Save Service
  const handleSaveServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.name.trim()) return;
    await onSaveService(editingService);
    setServiceModalOpen(false);
    setEditingService(null);
  };

  // Handle Save Stylist
  const handleSaveStylistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStylist || !editingStylist.name.trim()) return;
    await onSaveStylist(editingStylist);
    setStylistModalOpen(false);
    setEditingStylist(null);
  };

  // Handle Add Gallery
  const handleAddGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryUrl.trim() || !newGalleryCaption.trim()) return;
    await onAddGalleryItem({
      image_url: newGalleryUrl.trim(),
      category: newGalleryCategory,
      caption: newGalleryCaption.trim(),
    });
    setGalleryModalOpen(false);
    setNewGalleryUrl('');
    setNewGalleryCaption('');
  };

  // Handle Update Settings
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateSettings(settingsForm);
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 3000);
  };

  return (
    <div className="bg-[#09090C] text-[#EDE8E0] min-h-screen pb-20">
      {/* Top Admin Bar */}
      <div className="bg-[#111116] border-b border-[#21212C] sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-medium text-[#FAF7F2]">
                {settings.salon_name} Control Panel
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#1F1F2B] text-[#C5A880] rounded">
                Admin
              </span>
            </div>
            <p className="text-xs text-[#807D77] mt-0.5">
              Logged in as {currentUser.email}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 text-xs text-[#B5B1AA] hover:text-[#FA5252] border border-[#272736] hover:border-[#FA5252]/40 rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto border-t border-[#1C1C26] pt-1">
          {[
            { id: 'appointments', label: 'Appointments', count: appointments.length },
            { id: 'services', label: 'Service Menu', count: services.length },
            { id: 'stylists', label: 'Stylists', count: stylists.length },
            { id: 'gallery', label: 'Gallery Portfolio', count: gallery.length },
            { id: 'settings', label: 'Salon Settings' },
            { id: 'database', label: 'Supabase & Database' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-xs uppercase tracking-wider font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'border-[#C5A880] text-[#C5A880]'
                    : 'border-transparent text-[#8E8A83] hover:text-[#EDE8E0]'
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span className="text-[10px] font-mono opacity-60">({tab.count})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ========================================================== */}
        {/* TAB 1: APPOINTMENTS MANAGEMENT */}
        {/* ========================================================== */}
        {activeTab === 'appointments' && (
          <div className="space-y-8">
            {/* Dashboard Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-[#121217] p-5 rounded-sm border border-[#20202B]">
                <span className="text-xs uppercase tracking-wider text-[#8E8A83] block mb-1">
                  Today's Appointments
                </span>
                <span className="font-serif text-3xl font-light text-[#FAF7F2] tabular-nums">
                  {todayAppointments.length}
                </span>
              </div>

              <div className="bg-[#121217] p-5 rounded-sm border border-[#20202B]">
                <span className="text-xs uppercase tracking-wider text-[#8E8A83] block mb-1">
                  Upcoming Appointments
                </span>
                <span className="font-serif text-3xl font-light text-[#C5A880] tabular-nums">
                  {upcomingAppointments.length}
                </span>
              </div>

              <div className="bg-[#121217] p-5 rounded-sm border border-[#20202B]">
                <span className="text-xs uppercase tracking-wider text-[#8E8A83] block mb-1">
                  Pending Requests
                </span>
                <span className="font-serif text-3xl font-light text-[#E59866] tabular-nums">
                  {pendingRequests.length}
                </span>
              </div>

              <div className="bg-[#121217] p-5 rounded-sm border border-[#20202B]">
                <span className="text-xs uppercase tracking-wider text-[#8E8A83] block mb-1">
                  Total Bookings
                </span>
                <span className="font-serif text-3xl font-light text-[#EDE8E0] tabular-nums">
                  {appointments.length}
                </span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-[#121217] p-4 rounded-sm border border-[#20202B] flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#75716C] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer, phone, stylist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#181822] border border-[#262635] text-xs pl-9 pr-3 py-2 rounded-sm outline-none text-[#EDE8E0] focus:border-[#C5A880]"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#181822] border border-[#262635] text-xs px-3 py-2 rounded-sm text-[#EDE8E0] outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Service Filter */}
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="bg-[#181822] border border-[#262635] text-xs px-3 py-2 rounded-sm text-[#EDE8E0] outline-none"
                >
                  <option value="ALL">All Services</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {/* Date Filter */}
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-[#181822] border border-[#262635] text-xs px-3 py-2 rounded-sm text-[#EDE8E0] outline-none"
                />

                {(searchQuery || statusFilter !== 'ALL' || dateFilter || serviceFilter !== 'ALL') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('ALL');
                      setDateFilter('');
                      setServiceFilter('ALL');
                    }}
                    className="text-xs text-[#C5A880] underline cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Appointments Management Table */}
            <div className="bg-[#121217] border border-[#20202B] rounded-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#16161F] border-b border-[#22222F] text-[11px] uppercase tracking-wider text-[#8A8780]">
                      <th className="py-3.5 px-4 font-medium">Customer</th>
                      <th className="py-3.5 px-4 font-medium">Phone & WhatsApp</th>
                      <th className="py-3.5 px-4 font-medium">Service</th>
                      <th className="py-3.5 px-4 font-medium">Stylist</th>
                      <th className="py-3.5 px-4 font-medium">Date & Time</th>
                      <th className="py-3.5 px-4 font-medium">Status</th>
                      <th className="py-3.5 px-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1D1D28]">
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#75716C]">
                          No appointments match the selected criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((apt) => {
                        const cleanPhoneNum = apt.phone.replace(/[^0-9]/g, '');

                        return (
                          <tr key={apt.id} className="hover:bg-[#161620] transition-colors">
                            {/* Customer */}
                            <td className="py-3.5 px-4">
                              <span className="font-medium text-[#FAF7F2] block">
                                {apt.customer_name}
                              </span>
                              <div className="text-[11px] text-[#7A7771] flex items-center gap-1.5">
                                <span className="capitalize">{apt.gender}</span>
                                {apt.special_request && (
                                  <>
                                    <span>·</span>
                                    <span className="text-[#C5A880] italic" title={apt.special_request}>
                                      Note: {apt.special_request.slice(0, 30)}...
                                    </span>
                                  </>
                                )}
                              </div>
                            </td>

                            {/* Phone */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[#D6D2CA]">{apt.phone}</span>
                                <a
                                  href={`https://wa.me/${cleanPhoneNum}?text=Hello%20${encodeURIComponent(apt.customer_name)},%20this%20is%20from%20${encodeURIComponent(settings.salon_name)}%20regarding%20your%20appointment.`}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  className="text-[#25D366] hover:opacity-80 p-1"
                                  title="WhatsApp Customer"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </td>

                            {/* Service */}
                            <td className="py-3.5 px-4 text-[#EDE8E0]">
                              {apt.service_name}
                            </td>

                            {/* Stylist */}
                            <td className="py-3.5 px-4 text-[#D6D2CA]">
                              {apt.stylist_name}
                            </td>

                            {/* Date & Time */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="block text-[#FAF7F2] font-mono">
                                {apt.appointment_date}
                              </span>
                              <span className="text-[11px] text-[#C5A880] font-mono">
                                {apt.appointment_time}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                                  apt.status === 'confirmed'
                                    ? 'bg-[#18392B] text-[#51CF66]'
                                    : apt.status === 'completed'
                                    ? 'bg-[#1C2C40] text-[#74C0FC]'
                                    : apt.status === 'cancelled'
                                    ? 'bg-[#381B1B] text-[#FF8787]'
                                    : 'bg-[#3D2F1B] text-[#FCC419]'
                                }`}
                              >
                                {apt.status}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                {apt.status !== 'confirmed' && (
                                  <button
                                    onClick={() => onUpdateAppointmentStatus(apt.id, 'confirmed')}
                                    className="p-1.5 text-[#51CF66] hover:bg-[#51CF66]/10 rounded cursor-pointer"
                                    title="Confirm Appointment"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                )}

                                {apt.status !== 'completed' && (
                                  <button
                                    onClick={() => onUpdateAppointmentStatus(apt.id, 'completed')}
                                    className="p-1.5 text-[#74C0FC] hover:bg-[#74C0FC]/10 rounded cursor-pointer"
                                    title="Mark Completed"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}

                                {apt.status !== 'cancelled' && (
                                  <button
                                    onClick={() => onUpdateAppointmentStatus(apt.id, 'cancelled')}
                                    className="p-1.5 text-[#FFA94D] hover:bg-[#FFA94D]/10 rounded cursor-pointer"
                                    title="Cancel Appointment"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    if (window.confirm('Delete this appointment record?')) {
                                      onDeleteAppointment(apt.id);
                                    }
                                  }}
                                  className="p-1.5 text-[#FA5252] hover:bg-[#FA5252]/10 rounded cursor-pointer ml-1"
                                  title="Delete Appointment"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: SERVICE MANAGEMENT */}
        {/* ========================================================== */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl text-[#FAF7F2]">Service Catalog</h2>
                <p className="text-xs text-[#8E8A83]">
                  Changes made here automatically appear on the customer Menu and booking form.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingService({
                    name: '',
                    category: 'HAIR',
                    description: '',
                    price: 699,
                    duration: '45 mins',
                    is_active: true,
                  });
                  setServiceModalOpen(true);
                }}
                className="px-4 py-2 bg-[#C5A880] text-[#0D0D10] text-xs uppercase tracking-wider font-semibold rounded-sm flex items-center gap-1.5 hover:bg-[#D6BE96] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`bg-[#121217] border p-5 rounded-sm flex flex-col justify-between ${
                    service.is_active ? 'border-[#22222E]' : 'border-[#22222E] opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#7A7771] uppercase tracking-wider mb-2">
                      <span>{service.category}</span>
                      <span className="font-mono text-[#C5A880] font-semibold text-sm">
                        ₹{service.price}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg text-[#FAF7F2] mb-1 font-medium">
                      {service.name}
                    </h3>
                    <p className="text-xs text-[#8E8A83] font-light mb-4 line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#1C1C26] flex items-center justify-between">
                    <button
                      onClick={() =>
                        onSaveService({
                          ...service,
                          is_active: !service.is_active,
                        })
                      }
                      className={`text-[11px] uppercase tracking-wider font-mono cursor-pointer ${
                        service.is_active ? 'text-[#51CF66]' : 'text-[#FA5252]'
                      }`}
                    >
                      {service.is_active ? '● Active' : '○ Disabled'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingService({ ...service });
                          setServiceModalOpen(true);
                        }}
                        className="p-1.5 text-[#B8B4AE] hover:text-[#C5A880] cursor-pointer"
                        title="Edit Service"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete service "${service.name}"?`)) {
                            onDeleteService(service.id);
                          }
                        }}
                        className="p-1.5 text-[#FA5252] hover:opacity-80 cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: STYLIST MANAGEMENT */}
        {/* ========================================================== */}
        {activeTab === 'stylists' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl text-[#FAF7F2]">Stylists & Artists</h2>
                <p className="text-xs text-[#8E8A83]">
                  Manage salon artists, specialties, and active booking availability.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingStylist({
                    name: '',
                    speciality: '',
                    bio: '',
                    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                    is_active: true,
                  });
                  setStylistModalOpen(true);
                }}
                className="px-4 py-2 bg-[#C5A880] text-[#0D0D10] text-xs uppercase tracking-wider font-semibold rounded-sm flex items-center gap-1.5 hover:bg-[#D6BE96] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Stylist
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {stylists.map((stylist) => (
                <div
                  key={stylist.id}
                  className={`bg-[#121217] border p-5 rounded-sm flex flex-col justify-between ${
                    stylist.is_active ? 'border-[#22222E]' : 'border-[#22222E] opacity-60'
                  }`}
                >
                  <div>
                    <div className="h-44 w-full mb-4 overflow-hidden rounded-sm bg-[#161620]">
                      <ImageWithFallback
                        src={stylist.image || ''}
                        alt={stylist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="font-serif text-lg text-[#FAF7F2] font-medium">
                      {stylist.name}
                    </h3>
                    <span className="text-[11px] text-[#C5A880] block mb-2">
                      {stylist.speciality}
                    </span>
                    {stylist.bio && (
                      <p className="text-xs text-[#8E8A83] font-light line-clamp-2">
                        {stylist.bio}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#1C1C26] flex items-center justify-between">
                    <button
                      onClick={() =>
                        onSaveStylist({
                          ...stylist,
                          is_active: !stylist.is_active,
                        })
                      }
                      className={`text-[11px] uppercase tracking-wider font-mono cursor-pointer ${
                        stylist.is_active ? 'text-[#51CF66]' : 'text-[#FA5252]'
                      }`}
                    >
                      {stylist.is_active ? '● Available' : '○ Off-Duty'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingStylist({ ...stylist });
                          setStylistModalOpen(true);
                        }}
                        className="p-1.5 text-[#B8B4AE] hover:text-[#C5A880] cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete stylist "${stylist.name}"?`)) {
                            onDeleteStylist(stylist.id);
                          }
                        }}
                        className="p-1.5 text-[#FA5252] hover:opacity-80 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 4: GALLERY MANAGEMENT */}
        {/* ========================================================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl text-[#FAF7F2]">Gallery Portfolio</h2>
                <p className="text-xs text-[#8E8A83]">
                  Curate photos shown in the customer visual gallery.
                </p>
              </div>

              <button
                onClick={() => setGalleryModalOpen(true)}
                className="px-4 py-2 bg-[#C5A880] text-[#0D0D10] text-xs uppercase tracking-wider font-semibold rounded-sm flex items-center gap-1.5 hover:bg-[#D6BE96] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Photograph
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#121217] border border-[#20202B] rounded-sm overflow-hidden flex flex-col justify-between group"
                >
                  <div className="h-44 overflow-hidden relative">
                    <ImageWithFallback
                      src={item.image_url}
                      alt={item.caption}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#09090C]/80 text-[#C5A880] text-[10px] font-mono uppercase rounded">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-3">
                    <p className="text-[11px] text-[#A6A29C] line-clamp-2 mb-3">
                      {item.caption}
                    </p>

                    <button
                      onClick={() => {
                        if (window.confirm('Delete this photograph from gallery?')) {
                          onDeleteGalleryItem(item.id);
                        }
                      }}
                      className="w-full py-1 text-center text-xs text-[#FA5252] hover:bg-[#FA5252]/10 border border-[#FA5252]/30 rounded-sm transition-colors cursor-pointer"
                    >
                      Delete Photo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 5: SALON SETTINGS (CENTRAL CONFIGURATION) */}
        {/* ========================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="font-serif text-2xl text-[#FAF7F2]">Central Salon Configuration</h2>
              <p className="text-xs text-[#8E8A83]">
                Edit business information, contacts, operating hours, and hero headlines. All customer pages update dynamically.
              </p>
            </div>

            {settingsSavedMessage && (
              <div className="p-3 bg-[#133020] border border-[#256840] text-[#75E2A0] text-xs rounded-sm flex items-center gap-2">
                <Check className="w-4 h-4" />
                Settings saved successfully!
              </div>
            )}

            <form onSubmit={handleSettingsSubmit} className="bg-[#121217] border border-[#20202B] p-6 rounded-sm space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#A9A59E] mb-1">Salon Name</label>
                  <input
                    type="text"
                    value={settingsForm.salon_name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, salon_name: e.target.value })}
                    className="w-full bg-[#181822] border border-[#262635] text-xs p-2.5 rounded-sm outline-none text-[#EDE8E0] focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#A9A59E] mb-1">Tagline</label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full bg-[#181822] border border-[#262635] text-xs p-2.5 rounded-sm outline-none text-[#EDE8E0] focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#A9A59E] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full bg-[#181822] border border-[#262635] text-xs p-2.5 rounded-sm outline-none text-[#EDE8E0] focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#A9A59E] mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                    className="w-full bg-[#181822] border border-[#262635] text-xs p-2.5 rounded-sm outline-none text-[#EDE8E0] focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#A9A59E] mb-1">Email</label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full bg-[#181822] border border-[#262635] text-xs p-2.5 rounded-sm outline-none text-[#EDE8E0] focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#A9A59E] mb-1">Opening Hours</label>
                  <input
                    type="text"
                    value={settingsForm.opening_hours}
                    onChange={(e) => setSettingsForm({ ...settingsForm, opening_hours: e.target.value })}
                    className="w-full bg-[#181822] border border-[#262635] text-xs p-2.5 rounded-sm outline-none text-[#EDE8E0] focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#A9A59E] mb-1">Full Physical Address</label>
                <textarea
                  rows={2}
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full bg-[#181822] border border-[#262635] text-xs p-2.5 rounded-sm outline-none text-[#EDE8E0] focus:border-[#C5A880]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#A9A59E] mb-1">Instagram Link</label>
                  <input
                    type="text"
                    value={settingsForm.instagram}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                    className="w-full bg-[#181822] border border-[#262635] text-xs p-2.5 rounded-sm outline-none text-[#EDE8E0] focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#A9A59E] mb-1">Google Maps Link</label>
                  <input
                    type="text"
                    value={settingsForm.google_maps_url}
                    onChange={(e) => setSettingsForm({ ...settingsForm, google_maps_url: e.target.value })}
                    className="w-full bg-[#181822] border border-[#262635] text-xs p-2.5 rounded-sm outline-none text-[#EDE8E0] focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#1C1C26]">
                <h3 className="text-xs uppercase tracking-wider text-[#C5A880] mb-3">
                  Homepage Headlines
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-[#A9A59E] mb-1">Hero Title</label>
                    <input
                      type="text"
                      value={settingsForm.hero_title}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hero_title: e.target.value })}
                      className="w-full bg-[#181822] border border-[#262635] text-xs p-2.5 rounded-sm outline-none text-[#EDE8E0] focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#A9A59E] mb-1">Hero Subtitle</label>
                    <input
                      type="text"
                      value={settingsForm.hero_subtitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hero_subtitle: e.target.value })}
                      className="w-full bg-[#181822] border border-[#262635] text-xs p-2.5 rounded-sm outline-none text-[#EDE8E0] focus:border-[#C5A880]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#C5A880] hover:bg-[#D6BE96] text-[#0D0D10] text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors cursor-pointer"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 6: SUPABASE & DATABASE CONFIGURATION */}
        {/* ========================================================== */}
        {activeTab === 'database' && (
          <div className="max-w-4xl space-y-8">
            <div>
              <h2 className="font-serif text-2xl text-[#FAF7F2]">Supabase Database & Authentication</h2>
              <p className="text-xs text-[#8E8A83]">
                Connect your live Supabase cloud project for persistent PostgreSQL storage, Row Level Security, and multi-user sync.
              </p>
            </div>

            {/* Connection Status Card */}
            <div className="bg-[#121217] border border-[#20202B] p-6 rounded-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3.5 h-3.5 rounded-full ${
                      authService.isSupabaseActive() ? 'bg-[#51CF66]' : 'bg-[#FFA94D]'
                    }`}
                  />
                  <div>
                    <h3 className="text-sm font-medium text-[#FAF7F2]">
                      {authService.isSupabaseActive()
                        ? 'Connected to Live Supabase'
                        : 'Running in Local Storage / Preview Mode'}
                    </h3>
                    <p className="text-xs text-[#8E8A83]">
                      {authService.isSupabaseActive()
                        ? 'All appointments, services, and staff records are synchronised to Supabase PostgreSQL.'
                        : 'Using the persistent local repository. All edits made in this dashboard work and persist locally.'}
                    </p>
                  </div>
                </div>

                <span className="font-mono text-[11px] text-[#C5A880]">
                  {authService.isSupabaseActive() ? 'LIVE' : 'LOCAL READY'}
                </span>
              </div>
            </div>

            {/* Step-by-Step Setup Guide */}
            <div className="bg-[#121217] border border-[#20202B] p-6 rounded-sm space-y-5 text-xs">
              <h3 className="font-serif text-lg text-[#FAF7F2] font-medium">
                How to Connect Your Supabase Project (3 Easy Steps)
              </h3>

              <div className="space-y-4 text-[#A6A29C]">
                <div>
                  <strong className="text-[#EDE8E0] block mb-1">
                    Step 1: Create a free Supabase project
                  </strong>
                  <span>Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#C5A880] underline">supabase.com</a>, create a project (e.g. "aura-salon-trichy").</span>
                </div>

                <div>
                  <strong className="text-[#EDE8E0] block mb-1">
                    Step 2: Run the SQL Schema
                  </strong>
                  <span>Open your Supabase project's <strong>SQL Editor</strong>, and paste the code from <code className="text-[#C5A880]">supabase_schema.sql</code> (provided below). Click <strong>Run</strong>.</span>
                </div>

                <div>
                  <strong className="text-[#EDE8E0] block mb-1">
                    Step 3: Add your keys to Environment Variables
                  </strong>
                  <div className="bg-[#09090C] p-3 rounded font-mono text-[11px] text-[#D4CFCA] mt-1 space-y-1">
                    <div>VITE_SUPABASE_URL="https://your-project.supabase.co"</div>
                    <div>VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6..."</div>
                  </div>
                </div>
              </div>

              {/* Schema SQL Preview and Copy button */}
              <div className="pt-4 border-t border-[#1C1C26]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#EDE8E0] font-medium">
                    Pre-generated schema file (supabase_schema.sql)
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`-- Run in Supabase SQL editor:
CREATE TABLE IF NOT EXISTS public.salon_settings (...);
CREATE TABLE IF NOT EXISTS public.services (...);
CREATE TABLE IF NOT EXISTS public.appointments (...);
CREATE TABLE IF NOT EXISTS public.stylists (...);
CREATE TABLE IF NOT EXISTS public.gallery (...);
-- RLS policies enabled automatically`);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 2000);
                    }}
                    className="text-[11px] text-[#C5A880] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedSql ? 'Copied!' : 'Copy Summary'}
                  </button>
                </div>
                <p className="text-[11px] text-[#78746E]">
                  The complete SQL file with Row Level Security (RLS) policies and seed data has been saved to the root of your project: <code className="text-[#EDE8E0]">/supabase_schema.sql</code>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================== */}
      {/* SERVICE MODAL */}
      {/* ========================================================== */}
      {serviceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 bg-[#09090C]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#121217] border border-[#252533] p-6 max-w-lg w-full rounded-sm space-y-4">
            <h3 className="font-serif text-xl text-[#FAF7F2]">
              {editingService.id ? 'Edit Service' : 'Add New Service'}
            </h3>

            <form onSubmit={handleSaveServiceSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A9A59E] mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full bg-[#181822] border border-[#262635] p-2.5 rounded-sm outline-none text-[#EDE8E0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A9A59E] mb-1">Category *</label>
                  <select
                    value={editingService.category}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        category: e.target.value as ServiceCategory,
                      })
                    }
                    className="w-full bg-[#181822] border border-[#262635] p-2.5 rounded-sm outline-none text-[#EDE8E0]"
                  >
                    <option value="HAIR">HAIR</option>
                    <option value="SKIN">SKIN</option>
                    <option value="GROOMING">GROOMING</option>
                    <option value="WOMEN">WOMEN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A9A59E] mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingService.price}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-[#181822] border border-[#262635] p-2.5 rounded-sm outline-none text-[#EDE8E0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A9A59E] mb-1">Duration (e.g. 45 mins)</label>
                <input
                  type="text"
                  value={editingService.duration || ''}
                  onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                  className="w-full bg-[#181822] border border-[#262635] p-2.5 rounded-sm outline-none text-[#EDE8E0]"
                />
              </div>

              <div>
                <label className="block text-[#A9A59E] mb-1">Short 1-line Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full bg-[#181822] border border-[#262635] p-2.5 rounded-sm outline-none text-[#EDE8E0]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="srv-active"
                  checked={editingService.is_active}
                  onChange={(e) =>
                    setEditingService({ ...editingService, is_active: e.target.checked })
                  }
                  className="rounded"
                />
                <label htmlFor="srv-active" className="text-xs text-[#EDE8E0]">
                  Active & Visible to Customers
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1C1C26]">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-4 py-2 border border-[#2A2A38] text-[#A6A29C] rounded-sm hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A880] text-[#0D0D10] font-semibold rounded-sm hover:bg-[#D6BE96]"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* STYLIST MODAL */}
      {/* ========================================================== */}
      {stylistModalOpen && editingStylist && (
        <div className="fixed inset-0 z-50 bg-[#09090C]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#121217] border border-[#252533] p-6 max-w-lg w-full rounded-sm space-y-4">
            <h3 className="font-serif text-xl text-[#FAF7F2]">
              {editingStylist.id ? 'Edit Stylist' : 'Add Stylist'}
            </h3>

            <form onSubmit={handleSaveStylistSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A9A59E] mb-1">Stylist Name *</label>
                <input
                  type="text"
                  required
                  value={editingStylist.name}
                  onChange={(e) => setEditingStylist({ ...editingStylist, name: e.target.value })}
                  className="w-full bg-[#181822] border border-[#262635] p-2.5 rounded-sm outline-none text-[#EDE8E0]"
                />
              </div>

              <div>
                <label className="block text-[#A9A59E] mb-1">Speciality *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Barber, Creative Director"
                  value={editingStylist.speciality}
                  onChange={(e) => setEditingStylist({ ...editingStylist, speciality: e.target.value })}
                  className="w-full bg-[#181822] border border-[#262635] p-2.5 rounded-sm outline-none text-[#EDE8E0]"
                />
              </div>

              <div>
                <label className="block text-[#A9A59E] mb-1">Photo URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={editingStylist.image || ''}
                  onChange={(e) => setEditingStylist({ ...editingStylist, image: e.target.value })}
                  className="w-full bg-[#181822] border border-[#262635] p-2.5 rounded-sm outline-none text-[#EDE8E0]"
                />
              </div>

              <div>
                <label className="block text-[#A9A59E] mb-1">Bio / Background</label>
                <textarea
                  rows={2}
                  value={editingStylist.bio || ''}
                  onChange={(e) => setEditingStylist({ ...editingStylist, bio: e.target.value })}
                  className="w-full bg-[#181822] border border-[#262635] p-2.5 rounded-sm outline-none text-[#EDE8E0]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="sty-active"
                  checked={editingStylist.is_active}
                  onChange={(e) =>
                    setEditingStylist({ ...editingStylist, is_active: e.target.checked })
                  }
                  className="rounded"
                />
                <label htmlFor="sty-active" className="text-xs text-[#EDE8E0]">
                  Available for Customer Appointments
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1C1C26]">
                <button
                  type="button"
                  onClick={() => setStylistModalOpen(false)}
                  className="px-4 py-2 border border-[#2A2A38] text-[#A6A29C] rounded-sm hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A880] text-[#0D0D10] font-semibold rounded-sm hover:bg-[#D6BE96]"
                >
                  Save Stylist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* GALLERY MODAL */}
      {/* ========================================================== */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#09090C]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#121217] border border-[#252533] p-6 max-w-lg w-full rounded-sm space-y-4">
            <h3 className="font-serif text-xl text-[#FAF7F2]">Add Gallery Photograph</h3>

            <form onSubmit={handleAddGallerySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A9A59E] mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  className="w-full bg-[#181822] border border-[#262635] p-2.5 rounded-sm outline-none text-[#EDE8E0]"
                />
              </div>

              <div>
                <label className="block text-[#A9A59E] mb-1">Category *</label>
                <select
                  value={newGalleryCategory}
                  onChange={(e) =>
                    setNewGalleryCategory(e.target.value as Exclude<GalleryCategory, 'ALL'>)
                  }
                  className="w-full bg-[#181822] border border-[#262635] p-2.5 rounded-sm outline-none text-[#EDE8E0]"
                >
                  <option value="HAIR">HAIR</option>
                  <option value="STYLING">STYLING</option>
                  <option value="GROOMING">GROOMING</option>
                  <option value="SALON">SALON</option>
                  <option value="TRANSFORMATIONS">TRANSFORMATIONS</option>
                </select>
              </div>

              <div>
                <label className="block text-[#A9A59E] mb-1">Caption / Look Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Bespoke layered haircut and caramel highlights."
                  value={newGalleryCaption}
                  onChange={(e) => setNewGalleryCaption(e.target.value)}
                  className="w-full bg-[#181822] border border-[#262635] p-2.5 rounded-sm outline-none text-[#EDE8E0]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1C1C26]">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="px-4 py-2 border border-[#2A2A38] text-[#A6A29C] rounded-sm hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A880] text-[#0D0D10] font-semibold rounded-sm hover:bg-[#D6BE96]"
                >
                  Add to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
