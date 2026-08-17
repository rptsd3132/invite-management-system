import * as L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { Loader2, MapPin, Search } from "lucide-react";
import { Button } from "../ui/Button";

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const DEFAULT_CENTER: [number, number] = [6.9271, 79.8612];
const DEFAULT_ZOOM = 11;
const SEARCH_ZOOM = 15;
const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";
const NOMINATIM_HEADERS = {
  "User-Agent": "invite-management-system/1.0 (event organizer location picker)",
};
const MIN_REQUEST_INTERVAL_MS = 1000;

export interface VenueLocation {
  address: string;
  latitude: number;
  longitude: number;
}

interface LocationPickerProps {
  value?: VenueLocation | null;
  onChange: (location: VenueLocation) => void;
}

interface NominatimPlace {
  lat: string;
  lon: string;
  display_name: string;
}

let lastNominatimRequestAt = 0;
let pendingNominatimAbort: AbortController | null = null;

async function nominatimFetch(url: string): Promise<Response> {
  const elapsed = Date.now() - lastNominatimRequestAt;
  if (elapsed < MIN_REQUEST_INTERVAL_MS) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL_MS - elapsed),
    );
  }
  pendingNominatimAbort?.abort();
  lastNominatimRequestAt = Date.now();
  const controller = new AbortController();
  pendingNominatimAbort = controller;
  return fetch(url, { headers: NOMINATIM_HEADERS, signal: controller.signal });
}

function fallbackAddress(latitude: number, longitude: number): string {
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}

interface MapControllerProps {
  focus: VenueLocation | null;
  onSelect: (location: VenueLocation) => void;
}

function MapController({ focus, onSelect }: MapControllerProps): null {
  const map = useMap();
  const clickSequence = useRef(0);

  useEffect(() => {
    if (focus) {
      map.flyTo([focus.latitude, focus.longitude], SEARCH_ZOOM);
    }
  }, [map, focus]);

  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      const sequence = ++clickSequence.current;
      onSelect({
        address: fallbackAddress(lat, lng),
        latitude: lat,
        longitude: lng,
      });
      void nominatimFetch(
        `${NOMINATIM_BASE_URL}/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      )
        .then(async (response) => {
          if (!response.ok) throw new Error("Reverse geocoding failed");
          const data: { display_name?: string } = await response.json();
          if (sequence !== clickSequence.current) return;
          onSelect({
            address: data.display_name ?? fallbackAddress(lat, lng),
            latitude: lat,
            longitude: lng,
          });
        })
        .catch(() => {
          if (sequence !== clickSequence.current) return;
          onSelect({
            address: fallbackAddress(lat, lng),
            latitude: lat,
            longitude: lng,
          });
        });
    },
  });

  return null;
}

interface SearchBarProps {
  query: string;
  searching: boolean;
  error: string | null;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
}

function SearchBar({
  query,
  searching,
  error,
  onQueryChange,
  onSearch,
}: SearchBarProps): React.ReactElement {
  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
            placeholder="Search for a venue or address…"
            aria-label="Search for a venue or address"
            className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-10 pr-3.5 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm shadow-zinc-900/5 outline-none transition-all duration-200 ease-out focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
          />
        </div>
        <Button
          type="button"
          variant="default"
          onClick={onSearch}
          disabled={searching || query.trim().length === 0}
        >
          {searching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Search
        </Button>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

export function LocationPicker({
  value,
  onChange,
}: LocationPickerProps): React.ReactElement {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [marker, setMarker] = useState<VenueLocation | null>(value ?? null);
  const [focus, setFocus] = useState<VenueLocation | null>(null);

  const center: [number, number] = value
    ? [value.latitude, value.longitude]
    : DEFAULT_CENTER;

  const handleSelect = (location: VenueLocation): void => {
    setMarker(location);
    onChange(location);
  };

  const handleSearch = async (): Promise<void> => {
    const q = query.trim();
    if (q.length === 0 || searching) return;
    setSearching(true);
    setSearchError(null);
    try {
      const response = await nominatimFetch(
        `${NOMINATIM_BASE_URL}/search?format=json&limit=1&q=${encodeURIComponent(q)}`,
      );
      if (!response.ok) throw new Error("Search failed");
      const places = (await response.json()) as NominatimPlace[];
      const place = places[0];
      if (!place) {
        setSearchError(`No place found for "${q}".`);
        return;
      }
      const latitude = parseFloat(place.lat);
      const longitude = parseFloat(place.lon);
      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        setSearchError("The search returned invalid coordinates.");
        return;
      }
      const nextLocation = {
        address: place.display_name,
        latitude,
        longitude,
      };
      handleSelect(nextLocation);
      setFocus(nextLocation);
    } catch {
      setSearchError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-3">
      <SearchBar
        query={query}
        searching={searching}
        error={searchError}
        onQueryChange={setQuery}
        onSearch={() => void handleSearch()}
      />
      <div className="relative z-0 h-72 overflow-hidden rounded-xl border border-zinc-200 shadow-sm shadow-zinc-900/5">
        <MapContainer
          center={center}
          zoom={DEFAULT_ZOOM}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController focus={focus} onSelect={handleSelect} />
          {marker && (
            <Marker position={[marker.latitude, marker.longitude]} />
          )}
        </MapContainer>
      </div>
      {marker ? (
        <p className="flex items-start gap-1.5 text-xs text-zinc-600">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500" />
          <span>{marker.address}</span>
        </p>
      ) : (
        <p className="text-xs text-zinc-400">
          Click anywhere on the map to drop a pin, or search above.
        </p>
      )}
    </div>
  );
}