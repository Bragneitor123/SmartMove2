"use client";

import { useEffect, useRef } from "react";

export default function MapCDN() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (typeof window === "undefined") return;

    // Esperar a que el JS del CDN esté cargado
    const sdk = (window as any).maptilersdk;
    if (!sdk) {
      console.error("MapTiler SDK not loaded");
      return;
    }

    sdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;

    const map = new sdk.Map({
      container: mapRef.current,
      style: sdk.MapStyle.STREETS,
      center: [-86.8515, 21.1619], // Cancún
      zoom: 13,
    });

  }, []);

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
