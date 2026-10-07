import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, MessageCircle, Phone, ArrowLeft, User, Mail, Sparkles } from 'lucide-react';
import { Appointment, SalonSettings, Service, Stylist } from '../types';

interface AppointmentPageProps {
  services: Service[];
  stylists: Stylist[];
  settings: SalonSettings;
  preSelectedServiceId?: string;
  onBookAppointment: (
    data: Omit<Appointment, 'id' | 'status' | 'created_at'>
  ) => Promise<Appointment>;
  onNavigate: (tab: string) => void;
}

const TIME_SLOTS = [
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
];

export const AppointmentPage: React.FC<AppointmentPageProps> = ({
  services,
  stylists,
  settings,
  preSelectedServiceId,
  onBookAppointment,
  onNavigate,
}) => {
  const activeServices = services.filter((s) => s.is_active);
  const activeStylists = stylists.filter((s) => s.is_active);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'prefer_not_to_say'>('prefer_not_to_say');
  const [serviceId, setServiceId] = useState<string>(preSelectedServiceId || (activeServices[0]?.id || ''));
  const [stylistId, setStylistId] = useState<string>('any');
  
  // Date picker (prevent past dates)
  const todayStr = new Date().toISOString().split('T')[0];
  const [appointmentDate, setAppointmentDate] = useState<string>(todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00 AM');
  const [specialRequest, setSpecialRequest] = useState<string>('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 8) {
      setErrorMessage('Please provide a valid contact phone number.');
      return;
    }
    if (!serviceId) {
      setErrorMessage('Please select a service.');
      return;
    }
    if (!appointmentDate) {
      setErrorMessage('Please select an appointment date.');
      return;
    }
    if (!selectedTimeSlot) {
      setErrorMessage('Please choose a preferred time slot.');
      return;
    }

    const selectedService = activeServices.find((s) => s.id === serviceId);
    const selectedStylist = activeStylists.find((s) => s.id === stylistId);

    setIsSubmitting(true);
    try {
      const created = await onBookAppointment({
        customer_name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        gender,
        service_id: serviceId,
        service_name: selectedService ? selectedService.name : 'Bespoke Consultation',
        stylist_id: stylistId,
        stylist_name: selectedStylist ? selectedStylist.name : 'Any Available Master Stylist',
        appointment_date: appointmentDate,
        appointment_time: selectedTimeSlot,
        special_request: specialRequest.trim() || undefined,
      });

      setConfirmedAppointment(created);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to record appointment. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanPhone = settings.phone.replace(/[^0-9+]/g, '');
  const cleanWhatsApp = settings.whatsapp.replace(/[^0-9]/g, '');

  // Render Confirmation Screen
  if (confirmedAppointment) {
    const waMessage = encodeURIComponent(
      `Hello ${settings.salon_name}, I just requested an appointment on your website:\n` +
      `• Name: ${confirmedAppointment.customer_name}\n` +
      `• Service: ${confirmedAppointment.service_name}\n` +
      `• Date: ${confirmedAppointment.appointment_date}\n` +
      `• Time: ${confirmedAppointment.appointment_time}\n` +
      `• Stylist: ${confirmedAppointment.stylist_name}\n` +
      `• Ref ID: #${confirmedAppointment.id}`
    );

    return (
      <div className="bg-[#0D0D10] text-[#EDE8E0] min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full bg-[#121217] border border-[#252533] p-8 sm:p-10 rounded-sm shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-[#1A1A24] border border-[#C5A880]/30 text-[#C5A880] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A880] font-mono block mb-2">
            Reference ID: {confirmedAppointment.id}
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-normal mb-3">
            Appointment Request Received
          </h2>

          <p className="text-sm text-[#9E9A92] font-light mb-8 leading-relaxed">
            Thank you, <strong className="text-[#EDE8E0] font-medium">{confirmedAppointment.customer_name}</strong>. Your appointment request has been recorded in our system. Our reception team in Thillai Nagar, Trichy will contact you shortly to confirm your slot.
          </p>

          {/* Details Card */}
          <div className="bg-[#0A0A0E] border border-[#1E1E28] rounded-sm p-6 text-left mb-8 space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-[#181822]">
              <span className="text-[#7A7771]">Service</span>
              <span className="text-[#EDE8E0] font-medium">{confirmedAppointment.service_name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#181822]">
              <span className="text-[#7A7771]">Date</span>
              <span className="text-[#EDE8E0] font-medium">{confirmedAppointment.appointment_date}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#181822]">
              <span className="text-[#7A7771]">Time</span>
              <span className="text-[#EDE8E0] font-medium">{confirmedAppointment.appointment_time}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#181822]">
              <span className="text-[#7A7771]">Stylist</span>
              <span className="text-[#EDE8E0] font-medium">{confirmedAppointment.stylist_name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#181822]">
              <span className="text-[#7A7771]">Phone</span>
              <span className="text-[#EDE8E0] font-mono">{confirmedAppointment.phone}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#7A7771]">Status</span>
              <span className="text-[#C5A880] uppercase tracking-wider font-mono text-[10px]">
                {confirmedAppointment.status}
              </span>
            </div>
          </div>

          {/* Direct WhatsApp Confirmation Button */}
          <div className="space-y-3">
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${waMessage}`}
              target="_blank"
              rel="noreferrer noopener"
              className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs uppercase tracking-widest font-semibold rounded-sm flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              Notify Us Instantly on WhatsApp
            </a>

            <a
              href={`tel:${cleanPhone}`}
              className="w-full py-3 px-4 bg-[#181820] hover:bg-[#23232E] text-[#EDE8E0] border border-[#2B2B3A] text-xs uppercase tracking-widest font-medium rounded-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#C5A880]" />
              Call Studio Desk ({settings.phone})
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-[#1C1C26] flex items-center justify-center gap-6 text-xs text-[#8E8A83]">
            <button
              onClick={() => {
                setConfirmedAppointment(null);
                setFullName('');
                setPhone('');
              }}
              className="text-[#C5A880] hover:underline cursor-pointer"
            >
              Book Another Appointment
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('home')}
              className="text-[#9E9A92] hover:text-[#EDE8E0] cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Booking Form View
  return (
    <div className="bg-[#0D0D10] text-[#EDE8E0] min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-medium block mb-3">
            Reservations
          </span>
          <h1
            className="font-serif text-3xl sm:text-5xl text-[#FAF7F2] font-normal mb-3"
            style={{ textWrap: 'balance' }}
          >
            Book Your Appointment
          </h1>
          <p className="text-xs sm:text-sm text-[#9E9A92] font-light leading-relaxed">
            Choose your service, preferred stylist and time. We will prepare your station and bespoke formulations in advance.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-8 p-4 bg-[#2A1515] border border-[#7A2A2A] text-[#F3A5A5] text-xs rounded-sm">
            {errorMessage}
          </div>
        )}

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#121217] border border-[#22222E] rounded-sm p-6 sm:p-10 shadow-xl space-y-8"
        >
          {/* Section 1: Personal Details */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#C5A880] font-medium mb-4 flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              1. Your Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-[#A9A59E] mb-1.5">
                  Full Name <span className="text-[#C5A880]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar / Priya Sundar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#17171F] border border-[#262635] focus:border-[#C5A880] text-[#EDE8E0] text-xs px-3.5 py-3 rounded-sm outline-none placeholder:text-[#5E5B55] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-[#A9A59E] mb-1.5">
                  Phone Number <span className="text-[#C5A880]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98401 23456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#17171F] border border-[#262635] focus:border-[#C5A880] text-[#EDE8E0] text-xs px-3.5 py-3 rounded-sm outline-none placeholder:text-[#5E5B55] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-[#A9A59E] mb-1.5">
                  Email Address <span className="text-[#6D6A64]">(Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#17171F] border border-[#262635] focus:border-[#C5A880] text-[#EDE8E0] text-xs px-3.5 py-3 rounded-sm outline-none placeholder:text-[#5E5B55] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-[#A9A59E] mb-1.5">
                  Gender Preference
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-[#17171F] border border-[#262635] focus:border-[#C5A880] text-[#EDE8E0] text-xs px-3.5 py-3 rounded-sm outline-none transition-colors"
                >
                  <option value="prefer_not_to_say">Prefer not to say</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Service & Stylist Selection */}
          <div className="pt-6 border-t border-[#1C1C26]">
            <h3 className="text-xs uppercase tracking-widest text-[#C5A880] font-medium mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              2. Service & Stylist
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-[#A9A59E] mb-1.5">
                  Select Service <span className="text-[#C5A880]">*</span>
                </label>
                <select
                  required
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full bg-[#17171F] border border-[#262635] focus:border-[#C5A880] text-[#EDE8E0] text-xs px-3.5 py-3 rounded-sm outline-none transition-colors"
                >
                  {activeServices.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.name} — ₹{srv.price} ({srv.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#A9A59E] mb-1.5">
                  Preferred Stylist
                </label>
                <select
                  value={stylistId}
                  onChange={(e) => setStylistId(e.target.value)}
                  className="w-full bg-[#17171F] border border-[#262635] focus:border-[#C5A880] text-[#EDE8E0] text-xs px-3.5 py-3 rounded-sm outline-none transition-colors"
                >
                  <option value="any">Any Available Master Stylist</option>
                  {activeStylists.map((sty) => (
                    <option key={sty.id} value={sty.id}>
                      {sty.name} ({sty.speciality})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Date & Time Slot */}
          <div className="pt-6 border-t border-[#1C1C26]">
            <h3 className="text-xs uppercase tracking-widest text-[#C5A880] font-medium mb-4 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              3. Date & Time
            </h3>

            <div className="space-y-4">
              <div className="max-w-xs">
                <label className="block text-xs text-[#A9A59E] mb-1.5">
                  Appointment Date <span className="text-[#C5A880]">*</span>
                </label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full bg-[#17171F] border border-[#262635] focus:border-[#C5A880] text-[#EDE8E0] text-xs px-3.5 py-3 rounded-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-[#A9A59E] mb-2">
                  Select Time Slot <span className="text-[#C5A880]">*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2 px-1 text-center text-xs font-mono rounded-sm border transition-all cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? 'bg-[#C5A880] text-[#0D0D10] border-[#C5A880] font-semibold shadow-sm'
                            : 'bg-[#16161E] text-[#B5B1AA] border-[#252533] hover:border-[#3E3E50] hover:text-[#EDE8E0]'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Special Request */}
          <div className="pt-6 border-t border-[#1C1C26]">
            <label className="block text-xs text-[#A9A59E] mb-1.5">
              Special Request or Hair/Skin Notes <span className="text-[#6D6A64]">(Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Sensitive scalp, previous hair coloring history, preferred style references, wedding event schedule..."
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              className="w-full bg-[#17171F] border border-[#262635] focus:border-[#C5A880] text-[#EDE8E0] text-xs p-3.5 rounded-sm outline-none placeholder:text-[#5E5B55] transition-colors"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 text-xs uppercase tracking-widest font-semibold bg-[#C5A880] hover:bg-[#D6BE96] text-[#0D0D10] transition-colors cursor-pointer rounded-sm shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Recording Reservation...</span>
              ) : (
                <span>Confirm Appointment Request</span>
              )}
            </button>
            <p className="text-[11px] text-[#7A7771] text-center mt-3">
              No advance payment required. You may pay at the salon via Cash, UPI, or Card after your service.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
