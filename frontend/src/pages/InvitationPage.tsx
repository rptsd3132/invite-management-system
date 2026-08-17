import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
<<<<<<< HEAD
import { Loader2, Navigation } from "lucide-react";
=======
import { Loader2 } from "lucide-react";

>>>>>>> main
import { getInvitationByToken } from "../lib/api";
import { TemplateRenderer } from "../components/ui/TemplateRenderer";

import {
  formatInvitationDate,
  getInvitationCopy,
  normalizeInvitationLanguage,
  rsvpStatusLabel,
} from "../lib/invitationLanguage";

export function InvitationPage(): React.ReactElement {
  const { token } = useParams<{ token: string }>();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["invitation", token],
    queryFn: () => getInvitationByToken(token!),
    enabled: !!token,
  });

  const language = normalizeInvitationLanguage(
    data?.event?.event_metadata?.language,
  );

  const copy = getInvitationCopy(language);

  const localizedFieldData = useMemo(() => {
    if (!data) {
      return {};
    }

    const next: Record<string, string | undefined> = {
      ...data.field_data,
    };

    /*
     * The backend currently creates event_date_time in English.
     * The public invitation has event.event_date as ISO data,
     * so we overwrite only the display value here.
     */
    next.event_date_time = formatInvitationDate(
      data.event.event_date,
      language,
    );

    if ("event_date" in next) {
      next.event_date = formatInvitationDate(
        data.event.event_date,
        language,
      );
    }

    next.event_location = data.event.location;
    next.event_name = data.event.event_name;
    next.participant_name = data.participant.guest_name;

    return next;
  }, [data, language]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4">
        <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-lg font-semibold text-red-700">
            {copy.invitationNotFound}
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {(error as Error)?.message ?? copy.invalidInvitation}
          </p>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  const { event, participant, template, field_data } = data;
  const fieldData = {
    ...field_data,
    guest_name: participant.guest_name,
    participant_name: participant.guest_name,
  };
=======
  const {
    event,
    participant,
    template,
  } = data;
>>>>>>> main

  return (
    <div
      className="flex min-h-screen flex-col bg-neutral-50"
      lang={language === "si" ? "si" : "en"}
    >
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <span className="text-sm font-semibold text-neutral-800">
            {copy.invitation}
          </span>

          <span className="truncate text-xs text-neutral-400">
            {event.event_name}
          </span>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-sm">
          <TemplateRenderer
            designSchema={template.design_schema}
<<<<<<< HEAD
            fieldData={fieldData}
=======
            fieldData={localizedFieldData}
            language={language}
>>>>>>> main
          />
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-500">
            {copy.invitedAs}{" "}
            <span className="font-semibold text-neutral-800">
              {participant.guest_name}
            </span>
          </p>

          <p className="mt-2 text-xs text-neutral-400">
            {copy.rsvpStatus}:{" "}
            <span className="font-medium">
              {rsvpStatusLabel(
                participant.rsvp_status,
                language,
              )}
            </span>
          </p>
        </div>

        {participant.rsvp_status === "pending" && (
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              className="rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90"
            >
              {copy.confirmAttendance}
            </button>

            <button
              type="button"
              className="rounded-lg border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              {copy.decline}
            </button>
          </div>
        )}

        {event.latitude != null && event.longitude != null && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand/20 transition-all duration-200 hover:bg-brand/90 hover:shadow-brand/30 active:scale-[0.98]"
          >
            <Navigation className="h-4 w-4" />
            Get Directions
          </a>
        )}

        <p className="mt-12 text-xs text-neutral-400">
          {copy.poweredBy}
        </p>
      </main>
    </div>
  );
}
