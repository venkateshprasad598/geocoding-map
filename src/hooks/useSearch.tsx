import { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { searchLocation } from '../services/geocoding';
import type { Location } from '../types/location';

interface SearchOption {
  value: string;
  label: React.ReactNode;
  data: any;
}

interface GroupedOptions {
  label: string;
  options: SearchOption[];
}

export function useSearch(locations: Location[]) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<GroupedOptions[]>([]);

  const createSearchResults = (results: any[]): SearchOption[] => {
    return results.map(result => ({
      value: `search-${result.place_id}`,
      label: (
        <div>
          <div className="font-medium">{result.display_name}</div>
          <div className="text-xs text-gray-500">
            {result.lat}, {result.lon}
          </div>
        </div>
      ),
      data: result,
    }));
  };

  const createSavedLocationOptions = (locations: Location[]): SearchOption[] => {
    return locations.map(location => ({
      value: location.id,
      label: (
        <div>
          <div className="font-medium">{location.title}</div>
          <div className="text-xs text-gray-500">
            {location.address?.street && `${location.address.street}, `}
            {location.address?.city || ''}
          </div>
        </div>
      ),
      data: location,
    }));
  };

  const handleSearch = useCallback(
    debounce(async (value: string) => {
      if (!value) {
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        const results = await searchLocation(value);
        
        setOptions([
          {
            label: 'Search Results',
            options: createSearchResults(results),
          },
          {
            label: 'Saved Locations',
            options: createSavedLocationOptions(locations),
          },
        ]);
      } catch (error) {
        console.error('Search failed:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    [locations]
  );

  return {
    loading,
    options,
    handleSearch,
  };
}