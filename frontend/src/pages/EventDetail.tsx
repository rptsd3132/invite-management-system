import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import { getEvent } from "../lib/api";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";

export function EventDetail(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: event, isLoading, isError, error } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEvent(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-neutral-100 rounded" />
          <div className="h-4 w-32 bg-neutral-100 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-neutral-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-red-700">
            {(error as Error)?.message ?? "Event not found."}
          </p>
        </div>
      </div>
    );
  }

  const copyLink = (token: string): void => {
    const url = `${window.location.origin}/invitation/${token}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      <div className="mt-6">
        <h1 className="text-3xl font-bold text-neutral-900">{event.event_name}</h1>
        <p className="mt-1 text-sm text-neutral-500">{event.location}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Date</p>
          <p className="mt-1 text-sm text-neutral-800">
            {new Date(event.event_date).toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Created</p>
          <p className="mt-1 text-sm text-neutral-800">
            {new Date(event.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {event.event_metadata && Object.keys(event.event_metadata).length > 0 && (
        <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-3">
            Event Details
          </p>
          <div className="space-y-2">
            {Object.entries(event.event_metadata).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-neutral-500">{key.replace(/_/g, " ")}</span>
                <span className="font-medium text-neutral-800">{value || "-"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Participants */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Participants ({event.participants?.length ?? 0})
        </h2>
        {(!event.participants || event.participants.length === 0) ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
            <p className="text-sm text-neutral-400">No participants added yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {event.participants.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-800">{p.guest_name}</p>
                  {p.email && (
                    <p className="text-xs text-neutral-400">{p.email}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      p.rsvp_status === "confirmed" && "bg-green-100 text-green-700",
                      p.rsvp_status === "declined" && "bg-red-100 text-red-700",
                      p.rsvp_status === "pending" && "bg-yellow-100 text-yellow-700",
                    )}
                  >
                    {p.rsvp_status}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyLink(p.unique_link_token)}
                    className="text-neutral-400 hover:text-brand transition-colors"
                    title="Copy invitation link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <a
                    href={`/invitation/${p.unique_link_token}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-brand transition-colors"
                    title="Open invitation"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
