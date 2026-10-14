"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Leaflet's default icon URLs break under bundlers, so the marker images are
// copied into public/leaflet and referenced explicitly.
const defaultIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export type MapMarker = {
  id: string | number;
  position: [number, number];
  label?: string;
};

type MapViewProps = {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
};

// Placeholder center until the real service area is decided.
const DEFAULT_CENTER: [number, number] = [14.5995, 120.9842];

export default function MapView({
  center = DEFAULT_CENTER,
  zoom = 12,
  markers = [{ id: "default", position: DEFAULT_CENTER, label: "Hello" }],
}: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((m) => (
        <Marker key={m.id} position={m.position} icon={defaultIcon}>
          {m.label && <Popup>{m.label}</Popup>}
        </Marker>
      ))}
    </MapContainer>
  );
}
