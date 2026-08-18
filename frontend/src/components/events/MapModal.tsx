import * as L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { useEffect, type ReactElement } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { X } from "lucide-react";

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MAP_ZOOM = 15;

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  address: string;
}

export function MapModal({
  isOpen,
  onClose,
  latitude,
  longitude,
  address,
}: MapModalProps): ReactElement | null {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={address}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <h2 className="min-w-0 truncate text-lg font-semibold text-zinc-900">
            {address}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close map"
            className="shrink-0 rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-72 w-full sm:h-80">
          <MapContainer
            center={[latitude, longitude]}
            zoom={MAP_ZOOM}
            className="h-full w-full"
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[latitude, longitude]} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
