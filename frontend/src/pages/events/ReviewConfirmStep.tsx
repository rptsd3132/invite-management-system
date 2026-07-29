import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, CheckCircle } from "lucide-react";
import { createEvent, addParticipants, getTemplates } from "../../lib/api";
import { TemplateRenderer } from "../../components/ui/TemplateRenderer";
import type { WizardState } from "./CreateEventWizard";

interface Props {
  state: WizardState;
  dispatch: React.Dispatch<any>;
  goToStep: (step: number) => void;
  handleFinish: () => void;
}

export function ReviewConfirmStep({ state, goToStep, handleFinish }: Props): React.ReactElement {
  const { data: templates } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

  const template = useMemo(
    () => templates?.find((t) => t.id === state.selectedTemplateId),
    [templates, state.selectedTemplateId],
  );

  const previewFieldData = useMemo(() => {
    if (!template) return {};
    const data: Record<string, string | undefined> = {};
    for (const f of template.design_schema.required_fields) {
      if (f === "event_name") data[f] = state.eventData.eventName || undefined;
      else if (f === "event_location" || f === "location") data[f] = state.eventData.location || undefined;
      else if (f === "event_date_time" || f === "event_date") {
        data[f] = state.eventData.eventDate
          ? new Date(state.eventData.eventDate).toLocaleString("en-US", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
              hour: "numeric", minute: "2-digit",
            })
          : undefined;
      } else if (f === "participant_name") {
        data[f] = state.guests[0]?.guestName ?? "Guest";
      } else {
        data[f] = state.eventData.metadata[f] || undefined;
      }
    }
    return data;
  }, [state, template]);

  const mutation = useMutation({
    mutationFn: async () => {
      const metadata: Record<string, string> = {};
      if (state.eventData.metadata) {
        Object.assign(metadata, state.eventData.metadata);
      }
      metadata["participant_name"] = "";

      const event = await createEvent({
        template_id: state.selectedTemplateId!,
        event_name: state.eventData.eventName,
        location: state.eventData.location,
        event_date: new Date(state.eventData.eventDate).toISOString(),
        event_metadata: metadata,
      });

      const participants = state.guests.map((g) => ({
        guest_name: g.guestName,
        email: g.email || undefined,
      }));

      await addParticipants(event.id, participants);

      return event;
    },
    onSuccess: handleFinish,
  });

  if (!template) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">Template not found. Go back and select one.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-neutral-900">Review & Confirm</h2>
      <p className="mt-1 text-sm text-neutral-500">Verify everything looks correct before creating.</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Details summary */}
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">Event Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500">Name</dt>
                <dd className="font-medium text-neutral-800">{state.eventData.eventName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Location</dt>
                <dd className="font-medium text-neutral-800">{state.eventData.location}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Date</dt>
                <dd className="font-medium text-neutral-800">
                  {state.eventData.eventDate
                    ? new Date(state.eventData.eventDate).toLocaleString()
                    : "-"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Category</dt>
                <dd className="font-medium text-neutral-800">{state.eventData.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Template</dt>
                <dd className="font-medium text-neutral-800">{template.name}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">
              Guests ({state.guests.length})
            </h3>
            {state.guests.length === 0 ? (
              <p className="text-sm text-neutral-400">No guests added.</p>
            ) : (
              <ul className="space-y-1">
                {state.guests.slice(0, 5).map((g, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-neutral-700">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    {g.guestName}
                    {g.email && (
                      <span className="text-neutral-400">({g.email})</span>
                    )}
                  </li>
                ))}
                {state.guests.length > 5 && (
                  <li className="text-sm text-neutral-400">
                    ...and {state.guests.length - 5} more
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <p className="text-sm font-medium text-neutral-700 mb-3">Invitation Preview</p>
            <TemplateRenderer
              designSchema={template.design_schema}
              fieldData={previewFieldData}
            />
          </div>
        </div>
      </div>

      {mutation.isError && (
        <p className="mt-4 text-sm text-red-600">
          {(mutation.error as Error)?.message ?? "Failed to create event."}
        </p>
      )}

      {mutation.isSuccess && (
        <div className="mt-4 rounded-xl bg-green-50 border border-green-200 p-4 text-center">
          <p className="text-green-700 font-medium">Event created successfully!</p>
        </div>
      )}

      <div className="flex justify-between pt-8">
        <button
          type="button"
          onClick={() => goToStep(3)}
          className="rounded-lg border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-50 transition-colors"
        >
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {mutation.isPending ? "Creating..." : "Create Event & Invitations"}
        </button>
      </div>
    </div>
  );
}
