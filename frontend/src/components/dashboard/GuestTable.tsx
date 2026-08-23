import { useState } from "react";
import { Copy, Check, ExternalLink, Users } from "lucide-react";
import { Badge } from "../ui/Badge";
import type { EventDetailResponse } from "../../types";

interface GuestTableProps {
  event: EventDetailResponse;
}

function rsvpBadgeVariant(status: string): "success" | "danger" | "muted" {
  switch (status) {
    case "confirmed":
      return "success";
    case "declined":
      return "danger";
    default:
      return "muted";
  }
}

function rsvpLabel(status: string): string {
  switch (status) {
    case "confirmed":
      return "Attending";
    case "declined":
      return "Declined";
    default:
      return "Pending";
  }
}

export function GuestTable({ event }: GuestTableProps): React.ReactElement {
  const participants = event.participants ?? [];
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyLink = (token: string): void => {
    navigator.clipboard.writeText(
      `${window.location.origin}/invitation/${token}`,
    );
    setCopiedId(token);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (participants.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-100 bg-white p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <Users className="mx-auto h-10 w-10 text-zinc-300" />
        <p className="mt-3 text-sm font-medium text-zinc-500">
          No guests added yet
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          Add guests from the event creation wizard to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="max-h-[600px] overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-stone-100 bg-stone-50/80 backdrop-blur-sm">
            <tr>
              <th className="px-6 py-3.5 text-xs font-medium uppercase tracking-wider text-zinc-400">
                Guest Name
              </th>
              <th className="px-6 py-3.5 text-xs font-medium uppercase tracking-wider text-zinc-400">
                Invitation Link
              </th>
              <th className="px-6 py-3.5 text-xs font-medium uppercase tracking-wider text-zinc-400">
                RSVP Status
              </th>
              <th className="px-6 py-3.5 text-xs font-medium uppercase tracking-wider text-zinc-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {participants.map((p) => (
              <tr
                key={p.id}
                className="transition-colors hover:bg-stone-100/50"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-zinc-900">{p.guest_name}</p>
                  {p.email && (
                    <p className="text-xs text-zinc-400">{p.email}</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="max-w-[200px] truncate font-mono text-xs text-zinc-500">
                      {`${window.location.origin}/invitation/${p.unique_link_token}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyLink(p.unique_link_token)}
                      className="shrink-0 rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                      title="Copy invitation link"
                    >
                      {copiedId === p.unique_link_token ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={rsvpBadgeVariant(p.rsvp_status)}>
                    {rsvpLabel(p.rsvp_status)}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <a
                    href={`/invitation/${p.unique_link_token}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                    title="Open invitation"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
