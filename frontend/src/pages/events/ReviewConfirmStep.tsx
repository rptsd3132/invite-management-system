import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, Loader2 } from "lucide-react";
import { createEvent, addParticipants } from "../../lib/api";
import { resetEventState } from "../../store/useEventStore";
import { TemplateRenderer } from "../../components/ui/TemplateRenderer";
import KasunNethmiExactWeddingTemplate from "../../components/assets/wedding/KasunNethmiExactWeddingTemplate";
import SinhalaWeddingInvitationTemplate from "../../components/assets/wedding/SinhalaWeddingInvitationTemplate";
import EnglishBirthdayInvitationTemplate from "../../components/assets/birthday/EnglishBirthdayInvitationTemplate";
import SinhalaBirthdayInvitationTemplate from "../../components/assets/birthday/SinhalaBirthdayInvitationTemplate";
import EnglishCorporateGalaInvitationTemplate from "../../components/assets/office/EnglishCorporateGalaInvitationTemplate";
import SinhalaCorporateGalaInvitationTemplate from "../../components/assets/office/SinhalaCorporateGalaInvitationTemplate";
import { Button } from "../../components/ui/Button";
import { useAllTemplates } from "../../hooks/useAllTemplates";
import {
  formatInvitationDate,
  getInvitationCopy,
} from "../../lib/invitationLanguage";
import type { EventResponse, ParticipantResponse } from "../../types";
import type { WizardAction, WizardState } from "./CreateEventWizard";

interface Props {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  goToStep: (step: number) => void;
  handleFinish: () => void;
}

export function ReviewConfirmStep({ state, goToStep }: Props): React.ReactElement {
  const language = state.eventData.language;
  const copy = getInvitationCopy(language);
  const navigate = useNavigate();

  const { templates, isLoading: templatesLoading } = useAllTemplates();

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

  const renderInvitationPreview = (): React.ReactElement => {
    if (!template) {
      return <></>;
    }

    const eventName = state.eventData.eventName || "Your Event";
    const location = state.eventData.location || "Event Location";
    const eventDate = state.eventData.eventDate || new Date().toISOString();
    const metadata = state.eventData.metadata ?? {};
    const templateName = template.name;
    const birthdayPerson =
      metadata.birthday_person_name || metadata.birthday_person || "Birthday Star";
    const companyName = metadata.company_name || metadata.host_name || "";

    if (templateName === "Kasun & Nethmi Wedding") {
      return (
        <KasunNethmiExactWeddingTemplate
          eventName={eventName}
          groomName={metadata.groom_name || "Groom"}
          brideName={metadata.bride_name || "Bride"}
          location={location}
          date={eventDate}
          category="Wedding"
          language="en"
          compact
        />
      );
    }

    if (templateName === "Sinhala Wedding") {
      return (
        <SinhalaWeddingInvitationTemplate
          eventName={eventName}
          groomName={metadata.groom_name || "Groom"}
          brideName={metadata.bride_name || "Bride"}
          location={location}
          date={eventDate}
          category="මංගල ආරාධනා පත්‍රය"
          compact
        />
      );
    }

    if (templateName === "Sinhala Birthday") {
      return (
        <SinhalaBirthdayInvitationTemplate
          eventName={eventName}
          birthdayPerson={birthdayPerson}
          age={metadata.age || ""}
          location={location}
          date={eventDate}
          category="Birthday"
          language="si"
          compact
        />
      );
    }

    if (templateName === "English Birthday") {
      return (
        <EnglishBirthdayInvitationTemplate
          eventName={eventName}
          birthdayPerson={birthdayPerson}
          age={metadata.age || ""}
          location={location}
          date={eventDate}
          category="Birthday"
          language="en"
          compact
        />
      );
    }

    if (templateName === "Sinhala Office") {
      return (
        <SinhalaCorporateGalaInvitationTemplate
          eventName={eventName}
          companyName={companyName}
          location={location}
          date={eventDate}
          category="Office"
          language="si"
        />
      );
    }

    if (templateName === "English Office") {
      return (
        <EnglishCorporateGalaInvitationTemplate
          eventName={eventName}
          companyName={companyName}
          location={location}
          date={eventDate}
          category="Office"
          language="en"
          compact
        />
      );
    }

    return (
      <TemplateRenderer
        designSchema={template.design_schema}
        fieldData={previewFieldData}
        language={language}
      />
    );
  };

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
        address: state.eventData.location,
        latitude: state.eventData.latitude,
        longitude: state.eventData.longitude,
        event_metadata: metadata,
      });

      const participants = await addParticipants(
        event.id,
        state.guests.map((g) => ({
          guest_name: g.guestName,
          email: g.email || undefined,
        })),
      );

      return { event, participants };
    },
    onSuccess: ({ event, participants }) => {
      resetEventState();
      navigate("/success", {
        replace: true,
        state: { event, participants },
      });
    },
  });

  if (templatesLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-zinc-400" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">
          {language === "si"
            ? "ආරාධනා පත්‍රය හමු නොවීය. ආපසු ගොස් ආරාධනා පත්‍රයක් තෝරන්න."
            : "Template not found. Go back and select one."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Review & Confirm</h2>
      <p className="mt-1 text-sm text-zinc-500">Verify everything looks correct before creating.</p>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
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
            </h3>

            {state.guests.length === 0 ? (
              <p className="text-sm text-zinc-400">No guests added.</p>
            ) : (
              <ul className="space-y-1">
                {state.guests.slice(0, 5).map((g, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-zinc-700">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    {g.guestName}
                    {g.email && (
                      <span className="text-zinc-400">({g.email})</span>
                    )}
                  </li>
                ))}

                {state.guests.length > 5 && (
                  <li className="text-sm text-zinc-400">
                    ...and {state.guests.length - 5} more
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <p className="mb-3 text-sm font-medium text-zinc-700">Invitation Preview</p>
            {renderInvitationPreview()}
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

      <div className="flex justify-between pt-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => goToStep(3)}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {mutation.isPending ? "Creating..." : "Create Event & Invitations"}
        </Button>
      </div>
    </div>
  );
}
