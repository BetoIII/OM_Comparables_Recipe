// TypeScript interfaces for Comparables data based on simplified schema

export interface BasicInfo {
  property_type: string; // Required: Multifamily, Office, Retail, etc.
  total_units?: number | null;
  total_square_feet?: number | null;
  year_built?: number | null;
}

export interface UnitDetail {
  unit_type: string; // Required: Studio, 1BR/1BA, etc.
  square_feet?: number | null;
  rent?: string | null; // Simple string: "$1,500/month", "$25/sf/year", etc.
}

export interface ComparableProperty {
  property_name: string;
  full_address: string; // Simplified: single string instead of nested object
  basic_info: BasicInfo;
  units_detail?: UnitDetail[];
  notes?: string | null; // Can include amenities, occupancy, distance, etc.
  source_document: string;
}

export interface ComparablesData {
  comparable_properties: ComparableProperty[];
  summary: {
    total_properties: number;
    documents_processed: string[];
  };
}

// Comp Set related types
export interface CompSetProperty extends ComparableProperty {
  property_id?: string; // Added when saved to comp set
  dataNotFound?: boolean; // Flag for missing enrichment data
}

export interface CompSet {
  name: string;
  properties: CompSetProperty[];
  created_at?: string;
  updated_at?: string;
}

export interface CompSetListItem {
  name: string;
  property_count: number;
  created_at?: string;
  updated_at?: string;
}

// API Response types
export interface SaveCompSetRequest {
  compSetName: string;
  propertyIds: string[];
  properties: ComparableProperty[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
