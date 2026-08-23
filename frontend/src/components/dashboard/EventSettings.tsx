import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Save, CheckCircle2 } from "lucide-react";
import { Input, Select } from "../ui/Input";
import { Button } from "../ui/Button";
import { getTemplates, updateEvent } from "../../lib/api";
import type { EventDetailResponse } from "../../types";

interface EventSettingsProps {
  event: EventDetailResponse;
  onSaved?: () => void;
}

function toDatetimeLocal(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function EventSettings({ event, onSaved }: EventSettingsProps): React.ReactElement {
  const [eventName, setEventName] = useState(event.event_name);
  const [eventDate, setEventDate] = useState(toDatetimeLocal(event.event_date));
  const [location, setLocation] = useState(event.location);
  const [templateId, setTemplateId] = useState(event.template_id);
  const [saved, setSaved] = useState(false);

  const { data: templates = [] } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

  const grouped = templates.reduce<Record<string, typeof templates>>((acc, t) => {
    (acc[t.category] ??= []).push(t);
    return acc;
  }, {});

  const mutation = useMutation({
    mutationFn: () =>
      updateEvent(event.id, {
        event_name: eventName,
        event_date: new Date(eventDate).toISOString(),
        location,
        template_id: templateId,
      }),
    onSuccess: () => {
      setSaved(true);
      onSaved?.();
      setTimeout(() => setSaved(false), 2500);
    },
  });

  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="space-y-5">
        <Input
          label="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />

        <Input
          label="Date & Time"
          type="datetime-local"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />

        <Input
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <Select
          label="Template"
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
        >
          {Object.entries(grouped).map(([category, items]) => (
            <optgroup key={category} label={category}>
              {items.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>

        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>

          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              Saved
            </span>
          )}

          {mutation.isError && (
            <span className="text-sm text-red-600">
              {mutation.error instanceof Error
                ? mutation.error.message
                : "Save failed"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
