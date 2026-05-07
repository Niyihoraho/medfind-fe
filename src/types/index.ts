// ─── MEDFIND TYPE DEFINITIONS ────────────────────────────────────
// Shared TypeScript interfaces matching the Prisma schema.
// Used across all frontend components, hooks, and API calls.

// ─── GEOGRAPHY ───────────────────────────────────────────────────

export interface Province {
  id: number;
  name: string;
  nameRw: string | null;
}

export interface District {
  id: number;
  name: string;
  nameRw: string | null;
  provinceId: number;
  province?: Province;
}

export interface Sector {
  id: number;
  name: string;
  nameRw: string | null;
  districtId: number;
  district?: District;
}

export interface Cell {
  id: number;
  name: string;
  nameRw: string | null;
  sectorId: number;
  sector?: Sector;
}

export interface Village {
  id: number;
  name: string;
  nameRw: string | null;
  cellId: number;
  cell?: Cell;
}

export interface PlaceCenter {
  id: number;
  placeType: 'province' | 'district' | 'sector';
  placeId: number;
  centerLat: number;
  centerLng: number;
}

// ─── CORE ────────────────────────────────────────────────────────

export type FacilityType = 'hospital' | 'health_center' | 'clinic' | 'dispensary' | 'polyclinic';
export type OwnershipType = 'public' | 'private' | 'ngo';

export interface Organization {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  ownershipType: OwnershipType;
  createdAt: string | null;
  updatedAt: string | null;
  _count?: {
    facilities: number;
  };
}

export interface Facility {
  id: number;
  name: string;
  type: FacilityType;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  sectorId: number;
  cellId: number | null;
  villageId: number | null;
  phone: string | null;
  email: string | null;
  openingHours: Record<string, string> | null;
  isVerified: boolean;
  isPartner: boolean;
  imageUrl?: string | null;
  category: OwnershipType;
  organizationId: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  // Relations (populated when included)
  sector?: Sector & { district: District & { province: Province } };
  services?: FacilityServiceEntry[];
  insurances?: FacilityInsuranceEntry[];
  admins?: FacilityAdminEntry[];
  organization?: Organization;
  // Computed fields from API
  distance?: number | null;
  location?: {
    sector: string;
    district: string;
    province: string;
  };
}

export type UserRole = 'patient' | 'facility_admin' | 'super_admin';
export type Language = 'en' | 'rw' | 'fr';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  preferredLanguage: Language;
  createdAt: string | null;
}

// ─── LOOKUP ──────────────────────────────────────────────────────

export interface Service {
  id: number;
  name: string;
  category: string | null;
  description: string | null;
}

export type InsuranceType = 'public' | 'private' | 'international';

export interface InsuranceScheme {
  id: number;
  name: string;
  type: InsuranceType;
  description: string | null;
}

// ─── JUNCTION ────────────────────────────────────────────────────

export interface FacilityServiceEntry {
  id: number;
  facilityId: number;
  serviceId: number;
  isAvailable: boolean;
  service?: Service;
}

export interface FacilityInsuranceEntry {
  id: number;
  facilityId: number;
  insuranceId: number;
  insurance?: InsuranceScheme;
}

// ─── FEATURES ────────────────────────────────────────────────────

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: number;
  userId: number;
  facilityId: number;
  serviceName: string | null;
  appointmentDate: string;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  user?: Pick<User, 'id' | 'fullName' | 'email'>;
  facility?: Pick<Facility, 'id' | 'name' | 'type' | 'phone'>;
}

export type FacilityAdminRole = 'owner' | 'editor';

export interface FacilityAdminEntry {
  id: number;
  facilityId: number;
  userId: number;
  role: FacilityAdminRole;
  assignedAt: string;
  user?: Pick<User, 'id' | 'fullName' | 'email' | 'role'>;
}

// ─── API RESPONSE ────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ApiError {
  success: false;
  error: string;
  code: number;
  details?: Array<{ field: string; message: string }>;
}

export interface PaginatedResult<T> {
  facilities: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── AUTH ─────────────────────────────────────────────────────────

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
  preferred_language?: Language;
}

// ─── FACILITY SEARCH ─────────────────────────────────────────────

export interface FacilitySearchParams {
  lat?: number;
  lng?: number;
  radius?: number;
  sector_id?: number;
  district_id?: number;
  province_id?: number;
  service_id?: number;
  insurance_id?: number;
  type?: FacilityType;
  verified?: number;
  search?: string;
  sort?: 'distance' | 'name';
  page?: number;
  limit?: number;
}
