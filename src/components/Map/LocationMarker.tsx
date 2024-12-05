import { Marker, Popup } from "react-leaflet";
import { format } from "date-fns";
import type { Location } from "../../types/location";
import L from "leaflet";

interface LocationMarkerProps {
  location: Location;
  onClick?: () => void;
  isNew?: boolean;
}

const blueMarkerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png", // Blue marker icon
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const redMarkerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png", // Red marker icon
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export function LocationMarker({
  location,
  onClick,
  isNew,
}: LocationMarkerProps) {
  return (
    <Marker
      position={location?.coordinates}
      eventHandlers={{
        click: onClick,
      }}
      icon={isNew ? redMarkerIcon : blueMarkerIcon}
    >
      <Popup>
        <div className="min-w-[200px]">
          <h3 className="text-lg font-semibold mb-2">{location?.title}</h3>
          {location?.date && (
            <p className="text-sm text-gray-600 mb-2">
              {format(new Date(location?.date), "PPP")}
            </p>
          )}
          <p className="text-sm">{location?.description || null}</p>
          <div className="text-xs text-gray-500 mt-2">
            Coordinates: {location?.coordinates?.[0]?.toFixed(6)},{" "}
            {location?.coordinates?.[1]?.toFixed(6)}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
