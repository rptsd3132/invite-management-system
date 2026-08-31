import { useMemo, useState } from "react";

import { TemplateCard } from "../../components/TemplateCard";
import { useAllTemplates } from "../../hooks/useAllTemplates";

/* =========================================================
   ACTUAL INVITATION TEMPLATES
========================================================= */

import WeddingInvitationTemplate from "../../components/templates/wedding/WeddingInvitationTemplate";
import SinhalaWeddingTemplate from "../../components/templates/wedding/SinhalaWeddingTemplate";

import BirthdayInvitationTemplate from "../../components/templates/birthday/BirthdayInvitationTemplate";
import SinhalaBirthdayTemplate from "../../components/templates/birthday/SinhalaBirthdayTemplate";

import OfficeInvitationTemplate from "../../components/templates/office/OfficeInvitationTemplate";
import SinhalaOfficeInvitationTemplate from "../../components/templates/office/SinhalaOfficeInvitationTemplate";

import type {
  WizardAction,
  WizardState,
} from "./CreateEventWizard";

import {
  getInvitationCopy,
} from "../../lib/invitationLanguage";


interface Props {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  goToStep: (step: number) => void;
}


/* =========================================================
   ONLY OUR SIX NEW TEMPLATES
========================================================= */

const ACTIVE_TEMPLATE_NAMES = [
  "English Wedding",
  "Sinhala Wedding",
  "English Birthday",
  "Sinhala Birthday",
  "English Office",
  "Sinhala Office",
];


/* =========================================================
   ACTUAL TEMPLATE PREVIEW
========================================================= */

function ActualTemplatePreview({
  templateName,
  state,
}: {
  templateName: string;
  state: WizardState;
}): React.ReactElement {
  const metadata =
    state.eventData.metadata ?? {};

  const eventName =
    state.eventData.eventName || "";

  const location =
    state.eventData.location || "";

  const date =
    state.eventData.eventDate || "";


  /* =====================================================
     WEDDING - ENGLISH
  ====================================================== */

  if (
    templateName ===
    "English Wedding"
  ) {
    return (
      <WeddingInvitationTemplate
        eventName={eventName}
        location={location}
        date={date}
        category="Wedding"
        language="en"
      />
    );
  }


  /* =====================================================
     WEDDING - SINHALA
  ====================================================== */

  if (
    templateName ===
    "Sinhala Wedding"
  ) {
    return (
      <SinhalaWeddingTemplate
        eventName={eventName}
        location={location}
        date={date}
        category="Wedding"
        language="si"
      />
    );
  }


  /* =====================================================
     BIRTHDAY - ENGLISH
  ====================================================== */

  if (
    templateName ===
    "English Birthday"
  ) {
    return (
      <BirthdayInvitationTemplate
        eventName={eventName}
        birthdayPerson={
          metadata.birthday_person_name ||
          metadata.birthday_person ||
          metadata.birthdayPerson ||
          eventName
        }
        age={
          metadata.age || ""
        }
        location={location}
        date={date}
        category="Birthday"
        language="en"
      />
    );
  }


  /* =====================================================
     BIRTHDAY - SINHALA
  ====================================================== */

  if (
    templateName ===
    "Sinhala Birthday"
  ) {
    return (
      <SinhalaBirthdayTemplate
        eventName={eventName}
        birthdayPerson={
          metadata.birthday_person_name ||
          metadata.birthday_person ||
          metadata.birthdayPerson ||
          eventName
        }
        age={
          metadata.age || ""
        }
        location={location}
        date={date}
        category="Birthday"
        language="si"
      />
    );
  }


  /* =====================================================
     OFFICE - ENGLISH
  ====================================================== */

  if (
    templateName ===
    "English Office"
  ) {
    return (
      <OfficeInvitationTemplate
        eventName={eventName}
        companyName={
          metadata.company_name ||
          metadata.companyName ||
          ""
        }
        location={location}
        date={date}
        category="Technology"
        language="en"
      />
    );
  }


  /* =====================================================
     OFFICE - SINHALA
  ====================================================== */

  if (
    templateName ===
    "Sinhala Office"
  ) {
    return (
      <SinhalaOfficeInvitationTemplate
        eventName={eventName}
        companyName={
          metadata.company_name ||
          metadata.companyName ||
          ""
        }
        location={location}
        date={date}
        category="Office"
        language="si"
      />
    );
  }


  /* =====================================================
     FALLBACK
  ====================================================== */

  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center">
      <div>
        <p className="font-semibold text-neutral-800">
          Preview unavailable
        </p>

        <p className="mt-2 text-sm text-neutral-500">
          {templateName}
        </p>
      </div>
    </div>
  );
}


/* =========================================================
   TEMPLATE SELECTION STEP
========================================================= */

export function TemplateSelectionStep({
  state,
  dispatch,
  goToStep,
}: Props): React.ReactElement {
  const {
    templates,
    isLoading,
  } = useAllTemplates();

  const [
    error,
    setError,
  ] = useState("");

  const copy =
    getInvitationCopy(
      state.eventData.language,
    );


  /* =====================================================
     REMOVE OLD TEMPLATES
  ====================================================== */

  const activeTemplates =
    useMemo(() => {
      return (
        templates ?? []
      ).filter(
        (template) =>
          ACTIVE_TEMPLATE_NAMES.includes(
            template.name,
          ),
      );
    }, [
      templates,
    ]);


  /* =====================================================
     CURRENT CATEGORY TEMPLATES
  ====================================================== */

  const filtered =
    useMemo(() => {
      return activeTemplates.filter(
        (template) =>
          template.category ===
          state.eventData.category,
      );
    }, [
      activeTemplates,
      state.eventData.category,
    ]);


  /* =====================================================
     COUNTS
  ====================================================== */

  const weddingCount =
    useMemo(() => {
      return activeTemplates.filter(
        (template) =>
          template.category ===
          "Wedding",
      ).length;
    }, [
      activeTemplates,
    ]);


  const birthdayCount =
    useMemo(() => {
      return activeTemplates.filter(
        (template) =>
          template.category ===
          "Birthday",
      ).length;
    }, [
      activeTemplates,
    ]);


  const officeCount =
    useMemo(() => {
      return activeTemplates.filter(
        (template) =>
          template.category ===
          "Office",
      ).length;
    }, [
      activeTemplates,
    ]);


  /* =====================================================
     SELECTED TEMPLATE
  ====================================================== */

  const selectedTemplate =
    useMemo(() => {
      return activeTemplates.find(
        (template) =>
          template.id ===
          state.selectedTemplateId,
      );
    }, [
      activeTemplates,
      state.selectedTemplateId,
    ]);


  /* =====================================================
     SELECT TEMPLATE
  ====================================================== */

  const handleSelect = (
    id: string,
  ): void => {
    dispatch({
      type: "SET_TEMPLATE",
      payload: id,
    });

    setError("");
  };


  /* =====================================================
     NEXT
  ====================================================== */

  const handleNext =
    (): void => {
      if (
        !state.selectedTemplateId
      ) {
        setError(
          state.eventData.language === "si"
            ? "ඉදිරියට යාමට ආරාධනා පත්‍රයක් තෝරන්න."
            : "Please select a template to continue.",
        );

        return;
      }

      goToStep(3);
    };


  return (
    <div
      className="mx-auto w-full max-w-[1500px]"
      lang={
        state.eventData.language === "si"
          ? "si"
          : "en"
      }
    >

      {/* =================================================
          HEADER
      ================================================== */}

      <div className="mb-8">

        <button
          type="button"
          onClick={() =>
            goToStep(1)
          }
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

          {copy.back}
        </button>


        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">

          <div>

            <h2 className="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
              {state.eventData.language ===
              "si"
                ? "ආරාධනා පත්‍රයක් තෝරන්න"
                : "Choose a Template"}
            </h2>


            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              {state.eventData.language ===
              "si"
                ? `ඔබගේ ${state.eventData.category} උත්සවයට ගැළපෙන ආරාධනා නිර්මාණයක් තෝරන්න.`
                : `Select an invitation design for your ${state.eventData.category} event.`}
            </p>

          </div>


          {/* ===============================================
              COUNTS
          ================================================ */}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

            <StatCard
              icon="✦"
              value={
                activeTemplates.length
              }
              label="Templates"
            />

            <StatCard
              icon="♛"
              value={
                weddingCount
              }
              label="Wedding"
            />

            <StatCard
              icon="🎂"
              value={
                birthdayCount
              }
              label="Birthday"
            />

            <StatCard
              icon="▣"
              value={
                officeCount
              }
              label="Office"
            />

          </div>
        </div>
      </div>


      {/* =================================================
          CATEGORY SUMMARY
      ================================================== */}

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
          count={
            weddingCount
          }
          active={
            state.eventData.category ===
            "Wedding"
          }
          icon="♛"
        />


        <CategoryItem
          label="Birthday"
          count={
            birthdayCount
          }
          active={
            state.eventData.category ===
            "Birthday"
          }
          icon="🎁"
        />


        <CategoryItem
          label="Office"
          count={
            officeCount
          }
          active={
            state.eventData.category ===
            "Office"
          }
          icon="▣"
        />

      </div>


      {/* =================================================
          TEMPLATE GRID + ACTUAL PREVIEW
      ================================================== */}

      <div
        className={`
          grid
          gap-8
          ${
            selectedTemplate
              ? "xl:grid-cols-[minmax(0,1fr)_500px]"
              : "grid-cols-1"
          }
        `}
      >

        {/* =================================================
            TEMPLATE CARDS
        ================================================== */}

        <section>

          {isLoading ? (

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {[
                1,
                2,
              ].map(
                (item) => (

                  <div
                    key={
                      item
                    }
                    className="
                      aspect-[3/4]
                      animate-pulse
                      rounded-[22px]
                      bg-neutral-100
                    "
                  />

                ),
              )}

            </div>

          ) : filtered.length ===
            0 ? (

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
                {state.eventData.language ===
                "si"
                  ? "ආරාධනා පත්‍ර නොමැත"
                  : "No templates available"}
              </p>


              <p className="mt-2 text-sm text-neutral-500">
                {state.eventData.language ===
                "si"
                  ? "මෙම කාණ්ඩයට ආරාධනා පත්‍ර හමු නොවීය."
                  : "No templates were found for this category."}
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {filtered.map(
                (
                  template,
                  index,
                ) => (

                  <TemplateCard
                    key={
                      template.id
                    }
                    category={
                      template.category
                    }
                    thumbnailUrl={
                      template.thumbnail_url
                    }
                    templateName={
                      template.name
                    }
                    index={
                      index
                    }
                    selected={
                      state.selectedTemplateId ===
                      template.id
                    }
                    onClick={() =>
                      handleSelect(
                        template.id,
                      )
                    }
                  />

                ),
              )}

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


        {/* =================================================
            ACTUAL NEW TEMPLATE PREVIEW
        ================================================== */}

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

              {/* PREVIEW HEADER */}

              <div className="border-b border-neutral-100 px-6 py-5">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <p className="text-lg font-bold text-neutral-900">
                      {state.eventData.language ===
                      "si"
                        ? "පෙරදසුන"
                        : "Preview"}
                    </p>


                    <p className="mt-1 text-xs text-neutral-500">
                      {selectedTemplate.name}
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
                    {state.eventData.language ===
                    "si"
                      ? "තෝරා ඇත"
                      : "Selected"}
                  </span>

                </div>
              </div>


              {/* ===============================================
                  REAL TEMPLATE COMPONENT
              ================================================ */}

              <div className="bg-neutral-50 p-5">

                <div className="mx-auto w-full overflow-hidden rounded-2xl">

                  <ActualTemplatePreview
                    templateName={
                      selectedTemplate.name
                    }
                    state={
                      state
                    }
                  />

                </div>

              </div>


              {/* TEMPLATE NAME */}

              <div className="border-t border-neutral-100 px-5 py-4">

                <p className="truncate text-sm font-semibold text-neutral-900">
                  {selectedTemplate.name}
                </p>


                <p className="mt-1 text-xs text-neutral-500">
                  {selectedTemplate.category}
                  {" "}
                  Invitation
                  {" · "}
                  {selectedTemplate.name
                    .toLowerCase()
                    .includes(
                      "sinhala",
                    )
                    ? "සිංහල"
                    : "English"}
                </p>

              </div>

            </div>

          </aside>
        )}

      </div>


      {/* =================================================
          NAVIGATION
      ================================================== */}

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
          onClick={() =>
            goToStep(1)
          }
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
          ← {copy.back}
        </button>


        <button
          type="button"
          onClick={
            handleNext
          }
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
          {state.eventData.language ===
          "si"
            ? "ඊළඟ: ආරාධිතයන් එක් කරන්න →"
            : "Next: Add Guests →"}
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

      <span>
        {icon}
      </span>

      <span>
        {label}
      </span>

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
}