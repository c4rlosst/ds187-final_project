"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window` on import, so the map must only load in the browser.
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default MapView;
