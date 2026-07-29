import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { getInvitationByToken } from "../lib/api";
import { TemplateRenderer } from "../components/ui/TemplateRenderer";

export function InvitationPage(): React.ReactElement {
  const { token } = useParams<{ token: string }>();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["invitation", token],
    queryFn: () => getInvitationByToken(token!),
    enabled: !!token,
  });

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
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center max-w-md">
          <h1 className="text-lg font-semibold text-red-700">Invitation Not Found</h1>
          <p className="mt-2 text-sm text-red-600">
            {(error as Error)?.message ?? "This invitation link is invalid or has expired."}
          </p>
        </div>
      </div>
    );
  }

  const { event, participant, template, field_data } = data;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 flex items-center justify-between">
          <span className="text-sm font-semibold text-neutral-800">Invitation</span>
          <span className="text-xs text-neutral-400">{event.event_name}</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-sm">
          <TemplateRenderer
            designSchema={template.design_schema}
            fieldData={field_data}
          />
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-500">
            You are invited as{" "}
            <span className="font-semibold text-neutral-800">
              {participant.guest_name}
            </span>
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            RSVP Status:{" "}
            <span className="font-medium capitalize">{participant.rsvp_status}</span>
          </p>
        </div>

        {participant.rsvp_status === "pending" && (
          <div className="mt-6 flex gap-4">
            <button
              type="button"
              className="rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white hover:bg-brand/90 transition-colors"
            >
              Confirm Attendance
            </button>
            <button
              type="button"
              className="rounded-lg border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Decline
            </button>
          </div>
        )}

        <p className="mt-12 text-xs text-neutral-400">
          Powered by Invite Management System
        </p>
      </main>
    </div>
  );
}
