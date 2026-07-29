import { useState } from "react";
import { Trash2, UserPlus, Upload } from "lucide-react";
import type { WizardState } from "./CreateEventWizard";

interface Props {
  state: WizardState;
  dispatch: React.Dispatch<any>;
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
      <h2 className="text-2xl font-bold text-neutral-900">Guest List</h2>
      <p className="mt-1 text-sm text-neutral-500">
        Add people you want to invite ({state.guests.length} added).
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Single add */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-700">Add a Guest</h3>
          <div>
            <label className="block text-xs font-medium text-neutral-500">Name</label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGuest())}
              className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              placeholder="Guest name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500">Email (optional)</label>
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGuest())}
              className="mt-1 block w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              placeholder="guest@example.com"
            />
          </div>
          <button
            type="button"
            onClick={addGuest}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Add Guest
          </button>
        </div>

        {/* Bulk add */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-700">Bulk Add</h3>
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            rows={5}
            className="block w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            placeholder={"John Doe\nJane Doe, jane@example.com\nBob Smith"}
          />
          <button
            type="button"
            onClick={addBulkGuests}
            className="inline-flex items-center gap-2 rounded-lg border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-brand-bg transition-colors"
          >
            <Upload className="h-4 w-4" />
            Add All
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {/* Guest list */}
      {state.guests.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-neutral-700 mb-3">
            Guests ({state.guests.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {state.guests.map((g, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-800">{g.guestName}</p>
                  {g.email && (
                    <p className="text-xs text-neutral-400">{g.email}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeGuest(i)}
                  className="text-neutral-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between pt-8">
        <button
          type="button"
          onClick={() => goToStep(2)}
          className="rounded-lg border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white hover:bg-brand/90 transition-colors"
        >
          Next: Review
        </button>
      </div>
    </div>
  );
}
