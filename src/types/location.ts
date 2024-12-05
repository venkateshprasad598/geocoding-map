export interface Location {
  id: string;
  title: string;
  description: string;
  date: string;
  coordinates: [number, number];
  createdAt: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

export interface LocationFormData {
  title: string;
  description: string;
  date: string;
  address?: Location['address'];
}

export interface GeocodingResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  boundingbox: string[];
}