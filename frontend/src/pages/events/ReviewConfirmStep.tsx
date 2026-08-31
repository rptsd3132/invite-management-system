import { useMemo, useState } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Check,
  CheckCircle,
  Clipboard,
  ExternalLink,
  Loader2,
  Save,
} from "lucide-react";

import {
  createEvent,
  addParticipants,
  createTemplate,
} from "../../lib/api";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAllTemplates } from "../../hooks/useAllTemplates";

/* =========================================================
   NEW CUSTOM INVITATION TEMPLATES
========================================================= */

import WeddingInvitationTemplate from "../../components/templates/wedding/WeddingInvitationTemplate";
import SinhalaWeddingTemplate from "../../components/templates/wedding/SinhalaWeddingTemplate";

import BirthdayInvitationTemplate from "../../components/templates/birthday/BirthdayInvitationTemplate";
import SinhalaBirthdayTemplate from "../../components/templates/birthday/SinhalaBirthdayTemplate";

import OfficeInvitationTemplate from "../../components/templates/office/OfficeInvitationTemplate";
import SinhalaOfficeInvitationTemplate from "../../components/templates/office/SinhalaOfficeInvitationTemplate";

import {
  categoryLabel,
  formatReviewDate,
  getInvitationCopy,
} from "../../lib/invitationLanguage";

import type {
  CreateTemplatePayload,
  EventResponse,
  ParticipantResponse,
} from "../../types";

import type {
  WizardAction,
  WizardState,
} from "./CreateEventWizard";


interface Props {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  goToStep: (step: number) => void;
  handleFinish: () => void;
}


function getInvitationUrl(token: string): string {
  return `${window.location.origin}/invitation/${token}`;
}


/* =========================================================
   CUSTOM TEMPLATE PREVIEW
========================================================= */

function CustomInvitationPreview({
  state,
  templateName,
}: {
  state: WizardState;
  templateName: string;
}): React.ReactElement {
  const metadata =
    state.eventData.metadata ?? {};

  const eventName =
    state.eventData.eventName;

  const location =
    state.eventData.location;

  const date =
    state.eventData.eventDate;

  /* =====================================================
     WEDDING ENGLISH
  ====================================================== */

  if (templateName === "English Wedding") {
    return (
      <WeddingInvitationTemplate
        eventName={eventName}
        location={location}
        date={date}
        category="Wedding"
        language="en"
      />
    );
  }

  /* =====================================================
     WEDDING SINHALA
  ====================================================== */

  if (templateName === "Sinhala Wedding") {
    return (
      <SinhalaWeddingTemplate
        eventName={eventName}
        location={location}
        date={date}
        category="Wedding"
        language="si"
      />
    );
  }

  /* =====================================================
     BIRTHDAY ENGLISH
  ====================================================== */

  if (templateName === "English Birthday") {
    return (
      <BirthdayInvitationTemplate
        eventName={eventName}
        birthdayPerson={
          metadata.birthday_person_name ||
          metadata.birthdayPerson ||
          eventName
        }
        age={
          metadata.age || ""
        }
        location={location}
        date={date}
        category="Birthday"
        language="en"
      />
    );
  }

  /* =====================================================
     BIRTHDAY SINHALA
  ====================================================== */

  if (templateName === "Sinhala Birthday") {
    return (
      <SinhalaBirthdayTemplate
        eventName={eventName}
        birthdayPerson={
          metadata.birthday_person_name ||
          metadata.birthdayPerson ||
          eventName
        }
        age={
          metadata.age || ""
        }
        location={location}
        date={date}
        category="Birthday"
        language="si"
      />
    );
  }

  /* =====================================================
     OFFICE ENGLISH
  ====================================================== */

  if (templateName === "English Office") {
    return (
      <OfficeInvitationTemplate
        eventName={eventName}
        companyName={
          metadata.company_name ||
          metadata.companyName ||
          ""
        }
        location={location}
        date={date}
        category="Technology"
        language="en"
      />
    );
  }

  /* =====================================================
     OFFICE SINHALA
  ====================================================== */

  if (templateName === "Sinhala Office") {
    return (
      <SinhalaOfficeInvitationTemplate
        eventName={eventName}
        companyName={
          metadata.company_name ||
          metadata.companyName ||
          ""
        }
        location={location}
        date={date}
        category="Office"
        language="si"
      />
    );
  }

  /* =====================================================
     FALLBACK
  ====================================================== */

  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center">
      <p className="text-sm font-medium text-neutral-600">
        Invitation preview unavailable.
      </p>

      <p className="mt-2 text-xs text-neutral-400">
        {templateName}
      </p>
    </div>
  );
}


/* =========================================================
   REVIEW CONFIRM STEP
========================================================= */

export function ReviewConfirmStep({
  state,
  goToStep,
  handleFinish,
}: Props): React.ReactElement {
  const language =
    state.eventData.language;

  const copy =
    getInvitationCopy(language);


  const [
    createdEvent,
    setCreatedEvent,
  ] = useState<EventResponse | null>(
    null,
  );


  const [
    createdParticipants,
    setCreatedParticipants,
  ] = useState<
    ParticipantResponse[]
  >([]);


  const [
    copiedToken,
    setCopiedToken,
  ] = useState<string | null>(
    null,
  );


  const [
    saveOpen,
    setSaveOpen,
  ] = useState(false);


  const [
    templateName,
    setTemplateName,
  ] = useState("");


  const [
    templateCategory,
    setTemplateCategory,
  ] = useState(
    state.eventData.category,
  );


  const [
    savedTemplateId,
    setSavedTemplateId,
  ] = useState<string | null>(
    null,
  );


  const queryClient =
    useQueryClient();


  const {
    templates,
    isLoading: templatesLoading,
  } = useAllTemplates();


  /* =====================================================
     SELECTED TEMPLATE
  ====================================================== */

  const template = useMemo(
    () =>
      templates?.find(
        (item) =>
          item.id ===
          state.selectedTemplateId,
      ),
    [
      templates,
      state.selectedTemplateId,
    ],
  );


  /* =====================================================
     CREATE EVENT
  ====================================================== */

  const mutation = useMutation({
    mutationFn: async (): Promise<{
      event: EventResponse;
      participants: ParticipantResponse[];
    }> => {
      const metadata: Record<
        string,
        string
      > = {};


      if (state.eventData.metadata) {
        Object.assign(
          metadata,
          state.eventData.metadata,
        );
      }


      metadata.language =
        language;

      metadata.participant_name =
        "";


      const event =
        await createEvent({
          template_id:
            state.selectedTemplateId!,

          event_name:
            state.eventData.eventName,

          location:
            state.eventData.location,

          event_date:
            new Date(
              state.eventData.eventDate,
            ).toISOString(),

          event_metadata:
            metadata,
        });


      const participants =
        await addParticipants(
          event.id,

          state.guests.map(
            (guest) => ({
              guest_name:
                guest.guestName,

              email:
                guest.email ||
                undefined,
            }),
          ),
        );


      return {
        event,
        participants,
      };
    },


    onSuccess: ({
      event,
      participants,
    }) => {
      setCreatedEvent(event);

      setCreatedParticipants(
        participants,
      );
    },
  });


  /* =====================================================
     SAVE TEMPLATE
  ====================================================== */

  const saveTemplateMutation =
    useMutation({
      mutationFn: (
        payload: CreateTemplatePayload,
      ) =>
        createTemplate(payload),


      onSuccess: (saved) => {
        setSavedTemplateId(
          saved.id,
        );

        setSaveOpen(false);


        void queryClient.invalidateQueries(
          {
            queryKey: [
              "templates",
            ],
          },
        );


        void queryClient.invalidateQueries(
          {
            queryKey: [
              "my-templates",
            ],
          },
        );
      },
    });


  function handleSaveTemplate(): void {
    if (
      !template ||
      !templateName.trim()
    ) {
      return;
    }


    saveTemplateMutation.mutate({
      name:
        templateName.trim(),

      category:
        templateCategory.trim() ||
        state.eventData.category,

      design_schema:
        template.design_schema,
    });
  }


  /* =====================================================
     COPY INVITATION LINK
  ====================================================== */

  async function handleCopy(
    token: string,
  ): Promise<void> {
    try {
      await navigator.clipboard.writeText(
        getInvitationUrl(token),
      );


      setCopiedToken(token);


      window.setTimeout(() => {
        setCopiedToken(
          (current) =>
            current === token
              ? null
              : current,
        );
      }, 2000);
    } catch {
      // Clipboard unavailable
    }
  }


  /* =====================================================
     LOADING
  ====================================================== */

  if (templatesLoading) {
    return (
      <div className="py-12 text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }


  /* =====================================================
     TEMPLATE NOT FOUND
  ====================================================== */

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
    <div
      lang={
        language === "si"
          ? "si"
          : "en"
      }
    >
      {/* ===================================================
          PAGE TITLE
      ==================================================== */}

      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
        {copy.reviewConfirm}
      </h2>


      <p className="mt-1 text-sm text-neutral-500">
        {copy.reviewHelp}
      </p>


      {/* ===================================================
          REVIEW CONTENT
      ==================================================== */}

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">

        {/* =================================================
            LEFT SIDE
        ================================================== */}

        <div className="space-y-4">

          {/* EVENT DETAILS */}

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm shadow-zinc-900/5">
            <h3 className="mb-3 text-sm font-semibold text-zinc-700">
              {copy.eventDetails}
            </h3>


            <dl className="space-y-2 text-sm">

              <SummaryRow
                label={copy.name}
                value={
                  state.eventData.eventName
                }
              />


              <SummaryRow
                label={copy.location}
                value={
                  state.eventData.location
                }
              />


              <SummaryRow
                label={copy.date}
                value={
                  state.eventData.eventDate
                    ? formatReviewDate(
                        state.eventData
                          .eventDate,
                        language,
                      )
                    : "-"
                }
              />


              <SummaryRow
                label={copy.category}
                value={categoryLabel(
                  state.eventData
                    .category,
                  language,
                )}
              />


              <SummaryRow
                label={copy.template}
                value={template.name}
              />


              <SummaryRow
                label={
                  copy.invitationLanguage
                }
                value={
                  language === "si"
                    ? "සිංහල"
                    : "English"
                }
              />

            </dl>
          </div>


          {/* =================================================
              GUESTS
          ================================================== */}

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm shadow-zinc-900/5">

            <h3 className="mb-3 text-sm font-semibold text-zinc-700">
              {copy.guests} (
              {state.guests.length})
            </h3>


            {state.guests.length ===
            0 ? (
              <p className="text-sm text-neutral-400">
                {copy.noGuests}
              </p>
            ) : (
              <ul className="space-y-1">

                {state.guests
                  .slice(0, 5)
                  .map(
                    (
                      guest,
                      index,
                    ) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm text-zinc-700"
                      >
                        <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-500" />

                        {
                          guest.guestName
                        }


                        {guest.email && (
                          <span className="text-zinc-400">
                            (
                            {
                              guest.email
                            }
                            )
                          </span>
                        )}

                      </li>
                    ),
                  )}


                {state.guests.length >
                  5 && (
                  <li className="text-sm text-neutral-400">
                    {language === "si"
                      ? `...තවත් ${
                          state.guests
                            .length - 5
                        } දෙනෙක්`
                      : `...and ${
                          state.guests
                            .length - 5
                        } more`}
                  </li>
                )}

              </ul>
            )}

          </div>
        </div>


        {/* =================================================
            ACTUAL INVITATION PREVIEW
        ================================================== */}

        <div className="flex justify-center">

          <div className="w-full max-w-[620px]">

            <p className="mb-3 text-sm font-medium text-zinc-700">
              {copy.invitationPreview}
            </p>


            <div className="overflow-hidden rounded-2xl">
              <CustomInvitationPreview
                state={state}
                templateName={
                  template.name
                }
              />
            </div>

          </div>
        </div>
      </div>


      {/* ===================================================
          ERROR
      ==================================================== */}

      {mutation.isError && (
        <p className="mt-4 text-sm text-red-600">
          {(mutation.error as Error)
            ?.message ??
            (language === "si"
              ? "උත්සවය සෑදීමට නොහැකි විය."
              : "Failed to create event.")}
        </p>
      )}


      {/* ===================================================
          SUCCESS
      ==================================================== */}

      {mutation.isSuccess &&
        createdEvent && (
          <div className="mt-8 space-y-4">

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

              <p className="font-medium text-emerald-700">
                {copy.createdSuccessfully}
              </p>


              <p className="mt-1 text-sm text-emerald-600">
                {language === "si"
                  ? "එක් එක් ආරාධිතයාගේ පුද්ගලික ආරාධනා සබැඳිය පහතින් ලබාගන්න."
                  : "Copy each guest's personalized invitation link below."}
              </p>

            </div>


            {/* =================================================
                PARTICIPANT LINKS TABLE
            ================================================== */}

            <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm shadow-zinc-900/5">

              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead>
                    <tr className="border-b border-zinc-100 text-left text-xs uppercase tracking-wide text-zinc-400">

                      <th className="px-4 py-3 font-semibold">
                        Guest
                      </th>

                      <th className="px-4 py-3 font-semibold">
                        Contact
                      </th>

                      <th className="px-4 py-3 font-semibold">
                        Personalized Link
                      </th>

                      <th className="px-4 py-3 text-right font-semibold">
                        Actions
                      </th>

                    </tr>
                  </thead>


                  <tbody>

                    {createdParticipants.map(
                      (
                        participant,
                      ) => {

                        const url =
                          getInvitationUrl(
                            participant.unique_link_token,
                          );


                        const isCopied =
                          copiedToken ===
                          participant.unique_link_token;


                        return (
                          <tr
                            key={
                              participant.id
                            }
                            className="border-b border-zinc-100 last:border-0"
                          >

                            <td className="px-4 py-3 font-medium text-zinc-800">
                              {
                                participant.guest_name
                              }
                            </td>


                            <td className="px-4 py-3 text-zinc-500">
                              {
                                participant.email ??
                                "—"
                              }
                            </td>


                            <td className="px-4 py-3">

                              <input
                                readOnly
                                value={url}
                                onFocus={(
                                  event,
                                ) =>
                                  event.currentTarget.select()
                                }
                                className="w-full min-w-64 rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2 font-mono text-xs text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                              />

                            </td>


                            <td className="px-4 py-3">

                              <div className="flex justify-end gap-2">

                                <button
                                  type="button"
                                  onClick={() =>
                                    void handleCopy(
                                      participant.unique_link_token,
                                    )
                                  }
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
                      },
                    )}

                  </tbody>
                </table>

              </div>
            </div>


            {/* =================================================
                SAVE TEMPLATE
            ================================================== */}

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


                {!saveOpen &&
                  !savedTemplateId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setSaveOpen(
                          true,
                        )
                      }
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

                  {(saveTemplateMutation.error as Error)
                    ?.message ??
                    "Failed to save template."}

                </p>
              )}


              {saveOpen && (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

                  <Input
                    label="Template name"
                    value={templateName}
                    onChange={(
                      event,
                    ) =>
                      setTemplateName(
                        event.target
                          .value,
                      )
                    }
                    placeholder={`${
                      template?.name ??
                      "My"
                    } design`}
                  />


                  <Input
                    label="Category"
                    value={
                      templateCategory
                    }
                    onChange={(
                      event,
                    ) =>
                      setTemplateCategory(
                        event.target
                          .value,
                      )
                    }
                  />


                  <div className="flex justify-end gap-2 sm:col-span-2">

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setSaveOpen(
                          false,
                        );

                        setSavedTemplateId(
                          null,
                        );
                      }}
                      disabled={
                        saveTemplateMutation.isPending
                      }
                    >
                      Cancel
                    </Button>


                    <Button
                      type="button"
                      onClick={
                        handleSaveTemplate
                      }
                      disabled={
                        saveTemplateMutation.isPending ||
                        !templateName.trim()
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
          </div>
        )}


      {/* ===================================================
          NAVIGATION
      ==================================================== */}

      <div className="flex justify-between pt-8">

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            goToStep(3)
          }
          disabled={
            mutation.isSuccess
          }
        >
          {copy.back}
        </Button>


        {mutation.isSuccess ? (
          <Button
            type="button"
            onClick={
              handleFinish
            }
          >
            <Check className="h-4 w-4" />

            Back to Dashboard
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() =>
              mutation.mutate()
            }
            disabled={
              mutation.isPending
            }
          >

            {mutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}


            {mutation.isPending
              ? copy.creating
              : copy.createEventInvitations}

          </Button>
        )}

      </div>
    </div>
  );
}


/* =========================================================
   SUMMARY ROW
========================================================= */

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