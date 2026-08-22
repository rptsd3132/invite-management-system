import { useEffect, useState } from "react";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { WizardAction, WizardState } from "./CreateEventWizard";
import { categoryLabel, getInvitationCopy, type InvitationLanguage } from "../../lib/invitationLanguage";

const DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const DEFAULT_CENTER: [number, number] = [6.9271, 79.8612];
const DEFAULT_ZOOM = 11;

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

interface Props {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  goToStep: (step: number) => void;
}

function getCategorySpecificFields(category: string, language: InvitationLanguage): Array<{ key: string; label: string }> {
  const copy = getInvitationCopy(language);
  if (category === "Wedding") {
    return [
      { key: "bride_name", label: copy.brideName },
      { key: "groom_name", label: copy.groomName },
    ];
  }
  if (category === "Birthday") {
    return [{ key: "birthday_person_name", label: copy.birthdayPersonName }];
  }
  return [];
}

function MapFlyTo({ latitude, longitude }: { latitude: number | null; longitude: number | null }): null {
  const map = useMap();
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      map.flyTo([latitude, longitude], 15);
    }
  }, [map, latitude, longitude]);
  return null;
}

function MapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }): null {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function EventDetailsStep({ state, dispatch, goToStep }: Props): React.ReactElement {
  const { eventData } = state;
  const language = eventData.language;
  const copy = getInvitationCopy(language);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const extraFields = getCategorySpecificFields(eventData.category, language);

  const updateField = (key: string, value: string): void => {
    dispatch({ type: "SET_EVENT_DATA", payload: { [key]: value } });
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const updateMetadata = (key: string, value: string): void => {
    dispatch({ type: "SET_EVENT_DATA", payload: { metadata: { ...eventData.metadata, [key]: value } } });
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  useEffect(() => {
    const query = eventData.location.trim();
    if (query.length < 3) return;
    const timeoutId = setTimeout(() => {
      void (async () => {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`, {
            headers: { "User-Agent": "invite-management-system/1.0 (event organizer location picker)" },
          });
          if (!response.ok) return;
          const data = (await response.json()) as NominatimResult[];
          const first = data[0];
          if (!first) return;
          const lat = parseFloat(first.lat);
          const lon = parseFloat(first.lon);
          if (Number.isNaN(lat) || Number.isNaN(lon)) return;
          dispatch({ type: "SET_EVENT_DATA", payload: { latitude: lat, longitude: lon } });
        } catch {
          return;
        }
      })();
    }, 800);
    return () => clearTimeout(timeoutId);
  }, [eventData.location, dispatch]);

  const handleMapClick = (lat: number, lng: number): void => {
    dispatch({ type: "SET_EVENT_DATA", payload: { latitude: lat, longitude: lng } });
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!eventData.eventName.trim()) nextErrors.eventName = language === "si" ? `${copy.eventName} ${copy.required}` : "Event name is required";
    if (!eventData.location.trim()) nextErrors.location = language === "si" ? `${copy.location} ${copy.required}` : "Location is required";
    if (!eventData.eventDate.trim()) nextErrors.eventDate = language === "si" ? `${copy.dateTime} ${copy.required}` : "Date and time is required";
    for (const field of extraFields) {
      if (!(eventData.metadata[field.key] ?? "").trim()) {
        nextErrors[field.key] = language === "si" ? `${field.label} ${copy.required}` : `${field.label} is required`;
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = (): void => {
    if (!validate()) return;
    goToStep(3);
  };

  const inputClass = "mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";
  const hasCoords = eventData.latitude !== null && eventData.longitude !== null;
  const mapCenter: [number, number] = hasCoords ? [eventData.latitude as number, eventData.longitude as number] : DEFAULT_CENTER;

  return (
    <div lang={language === "si" ? "si" : "en"}>
      <h2 className="text-2xl font-bold text-neutral-900">{copy.eventDetails}</h2>
      <p className="mt-1 text-sm text-neutral-500">{copy.eventDetailsHelp}</p>
      <div className="mt-8 max-w-xl space-y-5">
        <div>
          <label className="block text-sm font-medium text-neutral-700">{copy.invitationLanguage}</label>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {(["en", "si"] as InvitationLanguage[]).map((option) => {
              const active = language === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateField("language", option)}
                  className={["rounded-xl border px-4 py-3 text-sm font-semibold transition", active ? "border-brand bg-brand/5 text-brand ring-2 ring-brand/10" : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"].join(" ")}
                >
                  {option === "en" ? copy.english : copy.sinhala}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs leading-5 text-neutral-400">
            {language === "si" ? "සිංහල ආරාධනයක් සඳහා නම්, ස්ථානය සහ පුද්ගල නාම අවශ්‍ය ආකාරයට සිංහලෙන් ඇතුළත් කරන්න." : "Names and locations are kept exactly as you type them."}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700">{copy.eventName}</label>
          <input type="text" value={eventData.eventName} onChange={(e) => updateField("eventName", e.target.value)} className={inputClass} placeholder={language === "si" ? "උදා: වාර්ෂික නවෝත්පාදන සමුළුව 2026" : "e.g. Annual Innovation Summit 2026"} />
          {errors.eventName && <p className="mt-1 text-sm text-red-600">{errors.eventName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700">{copy.location}</label>
          <input type="text" value={eventData.location} onChange={(e) => updateField("location", e.target.value)} className={inputClass} placeholder={language === "si" ? "උදා: ප්‍රධාන සම්මන්ත්‍රණ ශාලාව" : "e.g. Convention Center"} />
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          <div className="mt-3 h-64 overflow-hidden rounded-xl border border-neutral-200">
            <MapContainer center={mapCenter} zoom={hasCoords ? 15 : DEFAULT_ZOOM} className="h-full w-full" scrollWheelZoom>
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapFlyTo latitude={eventData.latitude} longitude={eventData.longitude} />
              <MapClickHandler onSelect={handleMapClick} />
              {hasCoords && <Marker position={[eventData.latitude as number, eventData.longitude as number]} />}
            </MapContainer>
          </div>
          <p className="mt-1.5 text-xs text-neutral-400">{hasCoords ? `${eventData.latitude?.toFixed(5)}, ${eventData.longitude?.toFixed(5)} — click map to refine pin` : "Type a location above to move the pin, or click the map to place it."}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700">{copy.dateTime}</label>
          <input type="datetime-local" value={eventData.eventDate} onChange={(e) => updateField("eventDate", e.target.value)} className={inputClass} />
          {errors.eventDate && <p className="mt-1 text-sm text-red-600">{errors.eventDate}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700">{copy.category}</label>
          <select
            value={eventData.category}
            onChange={(e) => {
              updateField("category", e.target.value);
              dispatch({ type: "SET_EVENT_DATA", payload: { metadata: {} } });
            }}
            className={inputClass}
          >
            <option value="Wedding">{categoryLabel("Wedding", language)}</option>
            <option value="Office">{categoryLabel("Office", language)}</option>
            <option value="Birthday">{categoryLabel("Birthday", language)}</option>
          </select>
        </div>
        {extraFields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-neutral-700">{field.label}</label>
            <input type="text" value={eventData.metadata[field.key] ?? ""} onChange={(e) => updateMetadata(field.key, e.target.value)} className={inputClass} />
            {errors[field.key] && <p className="mt-1 text-sm text-red-600">{errors[field.key]}</p>}
          </div>
        ))}
        <div className="flex items-center justify-between pt-4">
          <button type="button" onClick={() => goToStep(1)} className="rounded-lg border border-neutral-300 bg-white px-6 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50">
            {copy.back}
          </button>
          <button type="button" onClick={handleNext} className="rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90">
            {copy.continueToGuests}
          </button>
        </div>
      </div>
    </div>
  );
}
