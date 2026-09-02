import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getTemplates } from "../../lib/api";
import { TemplateCard } from "../../components/TemplateCard";

import KasunNethmiExactWeddingTemplate from "../../components/assets/wedding/KasunNethmiExactWeddingTemplate";
import SinhalaWeddingInvitationTemplate from "../../components/assets/wedding/SinhalaWeddingInvitationTemplate";

import EnglishBirthdayInvitationTemplate from "../../components/assets/birthday/EnglishBirthdayInvitationTemplate";
import SinhalaBirthdayInvitationTemplate from "../../components/assets/birthday/SinhalaBirthdayInvitationTemplate";

import EnglishCorporateGalaInvitationTemplate from "../../components/assets/office/EnglishCorporateGalaInvitationTemplate";
import SinhalaCorporateGalaInvitationTemplate from "../../components/assets/office/SinhalaCorporateGalaInvitationTemplate";

import type { WizardAction, WizardState } from "./CreateEventWizard";

interface Props {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  goToStep: (step: number) => void;
}

/* =========================================================
   ACTIVE TEMPLATES
   ========================================================= */

const ACTIVE_TEMPLATE_NAMES = new Set([
  "Kasun & Nethmi Wedding",
  "Sinhala Wedding",
  "English Birthday",
  "Sinhala Birthday",
  "English Office",
  "Sinhala Office",
]);

function normalizeTemplateName(value: string): string {
  return value.trim().toLowerCase();
}

function isActiveTemplate(name: string): boolean {
  const normalizedName = normalizeTemplateName(name);

  return Array.from(ACTIVE_TEMPLATE_NAMES).some(
    (activeName) =>
      normalizeTemplateName(activeName) === normalizedName,
  );
}

/* =========================================================
   TEMPLATE TYPE HELPERS
   ========================================================= */

function isSinhalaTemplate(name: string): boolean {
  return normalizeTemplateName(name).includes("sinhala");
}

function getTemplateKind(
  name: string,
  category: string,
):
  | "wedding-en"
  | "wedding-si"
  | "birthday-en"
  | "birthday-si"
  | "office-en"
  | "office-si" {
  const sinhala = isSinhalaTemplate(name);

  if (category === "Wedding") {
    return sinhala ? "wedding-si" : "wedding-en";
  }

  if (category === "Birthday") {
    return sinhala ? "birthday-si" : "birthday-en";
  }

  return sinhala ? "office-si" : "office-en";
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export function TemplateSelectionStep({
  state,
  dispatch,
  goToStep,
}: Props): React.ReactElement {
  const { data: templates, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

  const [error, setError] = useState("");

  /* =======================================================
     FILTER OLD DATABASE TEMPLATES
     ======================================================= */

  const activeTemplates = useMemo(() => {
    return (templates ?? []).filter((template) =>
      isActiveTemplate(template.name),
    );
  }, [templates]);

  /* =======================================================
     CURRENT CATEGORY TEMPLATES
     ======================================================= */

  const filtered = useMemo(() => {
    return activeTemplates.filter(
      (template) =>
        template.category === state.eventData.category,
    );
  }, [activeTemplates, state.eventData.category]);

  /* =======================================================
     COUNTS
     ======================================================= */

  const weddingCount = useMemo(() => {
    return activeTemplates.filter(
      (template) => template.category === "Wedding",
    ).length;
  }, [activeTemplates]);

  const birthdayCount = useMemo(() => {
    return activeTemplates.filter(
      (template) => template.category === "Birthday",
    ).length;
  }, [activeTemplates]);

  const officeCount = useMemo(() => {
    return activeTemplates.filter(
      (template) => template.category === "Office",
    ).length;
  }, [activeTemplates]);

  /* =======================================================
     SELECTED TEMPLATE
     ======================================================= */

  const selectedTemplate = useMemo(() => {
    return activeTemplates.find(
      (template) => template.id === state.selectedTemplateId,
    );
  }, [activeTemplates, state.selectedTemplateId]);

  /* =======================================================
     EVENT DATA FOR CUSTOM HTML/TW TEMPLATES
     ======================================================= */

  const eventName =
    state.eventData.eventName ||
    "Your Event";

  const location =
    state.eventData.location ||
    "Event Location";

  const eventDate =
    state.eventData.eventDate ||
    new Date().toISOString();

  const metadata =
    state.eventData.metadata ?? {};

  const brideName =
    metadata.bride_name ||
    "Bride";

  const groomName =
    metadata.groom_name ||
    "Groom";

  const birthdayPerson =
    metadata.birthday_person_name ||
    metadata.birthday_person ||
    "Birthday Star";

  const age =
    metadata.age ||
    "";

  const companyName =
    metadata.company_name ||
    metadata.host_name ||
    "";

  /* =======================================================
     SELECT TEMPLATE
     ======================================================= */

  const handleSelect = (id: string): void => {
    dispatch({
      type: "SET_TEMPLATE",
      payload: id,
    });

    const targetTemplate = activeTemplates.find((t) => t.id === id);
    if (targetTemplate) {
      const isSinhala = targetTemplate.name.toLowerCase().includes("sinhala");
      dispatch({
        type: "SET_EVENT_DATA",
        payload: {
          category: targetTemplate.category,
          language: isSinhala ? "si" : "en",
        },
      });
    }

    setError("");
  };

  /* =======================================================
     NEXT STEP
     ======================================================= */

  const handleNext = (): void => {
    if (!state.selectedTemplateId) {
      setError("Please select a template to continue.");
      return;
    }

    goToStep(2);
  };

  /* =======================================================
     CUSTOM TEMPLATE PREVIEW
     ======================================================= */

  const renderSelectedTemplate = (): React.ReactElement | null => {
    if (!selectedTemplate) {
      return null;
    }

    if (selectedTemplate.name === "Kasun & Nethmi Wedding") {
      return (
        <KasunNethmiExactWeddingTemplate
          eventName={eventName}
          groomName={groomName}
          brideName={brideName}
          location={location}
          date={eventDate}
          category="Wedding"
          language="en"
          compact
        />
      );
    }

    if (selectedTemplate.name === "Sinhala Wedding") {
      return (
        <SinhalaWeddingInvitationTemplate
          eventName={eventName}
          groomName={groomName}
          brideName={brideName}
          location={location}
          date={eventDate}
          category="මංගල ආරාධනා පත්‍රය"
          compact
        />
      );
    }

    const templateKind = getTemplateKind(
      selectedTemplate.name,
      selectedTemplate.category,
    );

    if (templateKind === "birthday-si") {
      return (
        <SinhalaBirthdayInvitationTemplate
          eventName={eventName}
          birthdayPerson={birthdayPerson}
          age={age}
          location={location}
          date={eventDate}
          category="Birthday"
          language="si"
          compact
        />
      );
    }

    if (templateKind === "birthday-en") {
      return (
        <EnglishBirthdayInvitationTemplate
          eventName={eventName}
          birthdayPerson={birthdayPerson}
          age={age}
          location={location}
          date={eventDate}
          category="Birthday"
          language="en"
          compact
        />
      );
    }

    if (templateKind === "office-si") {
      return (
        <SinhalaCorporateGalaInvitationTemplate
          eventName={eventName}
          companyName={companyName}
          location={location}
          date={eventDate}
          category="Office"
          language="si"
        />
      );
    }

    return (
      <EnglishCorporateGalaInvitationTemplate
        eventName={eventName}
        companyName={companyName}
        location={location}
        date={eventDate}
        category="Office"
        language="en"
          compact
      />
    );
  };

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div className="mx-auto w-full max-w-[1500px]">
      {/* Header */}

      <div className="mb-8">
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
              value={activeTemplates.length}
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
          onClick={() =>
            dispatch({
              type: "SET_EVENT_DATA",
              payload: { category: "Wedding" },
            })
          }
        />

        <CategoryItem
          label="Birthday"
          count={birthdayCount}
          active={state.eventData.category === "Birthday"}
          icon="🎁"
          onClick={() =>
            dispatch({
              type: "SET_EVENT_DATA",
              payload: { category: "Birthday" },
            })
          }
        />

        <CategoryItem
          label="Office"
          count={officeCount}
          active={state.eventData.category === "Office"}
          icon="▣"
          onClick={() =>
            dispatch({
              type: "SET_EVENT_DATA",
              payload: { category: "Office" },
            })
          }
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
        {/* ===================================================
            TEMPLATE LIST
        =================================================== */}

        <section>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
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
                No active templates were found for this category.
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

        {/* ===================================================
            CUSTOM HTML/TW PREVIEW
        =================================================== */}

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
              {/* Preview header */}

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

              {/* Actual custom template */}

              <div className="overflow-hidden bg-neutral-100">
                <div
                  className="
                    origin-top-left
                    [&>div]:min-h-0
                    [&>div]:p-0
                  "
                >
                  {renderSelectedTemplate()}
                </div>
              </div>

              {/* Preview footer */}

              <div className="border-t border-neutral-100 px-5 py-4">
                <p className="truncate text-sm font-semibold text-neutral-900">
                  {selectedTemplate.name}
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  {selectedTemplate.category} Invitation ·{" "}
                  {isSinhalaTemplate(selectedTemplate.name)
                    ? "සිංහල"
                    : "English"}
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <div
        className="
          mt-10
          flex
          items-center
          justify-end
          border-t
          border-neutral-200
          pt-8
        "
      >
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
          Next: Event Details →
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
   ========================================================= */

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

/* =========================================================
   CATEGORY ITEM
   ========================================================= */

interface CategoryItemProps {
  label: string;
  count: number;
  active: boolean;
  icon: string;
  onClick?: () => void;
}

function CategoryItem({
  label,
  count,
  active,
  icon,
  onClick,
}: CategoryItemProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
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
        cursor-pointer
        ${
          active
            ? "bg-brand/10 text-brand shadow-sm"
            : "text-neutral-500 hover:bg-neutral-100"
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
    </button>
  );
}