import { useState } from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import {
  Check,
  CheckCircle,
  Clipboard,
  ExternalLink,
  LayoutDashboard,
  Plus,
  Sparkles,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import type { EventResponse, ParticipantResponse } from "../types";

interface SuccessState {
  event: EventResponse;
  participants: ParticipantResponse[];
}

function getInvitationUrl(token: string): string {
  return `${window.location.origin}/invitation/${token}`;
}

export function EventSuccess(): React.ReactElement {
  const location = useLocation();
  const state = location.state as SuccessState | null;
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  if (!state?.event || !state?.participants) {
    return <Navigate to="/organizer" replace />;
  }

  const { event, participants } = state;

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

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900">
            Event Created Successfully
          </h1>

          <p className="mt-3 text-base text-zinc-500">
            Your invitations are ready to share with your guests.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-stone-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-violet-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Event Summary
            </h2>
          </div>

          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Name</dt>
              <dd className="font-medium text-zinc-900">{event.event_name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Date</dt>
              <dd className="font-medium text-zinc-900">
                {new Date(event.event_date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Location</dt>
              <dd className="font-medium text-zinc-900">{event.location}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Guests</dt>
              <dd className="font-medium text-zinc-900">{participants.length}</dd>
            </div>
          </dl>
        </div>

        {participants.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="border-b border-stone-100 px-6 py-4">
              <h3 className="text-sm font-semibold text-zinc-700">
                Personalized Invitation Links
              </h3>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-stone-50/80 backdrop-blur-sm">
                  <tr className="text-left text-xs uppercase tracking-wide text-zinc-400">
                    <th className="px-6 py-3 font-semibold">Guest</th>
                    <th className="px-6 py-3 font-semibold">Link</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {participants.map((p) => {
                    const url = getInvitationUrl(p.unique_link_token);
                    const isCopied = copiedToken === p.unique_link_token;
                    return (
                      <tr
                        key={p.id}
                        className="transition-colors hover:bg-stone-100/50"
                      >
                        <td className="px-6 py-3">
                          <p className="font-medium text-zinc-900">
                            {p.guest_name}
                          </p>
                          {p.email && (
                            <p className="text-xs text-zinc-400">{p.email}</p>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          <input
                            readOnly
                            value={url}
                            onFocus={(e) => e.currentTarget.select()}
                            className="w-full min-w-0 rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2 font-mono text-xs text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                          />
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => void handleCopy(p.unique_link_token)}
                              title="Copy link"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50"
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
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50"
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
        )}

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link to="/organizer">
            <Button>
              <LayoutDashboard className="h-4 w-4" />
              Manage Event
            </Button>
          </Link>

          <Link to="/templates">
            <Button variant="outline">
              <Plus className="h-4 w-4" />
              Create New Event
            </Button>
          </Link>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-400">
          All future edits can be made from the dashboard.
        </p>
      </div>
    </div>
  );
}
