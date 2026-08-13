import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle, Loader2 } from "lucide-react";

import {
  addParticipants,
  createEvent,
  getTemplates,
} from "../../lib/api";

import { TemplateRenderer } from "../../components/ui/TemplateRenderer";

import {
  categoryLabel,
  formatInvitationDate,
  formatReviewDate,
  getInvitationCopy,
} from "../../lib/invitationLanguage";

import type { WizardState } from "./CreateEventWizard";

interface Props {
  state: WizardState;
  dispatch: React.Dispatch<any>;
  goToStep: (step: number) => void;
  handleFinish: () => void;
}

export function ReviewConfirmStep({
  state,
  goToStep,
  handleFinish,
}: Props): React.ReactElement {
  const language = state.eventData.language;
  const copy = getInvitationCopy(language);

  const { data: templates } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

  const template = useMemo(
    () =>
      templates?.find(
        (item) => item.id === state.selectedTemplateId,
      ),
    [templates, state.selectedTemplateId],
  );

  const previewFieldData = useMemo(() => {
    if (!template) return {};

    const data: Record<string, string | undefined> = {};

    for (const field of template.design_schema.required_fields) {
      if (field === "event_name") {
        data[field] =
          state.eventData.eventName || undefined;
      } else if (
        field === "event_location" ||
        field === "location"
      ) {
        data[field] =
          state.eventData.location || undefined;
      } else if (
        field === "event_date_time" ||
        field === "event_date"
      ) {
        data[field] = state.eventData.eventDate
          ? formatInvitationDate(
              state.eventData.eventDate,
              language,
            )
          : undefined;
      } else if (field === "participant_name") {
        data[field] =
          state.guests[0]?.guestName ?? copy.guest;
      } else {
        data[field] =
          state.eventData.metadata[field] || undefined;
      }
    }

    return data;
  }, [
    copy.guest,
    language,
    state.eventData,
    state.guests,
    template,
  ]);

  const mutation = useMutation({
    mutationFn: async () => {
      const metadata: Record<string, string> = {};

      if (state.eventData.metadata) {
        Object.assign(metadata, state.eventData.metadata);
      }

      metadata.language = language;
      metadata.participant_name = "";

      const event = await createEvent({
        template_id: state.selectedTemplateId!,
        event_name: state.eventData.eventName,
        location: state.eventData.location,
        event_date: new Date(
          state.eventData.eventDate,
        ).toISOString(),
        event_metadata: metadata,
      });

      const participants = state.guests.map((guest) => ({
        guest_name: guest.guestName,
        email: guest.email || undefined,
      }));

      await addParticipants(event.id, participants);

      return event;
    },

    onSuccess: handleFinish,
  });

  if (!template) {
    return (
      <div className="py-12 text-center">
        <p className="text-neutral-500">
          {language === "si"
            ? "ආරාධනා පත්‍රය හමු නොවීය. ආපසු ගොස් ආරාධනා පත්‍රයක් තෝරන්න."
            : "Template not found. Go back and select one."}
        </p>
      </div>
    );
  }

  return (
    <div lang={language === "si" ? "si" : "en"}>
      <h2 className="text-2xl font-bold text-neutral-900">
        {copy.reviewConfirm}
      </h2>

      <p className="mt-1 text-sm text-neutral-500">
        {copy.reviewHelp}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-neutral-700">
              {copy.eventDetails}
            </h3>

            <dl className="space-y-2 text-sm">
              <SummaryRow
                label={copy.name}
                value={state.eventData.eventName}
              />

              <SummaryRow
                label={copy.location}
                value={state.eventData.location}
              />

              <SummaryRow
                label={copy.date}
                value={
                  state.eventData.eventDate
                    ? formatReviewDate(
                        state.eventData.eventDate,
                        language,
                      )
                    : "-"
                }
              />

              <SummaryRow
                label={copy.category}
                value={categoryLabel(
                  state.eventData.category,
                  language,
                )}
              />

              <SummaryRow
                label={copy.template}
                value={template.name}
              />

              <SummaryRow
                label={copy.invitationLanguage}
                value={
                  language === "si"
                    ? "සිංහල"
                    : "English"
                }
              />
            </dl>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold text-neutral-700">
              {copy.guests} ({state.guests.length})
            </h3>

            {state.guests.length === 0 ? (
              <p className="text-sm text-neutral-400">
                {copy.noGuests}
              </p>
            ) : (
              <ul className="space-y-1">
                {state.guests.slice(0, 5).map((guest, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-neutral-700"
                  >
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-500" />
                    {guest.guestName}

                    {guest.email && (
                      <span className="text-neutral-400">
                        ({guest.email})
                      </span>
                    )}
                  </li>
                ))}

                {state.guests.length > 5 && (
                  <li className="text-sm text-neutral-400">
                    {language === "si"
                      ? `...තවත් ${state.guests.length - 5} දෙනෙක්`
                      : `...and ${state.guests.length - 5} more`}
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <p className="mb-3 text-sm font-medium text-neutral-700">
              {copy.invitationPreview}
            </p>

            <TemplateRenderer
              designSchema={template.design_schema}
              fieldData={previewFieldData}
              language={language}
            />
          </div>
        </div>
      </div>

      {mutation.isError && (
        <p className="mt-4 text-sm text-red-600">
          {(mutation.error as Error)?.message ??
            (language === "si"
              ? "උත්සවය සෑදීමට නොහැකි විය."
              : "Failed to create event.")}
        </p>
      )}

      {mutation.isSuccess && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-center">
          <p className="font-medium text-green-700">
            {copy.createdSuccessfully}
          </p>
        </div>
      )}

      <div className="flex justify-between pt-8">
        <button
          type="button"
          onClick={() => goToStep(3)}
          className="rounded-lg border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          {copy.back}
        </button>

        <button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
        >
          {mutation.isPending && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}

          {mutation.isPending
            ? copy.creating
            : copy.createEventInvitations}
        </button>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.ReactElement {
  return (
    <div className="flex gap-4">
      <dt className="w-28 shrink-0 text-neutral-500">
        {label}
      </dt>

      <dd className="min-w-0 flex-1 break-words text-right font-medium text-neutral-800">
        {value}
      </dd>
    </div>
  );
}
