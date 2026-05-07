'use client';

import { useAppointments, useCancelAppointment } from '@/lib/hooks/useAppointments';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Calendar, MapPin, Clock, XCircle, Activity, ArrowLeft, Stethoscope, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { useState } from 'react';

type TabType = 'upcoming' | 'past' | 'cancelled';

export default function PatientAppointmentsPage() {
  const { data: appointments, isLoading } = useAppointments();
  const cancelAppointment = useCancelAppointment();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  const handleCancel = (id: number) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      cancelAppointment.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge variant="success">Confirmed</Badge>;
      case 'cancelled': return <Badge variant="error">Cancelled</Badge>;
      case 'completed': return <Badge variant="default" className="bg-blue-100 text-blue-800">Completed</Badge>;
      default: return <Badge variant="warning">Pending</Badge>;
    }
  };

  const now = new Date();
  const filtered = (appointments || []).filter((apt) => {
    const date = new Date(apt.appointmentDate);
    if (activeTab === 'upcoming') return ['pending', 'confirmed'].includes(apt.status) && date > now;
    if (activeTab === 'past') return apt.status === 'completed' || (date < now && apt.status !== 'cancelled');
    return apt.status === 'cancelled';
  });

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'upcoming', label: 'Upcoming', count: (appointments || []).filter(a => ['pending', 'confirmed'].includes(a.status) && new Date(a.appointmentDate) > now).length },
    { key: 'past', label: 'Past', count: (appointments || []).filter(a => a.status === 'completed' || (new Date(a.appointmentDate) < now && a.status !== 'cancelled')).length },
    { key: 'cancelled', label: 'Cancelled', count: (appointments || []).filter(a => a.status === 'cancelled').length },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--med-surface)]">
        <div className="max-w-5xl mx-auto p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="space-y-3 mt-8">
              {[1,2,3].map(i => <div key={i} className="h-32 bg-white rounded-2xl" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--med-surface)]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-[rgba(76,118,59,0.1)] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-[var(--med-primary)] font-bold text-xl tracking-tight">
            <div className="w-9 h-9 rounded-lg bg-[var(--med-primary)] flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-[var(--med-deep)]">MED<span className="text-[var(--med-primary)]">FIND</span></span>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm" className="text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--med-deep)]">My Appointments</h1>
            <p className="text-gray-500 mt-1 text-sm">Manage your healthcare visits</p>
          </div>
          <Link href="/">
            <Button className="bg-[var(--med-primary)] text-white hover:bg-[var(--med-primary)]/90 rounded-xl">
              <Calendar className="w-4 h-4 mr-2" /> Book New
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-[rgba(76,118,59,0.08)] shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-[var(--med-primary)] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-xs ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <Card className="text-center py-16 border-dashed border-2 rounded-2xl">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No {activeTab} appointments</h3>
            <p className="text-gray-500 mt-1 mb-6 text-sm">
              {activeTab === 'upcoming' ? "You don't have any upcoming visits scheduled." : activeTab === 'past' ? 'No past appointments found.' : 'No cancelled appointments.'}
            </p>
            {activeTab === 'upcoming' && (
              <Link href="/"><Button variant="outline" className="rounded-xl">Find a Facility</Button></Link>
            )}
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((apt) => {
              const date = new Date(apt.appointmentDate);
              const isUpcoming = ['pending', 'confirmed'].includes(apt.status) && date > now;

              return (
                <Card key={apt.id} className={`rounded-2xl transition-all hover:shadow-md ${isUpcoming ? 'border-l-4 border-l-[var(--med-primary)]' : ''}`}>
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="w-10 h-10 rounded-xl bg-[var(--med-primary)]/10 flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-[var(--med-primary)]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-[var(--med-deep)] text-base">
                              {apt.serviceName || 'General Consultation'}
                            </h3>
                            <Link href={`/facilities/${apt.facilityId}`} className="text-sm text-gray-500 hover:text-[var(--med-primary)] flex items-center gap-1">
                              <Building2 className="w-3 h-3" /> {apt.facility?.name}
                            </Link>
                          </div>
                          <div className="ml-auto">{getStatusBadge(apt.status)}</div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {apt.notes && (
                          <div className="text-sm bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-600 italic">
                            &ldquo;{apt.notes}&rdquo;
                          </div>
                        )}
                      </div>

                      {['pending', 'confirmed'].includes(apt.status) && date > now && (
                        <div className="flex md:flex-col justify-end items-end gap-2 md:w-28 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-xl text-xs"
                            onClick={() => handleCancel(apt.id)}
                            isLoading={cancelAppointment.isPending}
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
