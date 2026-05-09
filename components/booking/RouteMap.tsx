"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

// Fix Leaflet icon paths in Next.js
const icon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><path fill="#0A2540" stroke="#fff" stroke-width="2" d="M16 1c-7.732 0-14 6.268-14 14 0 11 14 24 14 24s14-13 14-24c0-7.732-6.268-14-14-14z"/><circle fill="#C9A961" cx="16" cy="15" r="6"/></svg>`),
  iconSize: [28, 36], iconAnchor: [14, 36], popupAnchor: [0, -32],
});

const fromIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><path fill="#16a34a" stroke="#fff" stroke-width="2" d="M16 1c-7.732 0-14 6.268-14 14 0 11 14 24 14 24s14-13 14-24c0-7.732-6.268-14-14-14z"/><circle fill="#fff" cx="16" cy="15" r="6"/></svg>`),
  iconSize: [32, 40], iconAnchor: [16, 40], popupAnchor: [0, -36],
});

const toIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><path fill="#C9A961" stroke="#fff" stroke-width="2" d="M16 1c-7.732 0-14 6.268-14 14 0 11 14 24 14 24s14-13 14-24c0-7.732-6.268-14-14-14z"/><circle fill="#0A2540" cx="16" cy="15" r="6"/></svg>`),
  iconSize: [32, 40], iconAnchor: [16, 40], popupAnchor: [0, -36],
});

export type LocPoint = { id: string; name: string; nameEn: string; lat: number; lng: number };

export function RouteMap({
  locations,
  fromId,
  toId,
  onSelect,
  locale = "mn",
}: {
  locations: LocPoint[];
  fromId?: string;
  toId?: string;
  onSelect: (id: string) => void;
  locale?: "mn" | "en";
}) {
  const fromLoc = locations.find((l) => l.id === fromId);
  const toLoc = locations.find((l) => l.id === toId);

  return (
    <MapContainer
      center={[46.8625, 103.8467]}
      zoom={5}
      scrollWheelZoom
      style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((l) => {
        const isFrom = l.id === fromId;
        const isTo = l.id === toId;
        return (
          <Marker
            key={l.id}
            position={[l.lat, l.lng]}
            icon={isFrom ? fromIcon : isTo ? toIcon : icon}
            eventHandlers={{ click: () => onSelect(l.id) }}
          >
            <Popup>
              <div className="font-semibold">{locale === "mn" ? l.name : l.nameEn}</div>
              {isFrom && <div className="text-xs text-emerald-600">Хөдлөх</div>}
              {isTo && <div className="text-xs text-amber-600">Хүрэх</div>}
            </Popup>
          </Marker>
        );
      })}
      {fromLoc && toLoc && (
        <Polyline positions={[[fromLoc.lat, fromLoc.lng], [toLoc.lat, toLoc.lng]]} pathOptions={{ color: "#C9A961", weight: 3, dashArray: "8 8" }} />
      )}
      {fromLoc && toLoc && <FitBounds points={[[fromLoc.lat, fromLoc.lng], [toLoc.lat, toLoc.lng]]} />}
    </MapContainer>
  );
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length >= 2) {
      const b = L.latLngBounds(points);
      map.fitBounds(b, { padding: [60, 60] });
    }
  }, [points, map]);
  return null;
}
