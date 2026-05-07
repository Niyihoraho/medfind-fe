'use client';

import { useParams, useRouter } from 'next/navigation';
import { useFacility } from '@/lib/hooks/useFacilities';
import { useCreateAppointment } from '@/lib/hooks/useAppointments';
import { useAuthStore } from '@/store/auth.store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Footer } from '@/components/Footer';
import { MapPin, Phone, Mail, Building2, Calendar, Navigation2, Star, Activity, Shield, ArrowLeft, ExternalLink, CheckCircle2, Stethoscope, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const FacilityMap = dynamic(
  () => import('@/components/map/FacilityMap').then((mod) => mod.FacilityMap),
  { ssr: false, loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-xl" /> }
);



export default function FacilityDetailsPage() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();

  const { data: facility, isLoading } = useFacility(id);
  const createAppointment = useCreateAppointment();
  const { isAuthenticated, user } = useAuthStore();

  // Multi-step booking state
  const [bookingStep, setBookingStep] = useState(1); // 1=service, 2=date, 3=review
  const [formData, setFormData] = useState({
    service_name: '',
    appointment_date: '',
    notes: '',
    full_name: '',
    email: '',
    phone: '',
  });


  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--med-surface)]">
        {/* Skeleton */}
        <div className="h-72 bg-gray-200 animate-pulse" />
        <div className="max-w-6xl mx-auto px-4 -mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm animate-pulse">
            <div className="h-8 bg-gray-100 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="min-h-screen bg-[var(--med-surface)] flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium text-lg">Facility not found.</p>
          <Link href="/">
            <Button variant="outline" className="mt-4">Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createAppointment.mutateAsync({
        facility_id: id,
        service_name: formData.service_name,
        appointment_date: formData.appointment_date,
        notes: formData.notes,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
      });
      setBookingRef((result as any).bookingRef || '');
      setShowSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to book appointment.');
    }
  };

  const canProceedStep1 = !!formData.service_name;
  const canProceedStep2 = !!formData.appointment_date && !!formData.full_name && !!formData.email && !!formData.phone;

  // Get minimum date (tomorrow)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  const mapsUrl = facility.latitude && facility.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`
    : null;

  return (
    <div className="min-h-screen bg-[var(--med-surface)] flex flex-col">
      {/* ─── NAVBAR ─────────────────────────────────────────── */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-[rgba(76,118,59,0.1)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-[var(--med-primary)] font-bold text-xl tracking-tight">
            <div className="w-9 h-9 rounded-lg bg-[var(--med-primary)] flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-[var(--med-deep)]">MED<span className="text-[var(--med-primary)]">FIND</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" size="sm" className="text-sm">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO IMAGE ────────────────────────────────────── */}
      <div className="relative h-72 md:h-80 bg-gradient-to-br from-[var(--med-deep)] to-[var(--med-primary)] overflow-hidden">
        {facility.imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={facility.imageUrl} alt={facility.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        )}

        {/* Badges on hero */}
        <div className="absolute top-6 left-6 flex gap-2">
          {facility.isPartner && (
            <span className="inline-flex items-center gap-1.5 bg-[var(--med-primary)] text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg">
              <Star className="w-4 h-4" /> Official Partner
            </span>
          )}
          <span className="inline-flex items-center bg-white/90 backdrop-blur-sm text-[var(--med-deep)] px-3 py-1.5 rounded-lg text-xs font-bold capitalize shadow-sm">
            {facility.type.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* ─── MAIN CONTENT ──────────────────────────────────── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 -mt-16 relative z-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN: Info ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Title Card */}
            <Card className="rounded-2xl shadow-md border-0 overflow-hidden">
              <div className="p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--med-deep)] mb-2">{facility.name}</h1>
                {facility.organization && (
                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-4">
                    <Building2 className="w-4 h-4" />
                    Part of <span className="font-semibold text-[var(--med-primary)]">{facility.organization.name}</span>
                  </p>
                )}

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                  <div className="flex items-start gap-3 p-4 bg-[var(--med-surface)] rounded-xl border border-[rgba(76,118,59,0.08)]">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Location</p>
                      <p className="text-sm font-medium text-[var(--med-deep)]">{facility.address || 'Address not provided'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {facility.location?.sector}, {facility.location?.district}, {facility.location?.province}
                      </p>
                      {mapsUrl && (
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--med-primary)] hover:underline mt-2"
                        >
                          <Navigation2 className="w-3.5 h-3.5" /> Get Directions
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[var(--med-surface)] rounded-xl border border-[rgba(76,118,59,0.08)]">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Contact</p>
                      <p className="text-sm font-medium text-[var(--med-deep)]">{facility.phone || 'Phone not provided'}</p>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {facility.email || 'Email not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Services Card */}
            <Card className="rounded-2xl shadow-sm border-[rgba(76,118,59,0.08)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-[var(--med-deep)] flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[var(--med-primary)]" />
                  Available Services
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="flex flex-wrap gap-2">
                  {facility.services?.length ? (
                    facility.services.filter((s) => s.isAvailable).map((s) => (
                      <span
                        key={s.serviceId}
                        className="inline-flex items-center bg-[var(--med-accent)]/15 text-[var(--med-deep)] px-3 py-1.5 rounded-lg text-sm font-medium border border-[var(--med-accent)]/20"
                      >
                        {s.service?.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 italic text-sm">No services listed</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Insurances Card */}
            <Card className="rounded-2xl shadow-sm border-[rgba(76,118,59,0.08)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-[var(--med-deep)] flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Accepted Insurance Schemes
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="flex flex-wrap gap-2">
                  {facility.insurances?.length ? (
                    facility.insurances.map((i) => (
                      <span
                        key={i.insuranceId}
                        className="inline-flex items-center bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-100"
                      >
                        {i.insurance?.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 italic text-sm">No insurance information available</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Map Card */}
            {facility.latitude && facility.longitude && (
              <Card className="rounded-2xl shadow-sm border-[rgba(76,118,59,0.08)] overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-[var(--med-deep)] flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[var(--med-primary)]" />
                    Location on Map
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <FacilityMap
                    facilities={[facility]}
                    center={[Number(facility.latitude), Number(facility.longitude)]}
                    zoom={15}
                    className="h-[300px] w-full"
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── RIGHT COLUMN: Booking ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <Card className="rounded-2xl shadow-md border-0 overflow-hidden">
                <div className="bg-gradient-to-br from-[var(--med-primary)] to-[var(--med-deep)] p-5">
                  <CardTitle className="flex items-center gap-2 text-xl text-white">
                    <Calendar className="w-5 h-5" />
                    Book Appointment
                  </CardTitle>
                  <p className="text-white/60 text-sm mt-1">Schedule your visit directly</p>
                  {/* Step indicator */}
                  <div className="flex items-center gap-2 mt-4">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${bookingStep >= s ? 'bg-white text-[var(--med-primary)]' : 'bg-white/20 text-white/60'}`}>{s}</div>
                        {s < 3 && <div className={`w-6 h-0.5 ${bookingStep > s ? 'bg-white' : 'bg-white/20'}`} />}
                      </div>
                    ))}
                  </div>
                </div>
                <CardContent className="p-5">
                  <form onSubmit={handleBooking}>
                      {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 mb-4">{error}</div>
                      )}

                      {/* Step 1: Select Service */}
                      {bookingStep === 1 && (
                        <div className="space-y-3">
                          <p className="text-sm font-semibold text-[var(--med-deep)] flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-[var(--med-primary)]" /> Select a Service
                          </p>
                          <div className="grid gap-2 max-h-[280px] overflow-y-auto pr-1">
                            {facility.services?.filter((s) => s.isAvailable).map((s) => (
                              <button
                                type="button"
                                key={s.serviceId}
                                onClick={() => setFormData({ ...formData, service_name: s.service!.name })}
                                className={`w-full text-left p-3 rounded-xl border-2 transition-all text-sm font-medium ${formData.service_name === s.service!.name ? 'border-[var(--med-primary)] bg-[var(--med-primary)]/5 text-[var(--med-primary)]' : 'border-gray-100 hover:border-gray-200 text-gray-700'}`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{s.service?.name}</span>
                                  {formData.service_name === s.service!.name && <CheckCircle2 className="w-4 h-4" />}
                                </div>
                              </button>
                            ))}
                            {(!facility.services || facility.services.filter(s => s.isAvailable).length === 0) && (
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, service_name: 'General Consultation' })}
                                className={`w-full text-left p-3 rounded-xl border-2 transition-all text-sm font-medium ${formData.service_name === 'General Consultation' ? 'border-[var(--med-primary)] bg-[var(--med-primary)]/5 text-[var(--med-primary)]' : 'border-gray-100 hover:border-gray-200 text-gray-700'}`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>General Consultation</span>
                                  {formData.service_name === 'General Consultation' && <CheckCircle2 className="w-4 h-4" />}
                                </div>
                              </button>
                            )}
                          </div>
                          <Button
                            type="button"
                            disabled={!canProceedStep1}
                            onClick={() => { setError(null); setBookingStep(2); }}
                            className="w-full bg-[var(--med-primary)] text-white hover:bg-[var(--med-primary)]/90 rounded-xl h-11 font-semibold mt-2"
                          >
                            Continue <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      )}

                      {/* Step 2: Date & Contact */}
                      {bookingStep === 2 && (
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <p className="text-sm font-semibold text-[var(--med-deep)] flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-[var(--med-primary)]" /> Date & Contact
                            </p>
                            <Input
                              type="date"
                              min={minDateStr}
                              required
                              value={formData.appointment_date}
                              onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                            />
                            <div className="grid gap-2">
                              <Input
                                placeholder="Patient Full Name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                              />
                              <Input
                                placeholder="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              />
                              <Input
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--med-deep)] flex items-center gap-2 mb-2">
                              <FileText className="w-4 h-4 text-gray-400" /> Notes <span className="text-gray-400 font-normal">(optional)</span>
                            </p>
                            <textarea
                              className="w-full px-3 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-[var(--med-primary)] focus:border-[var(--med-primary)] sm:text-sm resize-none"
                              rows={2}
                              placeholder="Symptoms or requests..."
                              value={formData.notes}
                              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => setBookingStep(1)} className="rounded-xl">
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              disabled={!canProceedStep2}
                              onClick={() => { setError(null); setBookingStep(3); }}
                              className="flex-1 bg-[var(--med-primary)] text-white hover:bg-[var(--med-primary)]/90 rounded-xl h-11 font-semibold"
                            >
                              Review Booking <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Review & Confirm */}
                      {bookingStep === 3 && (
                        <div className="space-y-4">
                          <p className="text-sm font-semibold text-[var(--med-deep)]">Review Your Appointment</p>
                          <div className="bg-[var(--med-surface)] rounded-xl p-4 space-y-3 border border-[rgba(76,118,59,0.08)]">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Facility</span>
                              <span className="font-semibold text-[var(--med-deep)] text-right max-w-[60%]">{facility.name}</span>
                            </div>
                            <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
                              <span className="text-gray-500">Service</span>
                              <span className="font-semibold text-[var(--med-deep)]">{formData.service_name}</span>
                            </div>
                            <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
                              <span className="text-gray-500">Date</span>
                              <span className="font-semibold text-[var(--med-deep)]">
                                {new Date(formData.appointment_date + 'T00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
                              <span className="text-gray-500">Patient</span>
                              <span className="font-semibold text-[var(--med-deep)]">{formData.full_name}</span>
                            </div>
                            <div className="flex justify-between text-sm border-t border-gray-100 pt-2 text-xs">
                              <span className="text-gray-500">Contact</span>
                              <span className="text-gray-600">{formData.phone}</span>
                            </div>

                            {formData.notes && (
                              <div className="border-t border-gray-100 pt-2 text-sm">
                                <span className="text-gray-500 block mb-1">Notes</span>
                                <span className="text-gray-700 italic">&ldquo;{formData.notes}&rdquo;</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => setBookingStep(2)} className="rounded-xl">
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                              type="submit"
                              className="flex-1 bg-[var(--med-primary)] text-white hover:bg-[var(--med-primary)]/90 rounded-xl h-11 font-semibold"
                              isLoading={createAppointment.isPending}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm Booking
                            </Button>
                          </div>
                        </div>
                      )}
                    </form>
                </CardContent>
              </Card>

              {/* Quick Info Card */}
              <Card className="rounded-2xl shadow-sm border-[rgba(76,118,59,0.08)]">
                <CardContent className="p-5 space-y-4">
                  <h4 className="font-bold text-sm text-[var(--med-deep)] uppercase tracking-wider">Quick Info</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category</span>
                      <Badge variant="outline" className="capitalize">{facility.category}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type</span>
                      <span className="font-medium capitalize text-[var(--med-deep)]">{facility.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Partner</span>
                      <span className="font-medium text-[var(--med-deep)]">{facility.isPartner ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Services</span>
                      <span className="font-medium text-[var(--med-deep)]">{facility.services?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Insurances</span>
                      <span className="font-medium text-[var(--med-deep)]">{facility.insurances?.length || 0}</span>
                    </div>
                  </div>
                  {mapsUrl && (
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full mt-2 rounded-xl text-sm">
                        <Navigation2 className="w-4 h-4 mr-2" /> Open in Google Maps
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* ─── SUCCESS MODAL ─────────────────────────────────── */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSuccess(false)} />
          <div className="relative z-50 w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-[var(--med-primary)] to-[var(--med-deep)] p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Booking Confirmed!</h2>
              <p className="text-white/70 text-sm mt-2">Your appointment has been scheduled</p>
              {bookingRef && (
                <div className="mt-4 inline-block bg-white/10 border border-white/20 rounded-lg px-4 py-2">
                  <p className="text-white/60 text-xs uppercase tracking-wider">Reference</p>
                  <p className="text-white font-bold text-lg tracking-widest">{bookingRef}</p>
                </div>
              )}
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-[var(--med-surface)] rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Facility</span>
                  <span className="font-semibold text-[var(--med-deep)]">{facility.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service</span>
                  <span className="font-medium">{formData.service_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">
                    {new Date(formData.appointment_date + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Patient</span>
                  <span className="font-medium">{formData.full_name}</span>
                </div>

              </div>
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                <p className="text-blue-700 text-xs">📧 A confirmation email has been sent to your registered email address.</p>
              </div>
              <div className="flex gap-3">
                <Button className="w-full bg-[var(--med-primary)] text-white hover:bg-[var(--med-primary)]/90 rounded-xl" onClick={() => { setShowSuccess(false); setBookingStep(1); setFormData({ service_name: '', appointment_date: '', notes: '', full_name: '', email: '', phone: '' }); }}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

