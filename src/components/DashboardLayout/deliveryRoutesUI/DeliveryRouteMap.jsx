"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

export default function DeliveryRouteMap({ coordinates }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current || !coordinates?.lat || !coordinates?.lng) {
      return undefined;
    }

    const mapTilerKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

    if (!mapTilerKey) {
      return undefined;
    }

    const styleUrl = `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapTilerKey}`;

    if (mapRef.current) {
      mapRef.current.remove();
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [coordinates.lng, coordinates.lat],
      zoom: 13,
      attributionControl: true,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", () => {
      new maplibregl.Marker({ color: "#d9463f" })
        .setLngLat([coordinates.lng, coordinates.lat])
        .addTo(map);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [coordinates?.lat, coordinates?.lng]);

  return <div ref={mapContainerRef} className="h-72 w-full overflow-hidden rounded-xl border bg-slate-100" />;
}