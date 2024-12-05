import { useState, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { Modal } from "antd";
import { v4 as uuidv4 } from "uuid";
import { LocationMarker } from "./LocationMarker";
import { LocationForm } from "./LocationForm";
import { LocationDetails } from "./LocationDetails";
import { SearchBox } from "../Search/SearchBox";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { reverseGeocode } from "../../services/geocoding";
import type { Location, LocationFormData } from "../../types/location";

import "leaflet/dist/leaflet.css";

function MapEvents({
  onLocationClick,
}: {
  onLocationClick: (coords: [number, number]) => void;
}) {
  useMapEvents({
    click: (e) => {
      onLocationClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export function InteractiveMap() {
  const [locations, setLocations] = useLocalStorage<Location[]>(
    "police-app-locations",
    []
  );
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(
    null
  );
  const [selectedLocation, setSelectedLocation] = useState<
    Location | undefined
  >();
  const [locationPreview, setLocationPreview] = useState<
    Location | undefined
  >();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [map, setMap] = useState<L.Map | null>(null);

  const handleMapClick = useCallback(async (coords: [number, number]) => {
    setSelectedCoords(coords);
    try {
      const geocodeResult: any = await reverseGeocode(coords[0], coords[1]);
      if (geocodeResult?.status == 200) {
        setLocationPreview(geocodeResult?.data || {});
      } else {
        setLocationPreview(undefined);
      }
      console.log("Geocoding result:", geocodeResult);
    } catch (error) {
      console.error("Geocoding failed:", error);
      setLocationPreview(undefined);
    } finally {
      setSelectedLocation(undefined);
    }
  }, []);

  const handleSearchSelect = useCallback(
    (locationId: string) => {
      const location = locations.find((loc) => loc.id === locationId);
      // if (location && map) {
      setSelectedLocation(location);
      setSelectedCoords(location?.coordinates);
      map.setView(location?.coordinates, 15);
      // }
    },
    [locations, map]
  );

  const handleSearchResultSelect = useCallback(
    (lat: number, lon: number) => {
      // if (map) {
      const coords: [number, number] = [lat, lon];
      setSelectedCoords(coords);
      setSelectedLocation(undefined);
      map.setView(coords, 15);
      // }
    },
    [map]
  );

  const handleFormSubmit = async (formData: LocationFormData) => {
    if (selectedCoords) {
      try {
        const geocodeResult = await reverseGeocode(
          selectedCoords[0],
          selectedCoords[1]
        );
        const address = {
          street: geocodeResult?.address?.road,
          city: geocodeResult?.address?.city,
          state: geocodeResult?.address?.state,
          country: geocodeResult?.address?.country,
          postcode: geocodeResult?.address?.postcode,
        };

        const newLocation: Location = {
          id: uuidv4(),
          ...formData,
          coordinates: selectedCoords,
          createdAt: new Date().toISOString(),
          address,
        };

        setLocations([...locations, newLocation]);
        setIsModalVisible(false);
        setSelectedLocation(newLocation);
      } catch (error) {
        console.error("Failed to get address details:", error);
      }
    }
  };

  const handleAddLocation = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Fix Leaflet icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
    }
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] w-full relative">
      <SearchBox
        locations={locations}
        onSelect={handleSearchSelect}
        onSearchResultSelect={handleSearchResultSelect}
      />

      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="h-full w-full"
        whenCreated={(mapInstance: any) => {
          setMap(mapInstance);
          console.log("Map instance set:", mapInstance);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onLocationClick={handleMapClick} />
        {locations.map((location) => (
          <LocationMarker
            key={location.id}
            location={location}
            isNew={false}
            onClick={() => {
              // setSelectedLocation(location);
              // setSelectedCoords(location.coordinates);
            }}
          />
        ))}
        {selectedCoords && (
          <>
            <LocationMarker
              location={{
                id: "new-location",
                coordinates: selectedCoords,
                name: "New Location",
              }} // Create a temporary location object for the new pin
              onClick={() => {}}
              isNew={true} // This marker is new
            />

            <LocationDetails
              location={selectedLocation}
              coordinates={selectedCoords}
              onAddLocation={handleAddLocation}
              locationPreview={locationPreview}
            />
          </>
        )}
      </MapContainer>

      <Modal
        title="Add Location Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <LocationForm
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalVisible(false)}
        />
      </Modal>
    </div>
  );
}
