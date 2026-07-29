import { useState } from "react";
import type { WizardState } from "./CreateEventWizard";

interface Props {
  state: WizardState;
  dispatch: React.Dispatch<any>;
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
      <h2 className="text-2xl font-bold text-neutral-900">Event Details</h2>
      <p className="mt-1 text-sm text-neutral-500">Tell us about your event.</p>

      <div className="mt-8 space-y-5 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-neutral-700">Event Name</label>
          <input
            type="text"
            value={eventData.eventName}
            onChange={(e) => updateField("eventName", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            placeholder="e.g. Annual Innovation Summit"
          />
          {errors.eventName && <p className="mt-1 text-sm text-red-600">{errors.eventName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">Location</label>
          <input
            type="text"
            value={eventData.location}
            onChange={(e) => updateField("location", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            placeholder="e.g. Convention Center"
          />
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">Date & Time</label>
          <input
            type="datetime-local"
            value={eventData.eventDate}
            onChange={(e) => updateField("eventDate", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          {errors.eventDate && <p className="mt-1 text-sm text-red-600">{errors.eventDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">Category</label>
          <select
            value={eventData.category}
            onChange={(e) => {
              updateField("category", e.target.value);
              dispatch({ type: "SET_EVENT_DATA", payload: { metadata: {} } });
            }}
            className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="Wedding">Wedding</option>
            <option value="Office">Office</option>
            <option value="Birthday">Birthday</option>
          </select>
        </div>

        {extraFields.map((f) => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-neutral-700">{f.label}</label>
            <input
              type="text"
              value={eventData.metadata[f.key] ?? ""}
              onChange={(e) => updateMetadata(f.key, e.target.value)}
              className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            {errors[f.key] && <p className="mt-1 text-sm text-red-600">{errors[f.key]}</p>}
          </div>
        ))}

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={handleNext}
            className="rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white hover:bg-brand/90 transition-colors"
          >
            Next: Choose Template
          </button>
        </div>
      </div>
    </div>
  );
}
