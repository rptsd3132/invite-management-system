import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  BarChart3,
  Settings,
  Users,
  Plus,
  Trash2,
} from "lucide-react";
import { getEvents, getEvent, deleteEvent } from "../lib/api";
import { Button } from "../components/ui/Button";
import { EventOverview } from "../components/dashboard/EventOverview";
import { EventSettings } from "../components/dashboard/EventSettings";
import { GuestTable } from "../components/dashboard/GuestTable";
import { cn } from "../lib/utils";

type Tab = "overview" | "settings" | "guests";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "guests", label: "Guests", icon: Users },
];

export function OrganizerDashboard(): React.ReactElement {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const queryClient = useQueryClient();

  const {
    data: events = [],
    isLoading: eventsLoading,
    isError: eventsError,
    error: eventsErr,
  } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const effectiveId =
    selectedEventId ?? (events.length > 0 ? events[0].id : null);

  const {
    data: event,
    isLoading: eventLoading,
    isError: eventError,
    error: eventErr,
  } = useQuery({
    queryKey: ["event", effectiveId],
    queryFn: () => getEvent(effectiveId!),
    enabled: !!effectiveId,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err: Error) => {
      window.alert(err.message || "Failed to delete event. Please try again.");
    },
  });

  function handleDeleteEvent(eventId: string, eventName: string): void {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${eventName}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    if (selectedEventId === eventId) {
      setSelectedEventId(null);
    }

    deleteMutation.mutate(eventId);
  }

  if (eventsLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 rounded bg-stone-200" />
          <div className="h-12 w-full max-w-md rounded-xl bg-stone-200" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-stone-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (eventsError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-sm font-medium text-red-700">
            {(eventsErr as Error)?.message ?? "Failed to load events."}
          </p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-stone-100 bg-white p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">
            <Calendar className="h-7 w-7 text-violet-600" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-zinc-900">
            No events yet
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Create your first event to start managing invitations.
          </p>
          <Link to="/events/create">
            <Button className="mt-6">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        Organizer Dashboard
      </h1>

      <div className="mt-5 overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-100 bg-stone-50/80">
            <tr>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-zinc-400">
                Event
              </th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-zinc-400">
                Date
              </th>
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-zinc-400">
                Location
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {events.map((ev) => (
              <tr
                key={ev.id}
                onClick={() => {
                  setSelectedEventId(ev.id);
                  setActiveTab("overview");
                }}
                className={cn(
                  "cursor-pointer transition-colors hover:bg-stone-100/50",
                  effectiveId === ev.id && "bg-violet-50/50",
                )}
              >
                <td className="px-5 py-3.5 font-medium text-zinc-900">
                  {ev.event_name}
                </td>
                <td className="px-5 py-3.5 text-zinc-500">
                  {new Date(ev.event_date).toLocaleDateString()}
                </td>
                <td className="px-5 py-3.5 text-zinc-500">
                  {ev.location}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(ev.id, ev.event_name);
                    }}
                    disabled={deleteMutation.isPending}
                    className="inline-flex rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Delete event"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex gap-1 border-b border-stone-200">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={cn(
              "flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === key
                ? "border-b-2 border-violet-600 bg-white text-zinc-900"
                : "text-zinc-500 hover:text-zinc-700",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="py-6">
        {!effectiveId || eventLoading ? (
          <div className="animate-pulse space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-stone-200" />
              ))}
            </div>
          </div>
        ) : eventError || !event ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-sm font-medium text-red-700">
              {(eventErr as Error)?.message ?? "Failed to load event details."}
            </p>
          </div>
        ) : (
          <>
            {activeTab === "overview" && <EventOverview event={event} />}
            {activeTab === "settings" && <EventSettings event={event} />}
            {activeTab === "guests" && <GuestTable event={event} />}
          </>
        )}
      </div>
    </div>
  );
}
