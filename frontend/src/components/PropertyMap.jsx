import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import { useEffect, useRef } from "react";

import "leaflet/dist/leaflet.css";

// ==============================
// FIX MARKER ICON
// ==============================
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ==============================
// MAP FOCUS COMPONENT
// ==============================
function ChangeMapView({ selectedProperty }) {

  const map = useMap();

  useEffect(() => {

    if (
      selectedProperty?.location?.lat &&
      selectedProperty?.location?.lng
    ) {

      map.setView(
        [
          Number(selectedProperty.location.lat),
          Number(selectedProperty.location.lng),
        ],
        15
      );
    }

  }, [selectedProperty, map]);

  return null;
}
function PropertyMarker({
  property,
  selectedProperty,
}) {

  const markerRef = useRef(null);

  const lat = Number(
    property?.location?.lat
  );

  const lng = Number(
    property?.location?.lng
  );

  useEffect(() => {

    if (
      selectedProperty?._id === property._id &&
      markerRef.current
    ) {

      markerRef.current.openPopup();
    }

  }, [selectedProperty, property]);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return null;
  }

  const cleanPath =
    property?.photos?.[0]?.replace(
      /^\/api/,
      ""
    );

  const imageUrl = cleanPath
    ? `${import.meta.env.VITE_API_URL}${cleanPath}`
    : "https://via.placeholder.com/200x120";

  return (
    <Marker
      ref={markerRef}

      position={[lat, lng]}
    >

      <Popup>

        <div className="w-52">

          <img
            src={imageUrl}

            alt={property?.property?.title}

            className="w-full h-28 object-cover rounded mb-2"
          />

          <h3 className="font-semibold text-sm">
            {property?.property?.title}
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            {property?.location?.address}
          </p>

        </div>

      </Popup>

    </Marker>
  );
}
// ==============================
// MAIN COMPONENT
// ==============================
const PropertyMap = ({
  properties,
  selectedProperty,
}) => {

  const defaultCenter = [
    30.3831,
    -86.4974,
  ];

  return (
    <MapContainer
      center={defaultCenter}

      zoom={11}

      style={{
        width: "100%",
        height: "100%",
      }}

      className="rounded-xl z-0"
    >

      {/* MAP TILE */}
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'

        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* AUTO FOCUS */}
      <ChangeMapView
        selectedProperty={selectedProperty}
      />

      {/* MARKERS */}
    {properties.map((property) => (

  <PropertyMarker
    key={property._id}

    property={property}

    selectedProperty={selectedProperty}
  />
))}

    </MapContainer>
  );
};

export default PropertyMap;