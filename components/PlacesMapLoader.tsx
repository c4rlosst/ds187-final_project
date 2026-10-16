"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window` on import, so the map must only load in the browser.
const PlacesMap = dynamic(() => import("./PlacesMap"), {
  ssr: false,
  loading: () => <p className="p-4">Loading map...</p>,
});

export default PlacesMap;
