import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTemplates } from "../../lib/api";
import { TemplateRenderer } from "../../components/ui/TemplateRenderer";
import type { WizardState } from "./CreateEventWizard";

interface Props {
  state: WizardState;
  dispatch: React.Dispatch<any>;
  goToStep: (step: number) => void;
}

export function TemplateSelectionStep({ state, dispatch, goToStep }: Props): React.ReactElement {
  const { data: templates, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

  const filtered = useMemo(
    () => (templates ?? []).filter((t) => t.category === state.eventData.category),
    [templates, state.eventData.category],
  );

  const [error, setError] = useState("");

  const previewFieldData: Record<string, string | undefined> = useMemo(() => {
    if (!state.selectedTemplateId) return {};
    const tpl = templates?.find((t) => t.id === state.selectedTemplateId);
    if (!tpl) return {};
    const data: Record<string, string | undefined> = {};
    for (const f of tpl.design_schema.required_fields) {
      if (f === "event_name") data[f] = state.eventData.eventName || undefined;
      else if (f === "event_location" || f === "location") data[f] = state.eventData.location || undefined;
      else if (f === "event_date_time" || f === "event_date") {
        data[f] = state.eventData.eventDate
          ? new Date(state.eventData.eventDate).toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })
          : undefined;
      } else if (f === "participant_name") {
        data[f] = "Guest";
      } else {
        data[f] = state.eventData.metadata[f] || undefined;
      }
    }
    return data;
  }, [state, templates]);

  const selectedTemplate = useMemo(
    () => templates?.find((t) => t.id === state.selectedTemplateId),
    [templates, state.selectedTemplateId],
  );

  const handleSelect = (id: string): void => {
    dispatch({ type: "SET_TEMPLATE", payload: id });
    setError("");
  };

  const handleNext = (): void => {
    if (!state.selectedTemplateId) {
      setError("Please select a template to continue.");
      return;
    }
    goToStep(3);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-neutral-900">Choose a Template</h2>
      <p className="mt-1 text-sm text-neutral-500">
        Pick an invitation design for your {state.eventData.category} event.
      </p>

      {isLoading && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[3/4] bg-neutral-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleSelect(tpl.id)}
              className={`text-left rounded-xl border-2 overflow-hidden transition-all ${
                state.selectedTemplateId === tpl.id
                  ? "border-brand ring-2 ring-brand/20"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <div className="aspect-[3/4] scale-[0.6] origin-top-left overflow-hidden pointer-events-none">
                <TemplateRenderer
                  designSchema={tpl.design_schema}
                  fieldData={{}}
                />
              </div>
              <div className="p-2 border-t border-neutral-100">
                <p className="text-xs font-medium text-neutral-800 truncate">{tpl.name}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {/* Live preview */}
      {selectedTemplate && (
        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-sm">
            <p className="text-sm font-medium text-neutral-700 mb-3">Preview</p>
            <TemplateRenderer
              designSchema={selectedTemplate.design_schema}
              fieldData={previewFieldData}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between pt-8">
        <button
          type="button"
          onClick={() => goToStep(1)}
          className="rounded-lg border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-white hover:bg-brand/90 transition-colors"
        >
          Next: Add Guests
        </button>
      </div>
    </div>
  );
}
