import { useState } from "react";
import { Copy, Check, ExternalLink, Users, MessageSquare } from "lucide-react";
import type { EventDetailResponse } from "../../types";

interface GuestTableProps {
  event: EventDetailResponse;
}

function rsvpPill(status: string): React.ReactElement {
  switch (status) {
    case "accepted":
      return (
        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          Attending
        </span>
      );
    case "declined":
      return (
        <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700">
          Declined
        </span>
      );
    default:
      return (
        <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
          Pending
        </span>
      );
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
                Notes
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
                  {rsvpPill(p.rsvp_status)}
                </td>
                <td className="px-6 py-4">
                  {p.personal_note ? (
                    <span
                      className="inline-flex items-center gap-1.5 text-xs text-zinc-500"
                      title={p.personal_note}
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="max-w-[150px] truncate">
                        {p.personal_note}
                      </span>
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-300">—</span>
                  )}
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
