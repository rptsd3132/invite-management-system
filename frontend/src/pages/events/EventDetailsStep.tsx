import { useState } from "react";
import { CalendarDays, MapPin, PartyPopper, Tag } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input";
import type { WizardAction, WizardState } from "./CreateEventWizard";

interface Props {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  goToStep: (step: number) => void;
}

const CATEGORY_SPECIFIC_FIELDS: Record<string, Array<{ key: string; label: string }>> = {
  Wedding: [
    { key: "bride_name", label: "Bride Name" },
    { key: "groom_name", label: "Groom Name" },
  ],
  Birthday: [
    { key: "birthday_person_name", label: "Birthday Person Name" },
  ],
  Office: [],
};

export function EventDetailsStep({ state, dispatch, goToStep }: Props): React.ReactElement {
  const { eventData } = state;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const extraFields = CATEGORY_SPECIFIC_FIELDS[eventData.category] ?? [];

  const updateField = (key: string, value: string): void => {
    dispatch({ type: "SET_EVENT_DATA", payload: { [key]: value } });
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const updateMetadata = (key: string, value: string): void => {
    dispatch({
      type: "SET_EVENT_DATA",
      payload: {
        metadata: { ...eventData.metadata, [key]: value },
      },
    });
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!eventData.eventName.trim()) errs.eventName = "Event name is required";
    if (!eventData.location.trim()) errs.location = "Location is required";
    if (!eventData.eventDate.trim()) errs.eventDate = "Date and time is required";
    for (const f of extraFields) {
      if (!(eventData.metadata[f.key] ?? "").trim()) {
        errs[f.key] = `${f.label} is required`;
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (): void => {
    if (!validate()) return;
    goToStep(2);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Event Details</h2>
      <p className="mt-1 text-sm text-zinc-500">Tell us about your event.</p>

      <div className="mt-8 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm shadow-zinc-900/5 sm:p-8">
        <div className="max-w-xl space-y-5">
          <Input
            label="Event Name"
            leadingIcon={<PartyPopper className="h-4 w-4" />}
            value={eventData.eventName}
            error={errors.eventName}
            onChange={(e) => updateField("eventName", e.target.value)}
            placeholder="e.g. Annual Innovation Summit"
          />

          <Input
            label="Location"
            leadingIcon={<MapPin className="h-4 w-4" />}
            value={eventData.location}
            error={errors.location}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="e.g. Convention Center"
          />

          <Input
            label="Date & Time"
            type="datetime-local"
            leadingIcon={<CalendarDays className="h-4 w-4" />}
            value={eventData.eventDate}
            error={errors.eventDate}
            onChange={(e) => updateField("eventDate", e.target.value)}
          />

          <Select
            label="Category"
            leadingIcon={<Tag className="h-4 w-4" />}
            value={eventData.category}
            onChange={(e) => {
              updateField("category", e.target.value);
              dispatch({ type: "SET_EVENT_DATA", payload: { metadata: {} } });
            }}
          >
            <option value="Wedding">Wedding</option>
            <option value="Office">Office</option>
            <option value="Birthday">Birthday</option>
          </Select>

          {extraFields.map((f) => (
            <Input
              key={f.key}
              label={f.label}
              value={eventData.metadata[f.key] ?? ""}
              error={errors[f.key]}
              onChange={(e) => updateMetadata(f.key, e.target.value)}
            />
          ))}
        </div>

        <div className="flex justify-end border-t border-zinc-100 pt-6">
          <Button type="button" onClick={handleNext}>
            Next: Choose Template
          </Button>
        </div>
      </div>
    </div>
  );
}