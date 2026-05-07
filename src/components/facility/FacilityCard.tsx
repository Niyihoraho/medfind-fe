import type { Facility } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MapPin, Phone, Building2, Star, Shield } from 'lucide-react';
import { resolveImageUrl } from '@/lib/utils';
import Link from 'next/link';

export function FacilityCard({ facility }: { facility: Facility }) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[var(--med-primary)]/20 hover:-translate-y-0.5 group bg-white border-[rgba(76,118,59,0.08)] rounded-2xl">
      {/* Image Header */}
      <div className="h-44 bg-gradient-to-br from-[var(--med-primary)]/5 to-[var(--med-accent)]/10 relative overflow-hidden">
        {facility.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={resolveImageUrl(facility.imageUrl) || ''} 
            alt={facility.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--med-surface)] to-[var(--med-accent-light)]/30">
            <Building2 className="w-16 h-16 text-[var(--med-primary)]/10" />
          </div>
        )}
        
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {facility.isPartner && (
            <span className="inline-flex items-center gap-1 bg-[var(--med-primary)] text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-lg">
              <Star className="w-3 h-3" /> Partner
            </span>
          )}
        </div>
        
        {/* Distance badge */}
        {facility.distance !== undefined && facility.distance !== null && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center bg-white/95 backdrop-blur-sm text-[var(--med-deep)] px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">
              {facility.distance} km
            </span>
          </div>
        )}

        {/* Type badge at bottom */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[10px] font-semibold capitalize">
            {facility.type.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-[17px] text-[var(--med-deep)] group-hover:text-[var(--med-primary)] transition-colors leading-snug mb-2 line-clamp-2">
          {facility.name}
        </h3>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-start gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
            <span className="line-clamp-1">
              {facility.location?.sector ? `${facility.location.sector}, ${facility.location.district}` : facility.address || 'Location not available'}
            </span>
          </div>
          {facility.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Phone className="w-4 h-4 shrink-0 text-gray-400" />
              <span>{facility.phone}</span>
            </div>
          )}
        </div>

        {/* Services */}
        <div className="flex gap-1.5 flex-wrap mb-4">
          {facility.services?.slice(0, 3).map((s) => (
            <span key={s.serviceId} className="text-[11px] font-medium bg-[var(--med-accent)]/15 text-[var(--med-deep)] px-2 py-0.5 rounded-md">
              {s.service?.name}
            </span>
          ))}
          {(facility.services?.length || 0) > 3 && (
            <span className="text-[11px] font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
              +{facility.services!.length - 3} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            {facility.insurances?.length ? `${facility.insurances.length} insurances` : 'No insurance data'}
          </div>
          <Link href={`/facilities/${facility.id}`}>
            <Button variant="outline" size="sm" className="text-xs rounded-lg hover:bg-[var(--med-primary)] hover:text-white hover:border-[var(--med-primary)] transition-all">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
