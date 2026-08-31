import { useMemo, useState } from "react";
<<<<<<< HEAD
import { TemplateRenderer } from "../../components/ui/TemplateRenderer";
import { Button } from "../../components/ui/Button";
import { useAllTemplates } from "../../hooks/useAllTemplates";
import { cn } from "../../lib/utils";
import type { WizardAction, WizardState } from "./CreateEventWizard";
=======
import { useQuery } from "@tanstack/react-query";

import { getTemplates } from "../../lib/api";
import { TemplateRenderer } from "../../components/ui/TemplateRenderer";
import { TemplateCard } from "../../components/TemplateCard";

import type { WizardState } from "./CreateEventWizard";
import { formatInvitationDate, getInvitationCopy } from "../../lib/invitationLanguage";
>>>>>>> main

interface Props {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  goToStep: (step: number) => void;
}

<<<<<<< HEAD
export function TemplateSelectionStep({ state, dispatch, goToStep }: Props): React.ReactElement {
  const { templates, isLoading } = useAllTemplates();
=======
export function TemplateSelectionStep({
  state,
  dispatch,
  goToStep,
}: Props): React.ReactElement {
  const { data: templates, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });
>>>>>>> main

  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    return (templates ?? []).filter(
      (template) => template.category === state.eventData.category,
    );
  }, [templates, state.eventData.category]);

  const weddingCount = useMemo(() => {
    return (templates ?? []).filter(
      (template) => template.category === "Wedding",
    ).length;
  }, [templates]);

  const birthdayCount = useMemo(() => {
    return (templates ?? []).filter(
      (template) => template.category === "Birthday",
    ).length;
  }, [templates]);

  const officeCount = useMemo(() => {
    return (templates ?? []).filter(
      (template) => template.category === "Office",
    ).length;
  }, [templates]);

  const selectedTemplate = useMemo(() => {
    return templates?.find(
      (template) => template.id === state.selectedTemplateId,
    );
  }, [templates, state.selectedTemplateId]);

  const previewFieldData: Record<string, string | undefined> =
    useMemo(() => {
      if (!selectedTemplate) return {};

      const data: Record<string, string | undefined> = {};

      for (const field of selectedTemplate.design_schema.required_fields) {
        if (field === "event_name") {
          data[field] = state.eventData.eventName || undefined;
        } else if (
          field === "event_location" ||
          field === "location"
        ) {
          data[field] = state.eventData.location || undefined;
        } else if (
          field === "event_date_time" ||
          field === "event_date"
        ) {
          data[field] = state.eventData.eventDate
            ? formatInvitationDate(
                state.eventData.eventDate,
                state.eventData.language,
              )
            : undefined;
        } else if (field === "participant_name") {
          data[field] = getInvitationCopy(state.eventData.language).guest;
        } else {
          data[field] =
            state.eventData.metadata?.[field] || undefined;
        }
      }

      return data;
    }, [selectedTemplate, state.eventData]);

  const handleSelect = (id: string): void => {
    dispatch({
      type: "SET_TEMPLATE",
      payload: id,
    });

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
<<<<<<< HEAD
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
=======
    <div className="mx-auto w-full max-w-[1500px]">
      {/* Header */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => goToStep(1)}
          className="
            mb-4
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-neutral-500
            transition-colors
            hover:text-neutral-900
          "
        >
          <span>←</span>
          Back to Create Event
        </button>

        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
              Choose a Template
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              Select a premium invitation design that best matches
              your {state.eventData.category} event.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              icon="✦"
              value={templates?.length ?? 0}
              label="Templates"
            />

            <StatCard
              icon="♛"
              value={weddingCount}
              label="Wedding"
            />

            <StatCard
              icon="🎂"
              value={birthdayCount}
              label="Birthday"
            />

            <StatCard
              icon="▣"
              value={officeCount}
              label="Office"
            />
          </div>
        </div>
      </div>

      {/* Category summary */}
      <div
        className="
          mb-8
          flex
          flex-col
          gap-3
          rounded-2xl
          border
          border-neutral-200
          bg-white
          p-3
          shadow-[0_8px_30px_rgba(15,23,42,0.06)]
          sm:flex-row
        "
      >
        <CategoryItem
          label="Wedding"
          count={weddingCount}
          active={state.eventData.category === "Wedding"}
          icon="♛"
        />

        <CategoryItem
          label="Birthday"
          count={birthdayCount}
          active={state.eventData.category === "Birthday"}
          icon="🎁"
        />

        <CategoryItem
          label="Office"
          count={officeCount}
          active={state.eventData.category === "Office"}
          icon="▣"
        />
      </div>

      <div
        className={`
          grid gap-8
          ${
            selectedTemplate
              ? "xl:grid-cols-[minmax(0,1fr)_390px]"
              : "grid-cols-1"
          }
        `}
      >
        {/* Templates */}
        <section>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="
                    aspect-[3/4]
                    animate-pulse
                    rounded-[22px]
                    bg-neutral-100
                  "
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-neutral-300
                bg-neutral-50
                px-6
                py-16
                text-center
              "
            >
              <p className="text-lg font-semibold text-neutral-800">
                No templates available
              </p>

              <p className="mt-2 text-sm text-neutral-500">
                No templates were found for this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((template, index) => (
                <TemplateCard
                  key={template.id}
                  category={template.category}
                  thumbnailUrl={template.thumbnail_url}
                  templateName={template.name}
                  index={index}
                  selected={
                    state.selectedTemplateId === template.id
                  }
                  onClick={() => handleSelect(template.id)}
                />
              ))}
            </div>
          )}

          {error && (
            <div
              className="
                mt-6
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-600
              "
            >
              {error}
            </div>
          )}
        </section>

        {/* Preview */}
        {selectedTemplate && (
          <aside className="xl:sticky xl:top-6 xl:self-start">
            <div
              className="
                overflow-hidden
                rounded-[24px]
                border
                border-neutral-200
                bg-white
                shadow-[0_20px_60px_rgba(15,23,42,0.10)]
              "
            >
              <div className="border-b border-neutral-100 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-neutral-900">
                      Preview
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      Live invitation preview
                    </p>
                  </div>

                  <span
                    className="
                      rounded-full
                      bg-brand/10
                      px-3
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-brand
                    "
                  >
                    Selected
                  </span>
                </div>
              </div>

              <div className="p-5">
                <TemplateRenderer
                  designSchema={selectedTemplate.design_schema}
                  fieldData={previewFieldData}
                  language={state.eventData.language}
                />
              </div>

              <div className="border-t border-neutral-100 px-5 py-4">
                <p className="truncate text-sm font-semibold text-neutral-900">
                  {selectedTemplate.name}
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  {selectedTemplate.category} Invitation · {state.eventData.language === "si" ? "සිංහල" : "English"}
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Navigation */}
      <div
        className="
          mt-10
          flex
          items-center
          justify-between
          border-t
          border-neutral-200
          pt-8
        "
      >
        <button
          type="button"
          onClick={() => goToStep(1)}
          className="
            rounded-xl
            border
            border-neutral-300
            bg-white
            px-6
            py-3
            text-sm
            font-semibold
            text-neutral-700
            shadow-sm
            transition-all
            hover:border-neutral-400
            hover:bg-neutral-50
          "
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="
            rounded-xl
            bg-brand
            px-7
            py-3
            text-sm
            font-semibold
            text-white
            shadow-[0_10px_30px_rgba(147,51,234,0.25)]
            transition-all
            hover:-translate-y-0.5
            hover:bg-brand/90
            hover:shadow-[0_14px_40px_rgba(147,51,234,0.30)]
          "
        >
          Next: Add Guests →
        </button>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: string;
  value: number;
  label: string;
}

function StatCard({
  icon,
  value,
  label,
}: StatCardProps): React.ReactElement {
  return (
    <div
      className="
        min-w-[115px]
        rounded-2xl
        border
        border-neutral-200
        bg-white
        px-4
        py-3
        shadow-[0_8px_25px_rgba(15,23,42,0.06)]
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-brand/10
            text-brand
          "
        >
          {icon}
        </div>

        <div>
          <p className="text-lg font-bold leading-none text-neutral-900">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-neutral-500">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

interface CategoryItemProps {
  label: string;
  count: number;
  active: boolean;
  icon: string;
}

function CategoryItem({
  label,
  count,
  active,
  icon,
}: CategoryItemProps): React.ReactElement {
  return (
    <div
      className={`
        flex
        flex-1
        items-center
        justify-center
        gap-3
        rounded-xl
        px-4
        py-3
        text-sm
        font-semibold
        transition-all
        ${
          active
            ? "bg-brand/10 text-brand shadow-sm"
            : "text-neutral-500"
        }
      `}
    >
      <span>{icon}</span>

      <span>{label}</span>

      <span
        className={`
          rounded-full
          px-2.5
          py-0.5
          text-xs
          ${
            active
              ? "bg-brand text-white"
              : "bg-neutral-100 text-neutral-500"
          }
        `}
      >
        {count}
      </span>
    </div>
  );
>>>>>>> main
}