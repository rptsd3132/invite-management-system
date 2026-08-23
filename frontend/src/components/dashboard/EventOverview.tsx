import { Users, UserCheck, UserX, MapPin, Calendar } from "lucide-react";
import type { EventDetailResponse } from "../../types";

interface EventOverviewProps {
  event: EventDetailResponse;
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  accent: "violet" | "emerald" | "red";
}): React.ReactElement {
  const accentStyles = {
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-center gap-3">
        <div className={`rounded-xl p-2.5 ${accentStyles[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          {label}
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
        {value}
      </p>
    </div>
  );
}

export function EventOverview({ event }: EventOverviewProps): React.ReactElement {
  const participants = event.participants ?? [];
  const totalInvited = participants.length;
  const attending = participants.filter((p) => p.rsvp_status === "confirmed").length;
  const declined = participants.filter((p) => p.rsvp_status === "declined").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard
          label="Total Invited"
          value={totalInvited}
          icon={Users}
          accent="violet"
        />
        <StatCard
          label="Attending"
          value={attending}
          icon={UserCheck}
          accent="emerald"
        />
        <StatCard
          label="Declined"
          value={declined}
          icon={UserX}
          accent="red"
        />
      </div>

      <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-stone-100 bg-white px-6 py-4 text-sm text-zinc-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-zinc-400" />
          {new Date(event.event_date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        {event.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-zinc-400" />
            {event.location}
          </span>
        )}
      </div>
    </div>
  );
}
