import { Button, Card, Descriptions } from "antd";
import { format } from "date-fns";
import { PlusCircle } from "lucide-react";
import type { Location } from "../../types/location";

interface LocationDetailsProps {
  location?: Location;
  coordinates: [number, number];
  onAddLocation: () => void;
  locationPreview?: any;
}

export function LocationDetails({
  location,
  coordinates,
  onAddLocation,
  locationPreview,
}: LocationDetailsProps) {
  return (
    <Card className="absolute bottom-4 right-4 z-[1000] w-96 shadow-lg">
      <div className="space-y-4">
        {location ? (
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Title">
              {location?.title}
            </Descriptions.Item>
            {location?.date && (
              <Descriptions.Item label="Date">
                {format(new Date(location?.date), "PPP")}
              </Descriptions.Item>
            )}
            {location?.address && (
              <>
                {location?.address?.street && (
                  <Descriptions.Item label="Street">
                    {location?.address?.street}
                  </Descriptions.Item>
                )}
                {location?.address?.city && (
                  <Descriptions.Item label="City">
                    {location?.address?.city}
                  </Descriptions.Item>
                )}
                {location?.address?.state && (
                  <Descriptions.Item label="State">
                    {location?.address?.state}
                  </Descriptions.Item>
                )}
                {location?.address?.postcode && (
                  <Descriptions.Item label="Postal Code">
                    {location?.address?.postcode}
                  </Descriptions.Item>
                )}
                {location?.address?.country && (
                  <Descriptions.Item label="Country">
                    {location?.address?.country}
                  </Descriptions.Item>
                )}
              </>
            )}
            <Descriptions.Item label="Description">
              {location?.description}
            </Descriptions.Item>
            <Descriptions.Item label="Coordinates">
              {coordinates?.[0]?.toFixed(6)}, {coordinates?.[1]?.toFixed(6)}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <div className="space-y-4">
            <div className="text-sm">
              {/* <div className="font-medium">Selected Location</div> */}
              <div className="text-gray-700 font-semibold">
                {locationPreview?.display_name}
              </div>
              <div className="text-gray-500">
                coordinates ( lat, lng ) : {coordinates?.[0]?.toFixed(6)},{" "}
                {coordinates?.[1]?.toFixed(6)}
              </div>
            </div>
            <Button
              type="primary"
              icon={<PlusCircle className="h-4 w-4" />}
              onClick={onAddLocation}
              className="w-full"
            >
              Add Location Details
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
