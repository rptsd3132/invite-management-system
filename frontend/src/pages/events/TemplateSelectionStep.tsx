import { useMemo, useState } from "react";
import { TemplateRenderer } from "../../components/ui/TemplateRenderer";
import { Button } from "../../components/ui/Button";
import { useAllTemplates } from "../../hooks/useAllTemplates";
import { cn } from "../../lib/utils";
import type { WizardAction, WizardState } from "./CreateEventWizard";

interface Props {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  goToStep: (step: number) => void;
}

export function TemplateSelectionStep({ state, dispatch, goToStep }: Props): React.ReactElement {
  const { templates, isLoading } = useAllTemplates();

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
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Choose a Template</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Pick an invitation design for your {state.eventData.category} event.
      </p>

      {isLoading && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[3/4] rounded-xl bg-zinc-100 animate-pulse" />
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
              className={cn(
                "text-left rounded-2xl border-2 overflow-hidden bg-white shadow-sm shadow-zinc-900/5 transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/10",
                state.selectedTemplateId === tpl.id
                  ? "border-violet-500 ring-4 ring-violet-500/10"
                  : "border-zinc-200/80 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md",
              )}
            >
              <div className="aspect-[3/4] scale-[0.6] origin-top-left overflow-hidden pointer-events-none">
                <TemplateRenderer
                  designSchema={tpl.design_schema}
                  fieldData={{}}
                />
              </div>
              <div className="border-t border-zinc-100 p-2.5">
                <p className="truncate text-xs font-medium text-zinc-800">{tpl.name}</p>
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
            <p className="mb-3 text-sm font-medium text-zinc-700">Preview</p>
            <TemplateRenderer
              designSchema={selectedTemplate.design_schema}
              fieldData={previewFieldData}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between pt-8">
        <Button type="button" variant="outline" onClick={() => goToStep(1)}>
          Back
        </Button>
        <Button type="button" onClick={handleNext}>
          Next: Add Guests
        </Button>
      </div>
    </div>
  );
}