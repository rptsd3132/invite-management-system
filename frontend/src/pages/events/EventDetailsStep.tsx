import { useState } from "react";
<<<<<<< HEAD
import { CalendarDays, MapPin, PartyPopper, Tag } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input";
import type { WizardAction, WizardState } from "./CreateEventWizard";
=======

import type { WizardState } from "./CreateEventWizard";
>>>>>>> main

import {
  categoryLabel,
  getInvitationCopy,
  type InvitationLanguage,
} from "../../lib/invitationLanguage";

interface Props {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  goToStep: (step: number) => void;
}

function getCategorySpecificFields(
  category: string,
  language: InvitationLanguage,
): Array<{ key: string; label: string }> {
  const copy = getInvitationCopy(language);

  if (category === "Wedding") {
    return [
      { key: "bride_name", label: copy.brideName },
      { key: "groom_name", label: copy.groomName },
    ];
  }

  if (category === "Birthday") {
    return [
      {
        key: "birthday_person_name",
        label: copy.birthdayPersonName,
      },
    ];
  }

  return [];
}

export function EventDetailsStep({
  state,
  dispatch,
  goToStep,
}: Props): React.ReactElement {
  const { eventData } = state;
  const language = eventData.language;
  const copy = getInvitationCopy(language);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const extraFields = getCategorySpecificFields(
    eventData.category,
    language,
  );

  const updateField = (
    key: string,
    value: string,
  ): void => {
    dispatch({
      type: "SET_EVENT_DATA",
      payload: { [key]: value },
    });

    if (errors[key]) {
      setErrors((previous) => ({
        ...previous,
        [key]: "",
      }));
    }
  };

  const updateMetadata = (
    key: string,
    value: string,
  ): void => {
    dispatch({
      type: "SET_EVENT_DATA",
      payload: {
        metadata: {
          ...eventData.metadata,
          [key]: value,
        },
      },
    });

    if (errors[key]) {
      setErrors((previous) => ({
        ...previous,
        [key]: "",
      }));
    }
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!eventData.eventName.trim()) {
      nextErrors.eventName =
        language === "si"
          ? `${copy.eventName} ${copy.required}`
          : "Event name is required";
    }

    if (!eventData.location.trim()) {
      nextErrors.location =
        language === "si"
          ? `${copy.location} ${copy.required}`
          : "Location is required";
    }

    if (!eventData.eventDate.trim()) {
      nextErrors.eventDate =
        language === "si"
          ? `${copy.dateTime} ${copy.required}`
          : "Date and time is required";
    }

    for (const field of extraFields) {
      if (!(eventData.metadata[field.key] ?? "").trim()) {
        nextErrors[field.key] =
          language === "si"
            ? `${field.label} ${copy.required}`
            : `${field.label} is required`;
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = (): void => {
    if (!validate()) return;
    goToStep(2);
  };

<<<<<<< HEAD
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
=======
  const inputClass =
    "mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

  return (
    <div lang={language === "si" ? "si" : "en"}>
      <h2 className="text-2xl font-bold text-neutral-900">
        {copy.eventDetails}
      </h2>

      <p className="mt-1 text-sm text-neutral-500">
        {copy.eventDetailsHelp}
      </p>

      <div className="mt-8 max-w-xl space-y-5">
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            {copy.invitationLanguage}
          </label>

          <div className="mt-2 grid grid-cols-2 gap-3">
            {(["en", "si"] as InvitationLanguage[]).map(
              (option) => {
                const active = language === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      updateField("language", option)
                    }
                    className={[
                      "rounded-xl border px-4 py-3 text-sm font-semibold transition",
                      active
                        ? "border-brand bg-brand/5 text-brand ring-2 ring-brand/10"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300",
                    ].join(" ")}
                  >
                    {option === "en"
                      ? copy.english
                      : copy.sinhala}
                  </button>
                );
              },
            )}
          </div>

          <p className="mt-2 text-xs leading-5 text-neutral-400">
            {language === "si"
              ? "සිංහල ආරාධනයක් සඳහා නම්, ස්ථානය සහ පුද්ගල නාම අවශ්‍ය ආකාරයට සිංහලෙන් ඇතුළත් කරන්න."
              : "Names and locations are kept exactly as you type them."}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            {copy.eventName}
          </label>

          <input
            type="text"
            value={eventData.eventName}
            onChange={(event) =>
              updateField("eventName", event.target.value)
            }
            className={inputClass}
            placeholder={
              language === "si"
                ? "උදා: වාර්ෂික නවෝත්පාදන සමුළුව 2026"
                : "e.g. Annual Innovation Summit 2026"
            }
          />

          {errors.eventName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.eventName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            {copy.location}
          </label>

          <input
            type="text"
            value={eventData.location}
            onChange={(event) =>
              updateField("location", event.target.value)
            }
            className={inputClass}
            placeholder={
              language === "si"
                ? "උදා: ප්‍රධාන සම්මන්ත්‍රණ ශාලාව"
                : "e.g. Convention Center"
            }
          />

          {errors.location && (
            <p className="mt-1 text-sm text-red-600">
              {errors.location}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            {copy.dateTime}
          </label>

          <input
>>>>>>> main
            type="datetime-local"
            leadingIcon={<CalendarDays className="h-4 w-4" />}
            value={eventData.eventDate}
<<<<<<< HEAD
            error={errors.eventDate}
            onChange={(e) => updateField("eventDate", e.target.value)}
          />

          <Select
            label="Category"
            leadingIcon={<Tag className="h-4 w-4" />}
=======
            onChange={(event) =>
              updateField("eventDate", event.target.value)
            }
            className={inputClass}
          />

          {errors.eventDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.eventDate}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            {copy.category}
          </label>

          <select
>>>>>>> main
            value={eventData.category}
            onChange={(event) => {
              updateField("category", event.target.value);

              dispatch({
                type: "SET_EVENT_DATA",
                payload: { metadata: {} },
              });
            }}
<<<<<<< HEAD
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
=======
            className={inputClass}
          >
            <option value="Wedding">
              {categoryLabel("Wedding", language)}
            </option>
            <option value="Office">
              {categoryLabel("Office", language)}
            </option>
            <option value="Birthday">
              {categoryLabel("Birthday", language)}
            </option>
          </select>
        </div>

        {extraFields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-neutral-700">
              {field.label}
            </label>

            <input
              type="text"
              value={eventData.metadata[field.key] ?? ""}
              onChange={(event) =>
                updateMetadata(field.key, event.target.value)
              }
              className={inputClass}
            />

            {errors[field.key] && (
              <p className="mt-1 text-sm text-red-600">
                {errors[field.key]}
              </p>
            )}
          </div>
        ))}

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={handleNext}
            className="rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90"
          >
            {copy.nextChooseTemplate}
          </button>
>>>>>>> main
        </div>
      </div>
    </div>
  );
}