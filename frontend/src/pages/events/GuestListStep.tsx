import { useState } from "react";
import { Trash2, Upload, UserPlus } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import type { WizardAction, WizardState } from "./CreateEventWizard";

interface Props {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  goToStep: (step: number) => void;
}

export function GuestListStep({ state, dispatch, goToStep }: Props): React.ReactElement {
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [error, setError] = useState("");

  const addGuest = (): void => {
    const name = guestName.trim();
    if (!name) {
      setError("Guest name is required.");
      return;
    }
    dispatch({
      type: "ADD_GUESTS",
      payload: [{ guestName: name, email: guestEmail.trim() }],
    });
    setGuestName("");
    setGuestEmail("");
    setError("");
  };

  const addBulkGuests = (): void => {
    const lines = bulkText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) {
      setError("Paste at least one name.");
      return;
    }
    const guests = lines.map((line) => {
      const parts = line.split(",").map((s) => s.trim());
      return { guestName: parts[0], email: parts[1] ?? "" };
    });
    dispatch({ type: "ADD_GUESTS", payload: guests });
    setBulkText("");
    setError("");
  };

  const removeGuest = (index: number): void => {
    dispatch({ type: "REMOVE_GUEST", payload: index });
  };

  const handleNext = (): void => {
    if (state.guests.length === 0) {
      setError("Add at least one guest before continuing.");
      return;
    }
    goToStep(4);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Guest List</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Add people you want to invite to{" "}
        <span className="font-medium text-zinc-700">
          {state.eventData.eventName || "your event"}
        </span>{" "}
        ({state.guests.length} added).
      </p>

      <div className="mt-8 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm shadow-zinc-900/5 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Single add */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-700">Add a Guest</h3>
            <Input
              label="Name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGuest())}
              placeholder="Guest name"
            />
            <Input
              label="Email (optional)"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGuest())}
              placeholder="guest@example.com"
            />
            <Button type="button" onClick={addGuest}>
              <UserPlus className="h-4 w-4" />
              Add Guest
            </Button>
          </div>

          {/* Bulk add */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-700">Bulk Add</h3>
            <Textarea
              label="Paste guest list"
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={5}
              hint="One guest per line — Name, email"
              placeholder={"John Doe\nJane Doe, jane@example.com\nBob Smith"}
            />
            <Button type="button" variant="outline" onClick={addBulkGuests}>
              <Upload className="h-4 w-4" />
              Add All
            </Button>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {/* Guest list */}
        {state.guests.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-3 text-sm font-semibold text-zinc-700">
              Guests ({state.guests.length})
            </h3>
            <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {state.guests.map((g, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-zinc-50/50 px-4 py-2.5 transition-colors hover:bg-zinc-50"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-800">{g.guestName}</p>
                    {g.email && (
                      <p className="text-xs text-zinc-400">{g.email}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGuest(i)}
                    className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="Remove guest"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between border-t border-zinc-100 pt-6">
          <Button type="button" variant="outline" onClick={() => goToStep(2)}>
            Back
          </Button>
          <Button type="button" onClick={handleNext}>
            Continue to Review
          </Button>
        </div>
      </div>
    </div>
  );
}