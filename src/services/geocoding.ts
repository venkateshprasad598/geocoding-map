import axios from 'axios';
import type { GeocodingResult } from '../types/location';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

export async function reverseGeocode(lat: number, lon: number): Promise<GeocodingResult> {
  const response = await axios.get(`${NOMINATIM_BASE_URL}/reverse`, {
    params: {
      lat,
      lon,
      format: 'json',
      addressdetails: 1,
    },
    headers: {
      'User-Agent': 'PoliceLocationTracker/1.0',
    },
  });
  return response;
}

export async function searchLocation(query: string): Promise<GeocodingResult[]> {
  const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
    params: {
      q: query,
      format: 'json',
      addressdetails: 1,
      limit: 5,
    },
    headers: {
      'User-Agent': 'PoliceLocationTracker/1.0',
    },
  });
  return response.data;
}