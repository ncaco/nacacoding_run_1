"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

type Props = {
  lat?: number;
  lng?: number;
  address?: string; // 주소로 좌표를 자동 조회
  zoom?: number;
  label?: string;
};

type LeafletIcon = any;

export default function LeafletMap({ lat, lng, address, zoom = 16, label = "웨딩홀" }: Props) {
  const [pos, setPos] = useState<[number, number] | null>(lat !== undefined && lng !== undefined ? [lat, lng] : null);
  const [icon, setIcon] = useState<LeafletIcon | null>(null);

  useEffect(() => {
    // 동적 import로 SSR 시 'window is not defined' 회피
    let cancelled = false;
    (async () => {
      if (typeof window === "undefined") return;
      const L = (await import("leaflet")).default;
      if (cancelled) return;
      const created = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      setIcon(created as LeafletIcon);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (pos || !address) return;
    const controller = new AbortController();
    const fetchGeocode = async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=kr&limit=1&q=${encodeURIComponent(address)}`;
        const res = await fetch(url, {
          headers: { "Accept": "application/json", "User-Agent": "wedding-invite-app/1.0" },
          signal: controller.signal,
        });
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const { lat: y, lon: x } = data[0];
          const yy = parseFloat(y);
          const xx = parseFloat(x);
          if (!Number.isNaN(yy) && !Number.isNaN(xx)) setPos([yy, xx]);
        }
      } catch {}
    };
    fetchGeocode();
    return () => controller.abort();
  }, [address, pos]);

  const position: [number, number] = (pos ?? [37.5665, 126.9780]); // fallback: 서울 시청

  return (
    <div className="mt-3 sm:mt-4 w-full overflow-hidden rounded-xl border border-[#f5d7df]">
      <MapContainer center={position as [number, number]} zoom={zoom} style={{ height: "360px", width: "100%" }} scrollWheelZoom={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {pos && icon && (
          <Marker position={position as [number, number]} icon={icon as any}>
            <Popup>{label}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}


