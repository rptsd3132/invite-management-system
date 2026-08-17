import { useMemo, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Cake,
  CalendarDays,
  Heart,
  Loader2,
  MapPin,
  PartyPopper,
  Tag,
  User,
} from "lucide-react";
import { createEvent, getTemplates } from "../lib/api";
import { TemplateRenderer } from "../components/ui/TemplateRenderer";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { LocationPicker } from "../components/events/LocationPicker";
import type { VenueLocation } from "../components/events/LocationPicker";
import { StudioCanvas } from "../components/events/StudioCanvas";
import type { CreateEventPayload, Template } from "../types";

const DATE_LABEL_FIELDS = ["event_date_time", "event_date"];
const LOCATION_FIELDS = ["event_location", "location"];
const NAME_FIELDS = ["event_name"];

function formatFieldLabel(key: string): string {
  const labels: Record<string, string> = {
    event_name: "Event Name",
    event_location: "Location",
    location: "Location",
    event_date_time: "Date & Time",
    event_date: "Date & Time",
    participant_name: "Your Name on Invitation",
    bride_name: "Bride Name",
    groom_name: "Groom Name",
    birthday_person_name: "Birthday Person",
  };
  return (
    labels[key] ??
    key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function fieldIcon(field: string): React.ReactNode {
  if (DATE_LABEL_FIELDS.includes(field)) return <CalendarDays className="h-4 w-4" />;
  if (LOCATION_FIELDS.includes(field)) return <MapPin className="h-4 w-4" />;
  if (field === "event_name") return <PartyPopper className="h-4 w-4" />;
  if (field === "participant_name") return <User className="h-4 w-4" />;
  if (field.includes("bride") || field.includes("groom")) return <Heart className="h-4 w-4" />;
  if (field.includes("birthday")) return <Cake className="h-4 w-4" />;
  return <Tag className="h-4 w-4" />;
}

function inputType(field: string): string {
  if (DATE_LABEL_FIELDS.includes(field)) return "datetime-local";
  return "text";
}

export function CreateEvent(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const templateId =
    (location.state as { templateId?: string } | null)?.templateId ??
    searchParams.get("templateId") ??
    "";

  const { data: templates } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

  const template: Template | undefined = useMemo(
    () => templates?.find((t) => t.id === templateId),
    [templates, templateId],
  );

  const requiredFields = useMemo(
    () => template?.design_schema.required_fields ?? [],
    [template],
  );

  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [venue, setVenue] = useState<VenueLocation | null>(null);

  const setField = (field: string, value: string): void => {
    setFieldValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleVenueChange = (location: VenueLocation): void => {
    setVenue(location);
    const hasTypedLocation = Boolean(
      fieldValues["event_location"] || fieldValues["location"],
    );
    if (!hasTypedLocation) {
      setField("event_location", location.address);
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    for (const f of requiredFields) {
      if (!fieldValues[f]?.trim()) {
        errs[f] = `${formatFieldLabel(f)} is required`;
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const mutation = useMutation({
    mutationFn: (payload: CreateEventPayload) => createEvent(payload),
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  const fieldData: Record<string, string | undefined> = useMemo(() => {
    const data: Record<string, string | undefined> = {};
    for (const f of requiredFields) {
      data[f] = fieldValues[f] || undefined;
    }
    return data;
  }, [fieldValues, requiredFields]);

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!validate()) return;

    const metadata: Record<string, string> = {};
    for (const f of requiredFields) {
      if (
        !NAME_FIELDS.includes(f) &&
        !LOCATION_FIELDS.includes(f) &&
        !DATE_LABEL_FIELDS.includes(f)
      ) {
        metadata[f] = fieldValues[f] ?? "";
      }
    }

    const dateValue = fieldValues["event_date_time"] ?? fieldValues["event_date"];
    const typedLocation =
      fieldValues["event_location"] ?? fieldValues["location"] ?? "";
    const payload: CreateEventPayload = {
      template_id: templateId,
      event_name: fieldValues["event_name"] ?? "",
      location: typedLocation.trim() || venue?.address || "",
      event_date: dateValue ? new Date(dateValue).toISOString() : new Date().toISOString(),
      address: venue?.address ?? null,
      latitude: venue?.latitude ?? null,
      longitude: venue?.longitude ?? null,
      event_metadata: metadata,
    };

    mutation.mutate(payload);
  };

  if (!templateId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-zinc-500">No template selected.</p>
        <Button className="mt-4" onClick={() => navigate("/templates")}>
          Browse Templates
        </Button>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded-lg bg-zinc-100" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-[3/4] rounded-xl bg-zinc-100" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 rounded-xl bg-zinc-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="mt-6">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Create Event</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Fill in the details below. The preview updates live on your canvas.
        </p>
      </div>

      <form onSubmit={onSubmit} noValidate className="mt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-10">
          {/* Left column — form */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm shadow-zinc-900/5 sm:p-8">
            <div className="border-b border-zinc-100 pb-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                {template.name}
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Fields marked below are required by this invitation design.
              </p>
            </div>

            <div className="space-y-5 pt-6">
              {requiredFields.map((field) => (
                <Input
                  key={field}
                  id={`field-${field}`}
                  type={inputType(field)}
                  label={formatFieldLabel(field)}
                  leadingIcon={fieldIcon(field)}
                  value={fieldValues[field] ?? ""}
                  error={errors[field]}
                  onChange={(e) => setField(field, e.target.value)}
                />
              ))}

              <div className="border-t border-zinc-100 pt-5">
                <h3 className="text-sm font-semibold text-zinc-800">
                  Venue Location
                </h3>
                <p className="mb-4 mt-1 text-xs text-zinc-400">
                  Search for the venue or click the map to drop a pin. Guests
                  will use these coordinates to get directions.
                </p>
                <LocationPicker value={venue} onChange={handleVenueChange} />
              </div>
            </div>

            <div className="mt-8 flex gap-3 border-t border-zinc-100 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/templates")}
              >
                Change Template
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1"
              >
                {mutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {mutation.isPending ? "Creating..." : "Create Event"}
              </Button>
            </div>

            {mutation.isError && (
              <p className="mt-4 text-sm text-red-600">
                {(mutation.error as Error)?.message ??
                  "Failed to create event."}
              </p>
            )}
          </div>

          {/* Right column — studio preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="mb-3 flex items-baseline justify-between">
              <p className="text-sm font-medium text-zinc-700">Live Preview</p>
              <span className="text-xs text-zinc-400">
                Use the toolbar to zoom
              </span>
            </div>
            <StudioCanvas>
              <div className="rounded-2xl shadow-2xl shadow-zinc-900/30">
                <TemplateRenderer
                  designSchema={template.design_schema}
                  fieldData={fieldData}
                />
              </div>
            </StudioCanvas>
          </div>
        </div>
      </form>
    </div>
  );
}