'use client';

import { useState, useEffect } from 'react';
import { useFacilities } from '@/lib/hooks';
import type { FacilitySearchParams, Facility } from '@/types';
import { FacilityFilters } from '@/components/facility/FacilityFilters';
import { FacilityCard } from '@/components/facility/FacilityCard';
import { Footer } from '@/components/Footer';
import { Activity, MapPin, Search, Shield, Calendar, Star, ChevronRight, Navigation2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import dynamic from 'next/dynamic';

const FacilityMap = dynamic(
  () => import('@/components/map/FacilityMap').then((mod) => mod.FacilityMap),
  { ssr: false, loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-xl" /> }
);

export default function LandingPage() {
  const [filters, setFilters] = useState<FacilitySearchParams>({
    sort: 'name',
    limit: 50,
    verified: 0,
  });
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null);
  const [showMap, setShowMap] = useState(false);

  const { data, isLoading } = useFacilities(filters);

  const handleFilterChange = (newFilters: Partial<FacilitySearchParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSearch = () => {};

  // Get partner facilities for the hero strip
  const partnerFacilities = data?.facilities?.filter((f: Facility) => f.isPartner) || [];

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
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#search" className="hover:text-[var(--med-primary)] transition-colors font-medium">Find Care</a>
            <a href="#how-it-works" className="hover:text-[var(--med-primary)] transition-colors font-medium">How It Works</a>
            <a href="#partners" className="hover:text-[var(--med-primary)] transition-colors font-medium">Partners</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/register">
              <Button variant="ghost" className="text-sm font-medium text-gray-600 hover:text-[var(--med-primary)]">
                Register
              </Button>
            </Link>
            <Link href="/login">
              <Button className="text-sm font-medium bg-[var(--med-primary)] text-white hover:bg-[var(--med-primary)]/90 rounded-lg px-5">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--med-deep)] via-[#0a4f20] to-[var(--med-primary)]">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
          <svg viewBox="0 0 400 400" className="w-full h-full"><path d="M200 0C90 0 0 90 0 200s90 200 200 200 200-90 200-200S310 0 200 0zm0 350c-83 0-150-67-150-150S117 50 200 50s150 67 150 150-67 150-150 150z" fill="white"/></svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-[var(--med-accent)] animate-pulse" />
              <span className="text-[var(--med-accent-light)] text-sm font-medium">Serving Rwanda&apos;s Healthcare Needs</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
              Find the right care,<br />
              <span className="text-[var(--med-accent)]">right where you are.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed">
              Navigate thousands of healthcare facilities across Rwanda. Filter by location, services, and your insurance scheme — whether you&apos;re a citizen or a visitor.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#search">
                <Button className="bg-white text-[var(--med-deep)] hover:bg-white/90 font-semibold px-8 py-3 h-auto text-base rounded-xl shadow-lg shadow-black/20">
                  <Search className="w-5 h-5 mr-2" />
                  Search Facilities
                </Button>
              </a>
              <a href="#how-it-works">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 h-auto text-base rounded-xl">
                  Learn How It Works
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{data?.pagination?.total || '...'}</p>
              <p className="text-white/50 text-sm mt-1">Facilities</p>
            </div>
            <div className="text-center border-x border-white/10">
              <p className="text-3xl font-bold text-white">5</p>
              <p className="text-white/50 text-sm mt-1">Provinces</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-white/50 text-sm mt-1">Access</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-white border-b border-[rgba(76,118,59,0.05)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[var(--med-primary)] font-semibold text-sm uppercase tracking-wider mb-2">Simple & Fast</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--med-deep)] tracking-tight">How MedFind Works</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Find the right healthcare in three simple steps — no more unnecessary trips or wasted time.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Navigation2,
                title: 'Share Your Location',
                description: 'Enable GPS or manually select your province, district, and sector to find facilities near you.',
                step: '01',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: Search,
                title: 'Filter & Search',
                description: 'Search by medical service (e.g., maternity, lab) or filter by your insurance scheme (RAMA, Mutuelle, etc.).',
                step: '02',
                color: 'from-[var(--med-primary)] to-[var(--med-deep)]',
              },
              {
                icon: Calendar,
                title: 'View & Book',
                description: 'See full facility details, check accepted insurances, view on the map, and book your appointment directly.',
                step: '03',
                color: 'from-emerald-500 to-emerald-600',
              },
            ].map((item) => (
              <div key={item.step} className="relative group">
                <div className="bg-[var(--med-surface)] rounded-2xl p-8 border border-[rgba(76,118,59,0.08)] hover:border-[var(--med-primary)]/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-4xl font-black text-[var(--med-accent)]/20">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--med-deep)] mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-[15px]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARTNER STRIP ─────────────────────────────────── */}
      {partnerFacilities.length > 0 && (
        <section id="partners" className="py-14 bg-[var(--med-surface)] border-b border-[rgba(76,118,59,0.05)]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[var(--med-primary)] font-semibold text-sm uppercase tracking-wider mb-1">Trusted Network</p>
                <h2 className="text-2xl font-bold text-[var(--med-deep)]">Our Partner Facilities</h2>
              </div>
              <a href="#search">
                <Button variant="outline" size="sm" className="text-sm">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {partnerFacilities.slice(0, 6).map((f: Facility) => (
                <Link key={f.id} href={`/facilities/${f.id}`} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden border border-[rgba(76,118,59,0.08)] hover:border-[var(--med-primary)]/20 transition-all duration-300 hover:shadow-lg">
                    <div className="h-40 bg-gradient-to-br from-[var(--med-primary)]/10 to-[var(--med-accent)]/20 relative overflow-hidden">
                      {f.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={f.imageUrl} alt={f.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Activity className="w-12 h-12 text-[var(--med-primary)]/20" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 bg-[var(--med-primary)] text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-lg">
                          <Star className="w-3 h-3" /> Partner
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-[var(--med-deep)] group-hover:text-[var(--med-primary)] transition-colors text-lg">{f.name}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{f.location?.district}, {f.location?.province}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                        <span className="capitalize bg-gray-100 px-2 py-0.5 rounded font-medium">{f.type.replace('_', ' ')}</span>
                        {f.insurances && f.insurances.length > 0 && (
                          <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded font-medium">{f.insurances.length} insurances</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── SEARCH & RESULTS ──────────────────────────────── */}
      <section id="search" className="py-16 flex-1">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-[var(--med-primary)] font-semibold text-sm uppercase tracking-wider mb-2">Facility Locator</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--med-deep)] tracking-tight">Search Healthcare Facilities</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Find the nearest hospital, clinic, or health center that meets your needs.</p>
          </div>

          {/* Filters */}
          <FacilityFilters
            filters={filters}
            onChange={handleFilterChange}
            onSearch={handleSearch}
          />

          {/* Results Header */}
          <div className="flex items-center justify-between mt-10 mb-6">
            <h3 className="text-xl font-bold text-[var(--med-deep)]">
              {isLoading ? 'Searching...' : `${data?.pagination?.total || 0} Facilities Found`}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMap(!showMap)}
              className="hidden md:flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
          </div>

          {/* Results Grid + Map */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-[rgba(76,118,59,0.08)] overflow-hidden animate-pulse">
                  <div className="h-44 bg-gray-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-100 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="h-4 bg-gray-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.facilities?.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium text-lg">No facilities found matching your criteria.</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search a different location.</p>
              <Button variant="outline" className="mt-6" onClick={() => setFilters({ sort: 'name', limit: 50 })}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className={`flex gap-6 ${showMap ? '' : ''}`}>
              {/* Cards */}
              <div className={`${showMap ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
                <div className={`grid ${showMap ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-5`}>
                  {data?.facilities.map((facility: Facility) => (
                    <div
                      key={facility.id}
                      onMouseEnter={() => setSelectedFacilityId(facility.id)}
                      onMouseLeave={() => setSelectedFacilityId(null)}
                    >
                      <FacilityCard facility={facility} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Panel */}
              {showMap && data?.facilities && (
                <div className="w-1/2 sticky top-20 h-[calc(100vh-6rem)]">
                  <FacilityMap
                    facilities={data.facilities}
                    selectedId={selectedFacilityId}
                    className="h-full w-full rounded-2xl border border-[rgba(76,118,59,0.1)] shadow-sm"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
