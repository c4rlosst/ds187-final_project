"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { Place } from "@/lib/types";

// Leaflet's default icon URLs break under bundlers, so the marker images are
// copied into public/leaflet and referenced explicitly.
const markerIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export type FlyTarget = { lat: number; lng: number };

type PlacesMapProps = {
  places: Place[];
  center: [number, number];
  zoom?: number;
  /** When true, clicking the map chooses the location of a new place. */
  picking: boolean;
  draft: [number, number] | null;
  onPick: (lat: number, lng: number) => void;
  flyTo: FlyTarget | null;
};

function ClickToPick({
  picking,
  onPick,
}: {
  picking: boolean;
  onPick: (lat: number, lng: number) => void;
}) {
  const map = useMapEvents({
    click(e) {
      if (!picking) return;
      // Keep longitude within -180..180 when the map is panned across the date line.
      const { lat, lng } = e.latlng.wrap();
      onPick(lat, lng);
    },
  });

  // MapContainer freezes its className after the first render, so toggle the
  // crosshair cursor class on the map element directly.
  useEffect(() => {
    map.getContainer().classList.toggle("picking-mode", picking);
  }, [map, picking]);

  return null;
}

function FlyToTarget({ target }: { target: FlyTarget | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 15));
  }, [target, map]);
  return null;
}

export default function PlacesMap({
  places,
  center,
  zoom = 12,
  picking,
  draft,
  onPick,
  flyTo,
}: PlacesMapProps) {
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
      <ClickToPick picking={picking} onPick={onPick} />
      <FlyToTarget target={flyTo} />

      {places.map((place) => (
        <Marker key={place.id} position={[place.lat, place.lng]} icon={markerIcon}>
          <Popup>
            <strong>{place.name}</strong>
            <br />
            <span className="capitalize">{place.category}</span>
            {place.description && (
              <>
                <br />
                {place.description}
              </>
            )}
            {place.address && (
              <>
                <br />
                {place.address}
              </>
            )}
          </Popup>
        </Marker>
      ))}

      {draft && (
        <Marker
          position={draft}
          icon={markerIcon}
          opacity={0.7}
          draggable
          eventHandlers={{
            dragend(e) {
              const { lat, lng } = (e.target as L.Marker).getLatLng().wrap();
              onPick(lat, lng);
            },
          }}
        />
      )}
    </MapContainer>
  );
}
