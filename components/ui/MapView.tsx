"use client";

import { useEffect, useRef, useState } from "react";

const CANCUN_CENTER: [number, number] = [21.1619, -86.8515];

type MapViewProps = {
  originText?: string;
  destinationText?: string;
};

export default function MapView({ originText, destinationText }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const LRef = useRef<any>(null);

  const originMarkerRef = useRef<any>(null);
  const destMarkerRef = useRef<any>(null);
  const routeLineRef = useRef<any>(null);

  const originCoordsRef = useRef<[number, number] | null>(null);
  const destCoordsRef = useRef<[number, number] | null>(null);

  // NUEVO: bandera para saber cuándo el mapa está listo
  const [mapReady, setMapReady] = useState(false);

  // 1) Inicializar el mapa solo una vez
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (!mapContainerRef.current || mapRef.current) return;

      const L = await import("leaflet");
      await import("leaflet-defaulticon-compatibility");

      LRef.current = L;
      const container = mapContainerRef.current as any;

      // por si queda un mapa anterior pegado al div
      if (container._leaflet_id) {
        container._leaflet_id = null;
        container.innerHTML = "";
      }

      const map = L.map(container, {
        center: CANCUN_CENTER,
        zoom: 13,
      });

      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      // marcador base en Cancún
      L.marker(CANCUN_CENTER)
        .addTo(map)
        .bindPopup("Centro de Cancún");

      // ajustar tamaño inicial
      setTimeout(() => {
        if (cancelled || !mapRef.current) return;
        mapRef.current.invalidateSize();
      }, 200);

      // ⚠️ IMPORTANTE: marcar el mapa como listo
      setMapReady(true);
    };

    init();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      originMarkerRef.current = null;
      destMarkerRef.current = null;
      routeLineRef.current = null;
    };
  }, []);

  // 2) Cuando haya mapa listo + origen/destino, geocodificar y trazar ruta
  useEffect(() => {
    if (!mapReady) return; // esperar a que el mapa esté listo

    const map = mapRef.current;
    const L = LRef.current;
    if (!map || !L) return;

    if (!originText && !destinationText) return;

    const controller = new AbortController();

    const geocodePlace = async (
      query: string
    ): Promise<[number, number] | null> => {
      if (!query.trim()) return null;

      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        query
      )}`;

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "Accept-Language": "es",
        },
      });

      const data = await res.json();
      if (!data[0]) {
        console.log("No se encontró ubicación para:", query);
        return null;
      }

      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      return [lat, lon];
    };

    const updateRoute = async () => {
      // 1. Origen
      if (originText && originText.trim()) {
        const coords = await geocodePlace(originText);
        if (coords) {
          originCoordsRef.current = coords;

          if (originMarkerRef.current) {
            map.removeLayer(originMarkerRef.current);
          }

          originMarkerRef.current = L.marker(coords)
            .addTo(map)
            .bindPopup(`Origen: ${originText}`);
        }
      }

      // 2. Destino
      if (destinationText && destinationText.trim()) {
        const coords = await geocodePlace(destinationText);
        if (coords) {
          destCoordsRef.current = coords;

          if (destMarkerRef.current) {
            map.removeLayer(destMarkerRef.current);
          }

          destMarkerRef.current = L.marker(coords)
            .addTo(map)
            .bindPopup(`Destino: ${destinationText}`);
        }
      }

      const originCoords = originCoordsRef.current;
      const destCoords = destCoordsRef.current;

      // 3. Ruta solo si tenemos ambos
      if (originCoords && destCoords) {
        const [olat, olon] = originCoords;
        const [dlat, dlon] = destCoords;

        try {
          const url = `https://router.project-osrm.org/route/v1/driving/${olon},${olat};${dlon},${dlat}?overview=full&geometries=geojson`;
          const res = await fetch(url, { signal: controller.signal });
          const data = await res.json();

          if (data.routes && data.routes[0]) {
            const coordinates = data.routes[0].geometry.coordinates.map(
              ([lon, lat]: [number, number]) => [lat, lon]
            );

            if (routeLineRef.current) {
              map.removeLayer(routeLineRef.current);
            }

            routeLineRef.current = L.polyline(coordinates, {
              color: "#1D64F2",
              weight: 4,
            }).addTo(map);

            map.fitBounds(routeLineRef.current.getBounds(), {
              padding: [40, 40],
            });
          } else {
            console.log("No se encontró ruta para esos puntos");
          }
        } catch (err) {
          if ((err as any).name === "AbortError") return;
          console.error("Error obteniendo ruta OSRM:", err);
        }
      } else {
        // si solo tenemos uno, centramos ahí
        const onlyCoords = originCoords || destCoords;
        if (onlyCoords) {
          map.setView(onlyCoords, 14);
        }
      }
    };

    updateRoute();

    return () => {
      controller.abort();
    };
  }, [mapReady, originText, destinationText]);

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
