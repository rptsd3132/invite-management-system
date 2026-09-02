import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MapPin, Check, Heart } from "lucide-react";
import { getInvitationByToken, updateRsvpStatus } from "../lib/api";
import { TemplateRenderer } from "../components/ui/TemplateRenderer";
import KasunNethmiExactWeddingTemplate from "../components/assets/wedding/KasunNethmiExactWeddingTemplate";
import SinhalaWeddingInvitationTemplate from "../components/assets/wedding/SinhalaWeddingInvitationTemplate";
import EnglishBirthdayInvitationTemplate from "../components/assets/birthday/EnglishBirthdayInvitationTemplate";
import SinhalaBirthdayInvitationTemplate from "../components/assets/birthday/SinhalaBirthdayInvitationTemplate";
import EnglishCorporateGalaInvitationTemplate from "../components/assets/office/EnglishCorporateGalaInvitationTemplate";
import SinhalaCorporateGalaInvitationTemplate from "../components/assets/office/SinhalaCorporateGalaInvitationTemplate";

import {
  formatInvitationDate,
  getInvitationCopy,
  normalizeInvitationLanguage,
  rsvpStatusLabel,
} from "../lib/invitationLanguage";

export function InvitationPage(): React.ReactElement {
  const { token } = useParams<{ token: string }>();
  const queryClient = useQueryClient();
  const [personalNote, setPersonalNote] = useState("");
  const [responded, setResponded] = useState(false);

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

  const rsvpMutation = useMutation({
    mutationFn: (rsvpStatus: "accepted" | "declined") =>
      updateRsvpStatus(token!, {
        rsvp_status: rsvpStatus,
        personal_note: personalNote || undefined,
      }),
    onSuccess: () => {
      setResponded(true);
      void queryClient.invalidateQueries({ queryKey: ["invitation", token] });
    },
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

  const {
    event,
    participant,
    template,
  } = data;

  const eventName = event.event_name;
  const guestName = participant.guest_name;
  const brideName = localizedFieldData.bride_name ?? "Bride";
  const groomName = localizedFieldData.groom_name ?? "Groom";
  const birthdayPerson = localizedFieldData.birthday_person_name ?? localizedFieldData.birthday_person ?? "Birthday Star";
  const companyName = localizedFieldData.company_name ?? "Company";
  const isKasunNethmiTemplate = template?.name === "Kasun & Nethmi Wedding";
  const isSinhalaWeddingTemplate = template?.name === "Sinhala Wedding";
  const isSinhalaBirthdayTemplate = template?.name === "Sinhala Birthday";
  const isEnglishBirthdayTemplate = template?.name === "English Birthday";
  const isEnglishOfficeTemplate = template?.name === "English Office";
  const isSinhalaOfficeTemplate = template?.name === "Sinhala Office";

  const customInvitation = isKasunNethmiTemplate ? (
    <KasunNethmiExactWeddingTemplate
      guestName={guestName}
      eventName={eventName}
      brideName={brideName}
      groomName={groomName}
      date={event.event_date}
      time={event.event_date}
      location={event.location}
      language={language}
    />
  ) : isSinhalaWeddingTemplate ? (
    <SinhalaWeddingInvitationTemplate
      eventName={eventName}
      brideName={brideName}
      groomName={groomName}
      date={event.event_date}
      time={event.event_date}
      location={event.location}
      category="මංගල ආරාධනා පත්‍රය"
    />
  ) : isSinhalaBirthdayTemplate ? (
    <SinhalaBirthdayInvitationTemplate
      eventName={eventName}
      birthdayPerson={birthdayPerson}
      age={localizedFieldData.age}
      date={event.event_date}
      time={event.event_date}
      location={event.location}
      category="විශේෂ ආරාධනාවයි"
    />
  ) : isEnglishBirthdayTemplate ? (
    <EnglishBirthdayInvitationTemplate
      eventName={eventName}
      birthdayPerson={birthdayPerson}
      age={localizedFieldData.age}
      date={event.event_date}
      time={event.event_date}
      location={event.location}
      category="Special Invitation"
    />
  ) : isEnglishOfficeTemplate ? (
    <EnglishCorporateGalaInvitationTemplate
      eventName={eventName}
      companyName={companyName}
      date={event.event_date}
      time={event.event_date}
      location={event.location}
    />
  ) : isSinhalaOfficeTemplate ? (
    <SinhalaCorporateGalaInvitationTemplate
      eventName={eventName}
      companyName={companyName}
      date={event.event_date}
      time={event.event_date}
      location={event.location}
    />
  ) : null;

  const invitationCard = customInvitation ?? (
    <TemplateRenderer
      designSchema={template.design_schema}
      fieldData={localizedFieldData}
      language={language}
    />
  );

  const hasAlreadyResponded = responded || participant.rsvp_status !== "pending";

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
          {invitationCard}
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
                responded ? "accepted" : participant.rsvp_status,
                language,
              )}
            </span>
          </p>
        </div>

        {hasAlreadyResponded ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-8 py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <Heart className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="text-sm font-semibold text-emerald-800">
              Thank you for your response!
            </p>
            <p className="text-xs text-emerald-600">
              {participant.rsvp_status === "accepted"
                ? "We look forward to celebrating with you."
                : "Thank you for letting us know. You will be missed."}
            </p>
          </div>
        ) : (
          <div className="mt-6 flex w-full max-w-sm flex-col gap-4">
            <textarea
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              placeholder={
                language === "si"
                  ? "ඔබේ පණිවිඩය මෙහි ලියන්න (අමතර විස්තර, ආහාර අවශ්‍යතා, සුභ පැතුම්...)..."
                  : "Leave a personal note (dietary requirements, well wishes, etc.)..."
              }
              rows={3}
              className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 transition-colors focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
            />

            <div className="flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => rsvpMutation.mutate("accepted")}
                disabled={rsvpMutation.isPending}
                className="flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
              >
                {rsvpMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {copy.confirmAttendance}
              </button>

              <button
                type="button"
                onClick={() => rsvpMutation.mutate("declined")}
                disabled={rsvpMutation.isPending}
                className="rounded-xl border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
              >
                {copy.decline}
              </button>
            </div>
          </div>
        )}

        <a
          href={
            event.latitude != null && event.longitude != null
              ? `https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address || event.location)}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-zinc-800 hover:shadow-lg sm:w-auto"
        >
          <MapPin className="h-4 w-4 shrink-0" />
          Get Directions
        </a>

        <p className="mt-12 text-xs text-neutral-400">
          {copy.poweredBy}
        </p>
      </main>
    </div>
  );
}
