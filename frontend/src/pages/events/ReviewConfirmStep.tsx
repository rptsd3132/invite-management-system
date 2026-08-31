<<<<<<< HEAD
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  CheckCircle,
  Clipboard,
  ExternalLink,
  Loader2,
  Save,
} from "lucide-react";
import { createEvent, addParticipants, createTemplate } from "../../lib/api";
import { TemplateRenderer } from "../../components/ui/TemplateRenderer";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAllTemplates } from "../../hooks/useAllTemplates";
import type {
  CreateTemplatePayload,
  EventResponse,
  ParticipantResponse,
} from "../../types";
import type { WizardAction, WizardState } from "./CreateEventWizard";
=======
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
>>>>>>> main

interface Props {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  goToStep: (step: number) => void;
  handleFinish: () => void;
}

<<<<<<< HEAD
function getInvitationUrl(token: string): string {
  return `${window.location.origin}/invitation/${token}`;
}

export function ReviewConfirmStep({ state, goToStep, handleFinish }: Props): React.ReactElement {
  const [createdEvent, setCreatedEvent] = useState<EventResponse | null>(null);
  const [createdParticipants, setCreatedParticipants] = useState<
    ParticipantResponse[]
  >([]);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateCategory, setTemplateCategory] = useState(
    state.eventData.category,
  );
  const [savedTemplateId, setSavedTemplateId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { templates, isLoading: templatesLoading } = useAllTemplates();
=======
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
>>>>>>> main

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
    mutationFn: async (): Promise<{ event: EventResponse; participants: ParticipantResponse[] }> => {
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

<<<<<<< HEAD
      const participants = await addParticipants(
        event.id,
        state.guests.map((g) => ({
          guest_name: g.guestName,
          email: g.email || undefined,
        })),
      );
=======
      const participants = state.guests.map((guest) => ({
        guest_name: guest.guestName,
        email: guest.email || undefined,
      }));
>>>>>>> main

      return { event, participants };
    },
    onSuccess: ({ event, participants }) => {
      setCreatedEvent(event);
      setCreatedParticipants(participants);
    },
<<<<<<< HEAD
=======

    onSuccess: handleFinish,
>>>>>>> main
  });

  const saveTemplateMutation = useMutation({
    mutationFn: (payload: CreateTemplatePayload) => createTemplate(payload),
    onSuccess: (saved) => {
      setSavedTemplateId(saved.id);
      setSaveOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["templates"] });
      void queryClient.invalidateQueries({ queryKey: ["my-templates"] });
    },
  });

  function handleSaveTemplate(): void {
    if (!template || !templateName.trim()) return;
    saveTemplateMutation.mutate({
      name: templateName.trim(),
      category: templateCategory.trim() || state.eventData.category,
      design_schema: template.design_schema,
    });
  }

  async function handleCopy(token: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(getInvitationUrl(token));
      setCopiedToken(token);
      window.setTimeout(
        () => setCopiedToken((current) => (current === token ? null : current)),
        2000,
      );
    } catch {
      // Clipboard API unavailable; ignore.
    }
  }

  if (templatesLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-zinc-400" />
      </div>
    );
  }

  if (!template) {
    return (
<<<<<<< HEAD
      <div className="text-center py-12">
        <p className="text-zinc-500">Template not found. Go back and select one.</p>
=======
      <div className="py-12 text-center">
        <p className="text-neutral-500">
          {language === "si"
            ? "ආරාධනා පත්‍රය හමු නොවීය. ආපසු ගොස් ආරාධනා පත්‍රයක් තෝරන්න."
            : "Template not found. Go back and select one."}
        </p>
>>>>>>> main
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Review & Confirm</h2>
      <p className="mt-1 text-sm text-zinc-500">Verify everything looks correct before creating.</p>
=======
    <div lang={language === "si" ? "si" : "en"}>
      <h2 className="text-2xl font-bold text-neutral-900">
        {copy.reviewConfirm}
      </h2>
>>>>>>> main

      <p className="mt-1 text-sm text-neutral-500">
        {copy.reviewHelp}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
<<<<<<< HEAD
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm shadow-zinc-900/5">
            <h3 className="mb-3 text-sm font-semibold text-zinc-700">Event Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-500">Name</dt>
                <dd className="font-medium text-zinc-800">{state.eventData.eventName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Location</dt>
                <dd className="font-medium text-zinc-800">{state.eventData.location}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Date</dt>
                <dd className="font-medium text-zinc-800">
                  {state.eventData.eventDate
                    ? new Date(state.eventData.eventDate).toLocaleString()
                    : "-"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Category</dt>
                <dd className="font-medium text-zinc-800">{state.eventData.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Template</dt>
                <dd className="font-medium text-zinc-800">{template.name}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm shadow-zinc-900/5">
            <h3 className="mb-3 text-sm font-semibold text-zinc-700">
              Guests ({state.guests.length})
=======
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
>>>>>>> main
            </h3>

            {state.guests.length === 0 ? (
<<<<<<< HEAD
              <p className="text-sm text-zinc-400">No guests added.</p>
            ) : (
              <ul className="space-y-1">
                {state.guests.slice(0, 5).map((g, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-zinc-700">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    {g.guestName}
                    {g.email && (
                      <span className="text-zinc-400">({g.email})</span>
=======
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
>>>>>>> main
                    )}
                  </li>
                ))}

                {state.guests.length > 5 && (
<<<<<<< HEAD
                  <li className="text-sm text-zinc-400">
                    ...and {state.guests.length - 5} more
=======
                  <li className="text-sm text-neutral-400">
                    {language === "si"
                      ? `...තවත් ${state.guests.length - 5} දෙනෙක්`
                      : `...and ${state.guests.length - 5} more`}
>>>>>>> main
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-sm">
<<<<<<< HEAD
            <p className="mb-3 text-sm font-medium text-zinc-700">Invitation Preview</p>
=======
            <p className="mb-3 text-sm font-medium text-neutral-700">
              {copy.invitationPreview}
            </p>

>>>>>>> main
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

<<<<<<< HEAD
      {mutation.isSuccess && createdEvent && (
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="font-medium text-emerald-700">
              Event created successfully! Copy each guest&apos;s personalized link below.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm shadow-zinc-900/5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 text-left text-xs uppercase tracking-wide text-zinc-400">
                    <th className="px-4 py-3 font-semibold">Guest</th>
                    <th className="px-4 py-3 font-semibold">Contact</th>
                    <th className="px-4 py-3 font-semibold">Personalized Link</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {createdParticipants.map((p) => {
                    const url = getInvitationUrl(p.unique_link_token);
                    const isCopied = copiedToken === p.unique_link_token;
                    return (
                      <tr key={p.id} className="border-b border-zinc-100 last:border-0">
                        <td className="px-4 py-3 font-medium text-zinc-800">
                          {p.guest_name}
                        </td>
                        <td className="px-4 py-3 text-zinc-500">
                          {p.email ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            readOnly
                            value={url}
                            onFocus={(e) => e.currentTarget.select()}
                            className="w-full min-w-64 rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2 font-mono text-xs text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => void handleCopy(p.unique_link_token)}
                              title="Copy link"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50"
                            >
                              {isCopied ? (
                                <Check className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <Clipboard className="h-4 w-4" />
                              )}
                            </button>
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              title="Open invitation"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm shadow-zinc-900/5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-700">
                  Save this design as a template
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Reuse this invitation design for future events.
                </p>
              </div>
              {!saveOpen && !savedTemplateId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSaveOpen(true)}
                >
                  <Save className="h-4 w-4" />
                  Save as Template
                </Button>
              )}
            </div>

            {savedTemplateId && (
              <p className="mt-3 flex items-center gap-1.5 text-sm text-emerald-700">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Template saved! You can pick it when creating a new event.
              </p>
            )}

            {saveTemplateMutation.isError && (
              <p className="mt-3 text-sm text-red-600">
                {(saveTemplateMutation.error as Error)?.message ??
                  "Failed to save template."}
              </p>
            )}

            {saveOpen && (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  label="Template name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder={`${template?.name ?? "My"} design`}
                />
                <Input
                  label="Category"
                  value={templateCategory}
                  onChange={(e) => setTemplateCategory(e.target.value)}
                />
                <div className="flex justify-end gap-2 sm:col-span-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setSaveOpen(false);
                      setSavedTemplateId(null);
                    }}
                    disabled={saveTemplateMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveTemplate}
                    disabled={
                      saveTemplateMutation.isPending || !templateName.trim()
                    }
                  >
                    {saveTemplateMutation.isPending && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {saveTemplateMutation.isPending
                      ? "Saving..."
                      : "Save Template"}
                  </Button>
                </div>
              </div>
            )}
          </div>
=======
      {mutation.isSuccess && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-center">
          <p className="font-medium text-green-700">
            {copy.createdSuccessfully}
          </p>
>>>>>>> main
        </div>
      )}

      <div className="flex justify-between pt-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => goToStep(3)}
<<<<<<< HEAD
          disabled={mutation.isSuccess}
        >
          Back
        </Button>
        {mutation.isSuccess ? (
          <Button type="button" onClick={handleFinish}>
            <Check className="h-4 w-4" />
            Back to Dashboard
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {mutation.isPending ? "Creating..." : "Create Event & Invitations"}
          </Button>
        )}
      </div>
    </div>
  );
}
=======
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
>>>>>>> main
