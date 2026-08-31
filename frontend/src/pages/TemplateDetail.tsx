import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
} from "lucide-react";

import { getTemplates } from "../lib/api";
import { Button } from "../components/ui/Button";

/* =========================================================
   ACTUAL CUSTOM TEMPLATES
========================================================= */

import WeddingInvitationTemplate from "../components/templates/wedding/WeddingInvitationTemplate";
import SinhalaWeddingTemplate from "../components/templates/wedding/SinhalaWeddingTemplate";

import BirthdayInvitationTemplate from "../components/templates/birthday/BirthdayInvitationTemplate";
import SinhalaBirthdayTemplate from "../components/templates/birthday/SinhalaBirthdayTemplate";

import OfficeInvitationTemplate from "../components/templates/office/OfficeInvitationTemplate";
import SinhalaOfficeInvitationTemplate from "../components/templates/office/SinhalaOfficeInvitationTemplate";

import type { Template } from "../types";


/* =========================================================
   CUSTOM TEMPLATE PREVIEW
========================================================= */

function ActualTemplatePreview({
  template,
}: {
  template: Template;
}): React.ReactElement {
  /* =====================================================
     ENGLISH WEDDING
  ====================================================== */

  if (template.name === "English Wedding") {
    return (
      <WeddingInvitationTemplate
        eventName="Kasun & Amali"
        location="The Grand Kandyan, Kandy"
        date="2026-12-20T16:30:00"
        category="Wedding"
        language="en"
      />
    );
  }


  /* =====================================================
     SINHALA WEDDING
  ====================================================== */

  if (template.name === "Sinhala Wedding") {
    return (
      <SinhalaWeddingTemplate
        eventName="කසුන් සහ නෙත්මි"
        location="The Grand Kandyan, Kandy"
        date="2026-12-20T16:30:00"
        category="Wedding"
        language="si"
      />
    );
  }


  /* =====================================================
     ENGLISH BIRTHDAY
  ====================================================== */

  if (template.name === "English Birthday") {
    return (
      <BirthdayInvitationTemplate
        eventName="Emma's Birthday Celebration"
        birthdayPerson="Emma"
        age="16"
        location="The Party Palace, Colombo"
        date="2026-08-08T19:00:00"
        category="Birthday"
        language="en"
      />
    );
  }


  /* =====================================================
     SINHALA BIRTHDAY
  ====================================================== */

  if (template.name === "Sinhala Birthday") {
    return (
      <SinhalaBirthdayTemplate
        eventName="නෙත්මිගේ උපන් දින සැමරුම"
        birthdayPerson="නෙත්මි"
        age="25"
        location="Colombo Rooftop Lounge"
        date="2026-07-18T18:30:00"
        category="Birthday"
        language="si"
      />
    );
  }


  /* =====================================================
     ENGLISH OFFICE
  ====================================================== */

  if (template.name === "English Office") {
    return (
      <OfficeInvitationTemplate
        eventName="Annual Innovation Summit 2026"
        companyName="Aurevia Technologies"
        location="Grand Conference Hall, Colombo"
        date="2026-08-21T09:30:00"
        category="Technology"
        language="en"
      />
    );
  }


  /* =====================================================
     SINHALA OFFICE
  ====================================================== */

  if (template.name === "Sinhala Office") {
    return (
      <SinhalaOfficeInvitationTemplate
        eventName="වාර්ෂික නවෝත්පාදන සමුළුව 2026"
        companyName="Aurevia Technologies"
        location="Grand Conference Hall, Colombo"
        date="2026-08-21T09:30:00"
        category="Office"
        language="si"
      />
    );
  }


  /* =====================================================
     FALLBACK
  ====================================================== */

  return (
    <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-neutral-200 bg-white p-10">
      <div className="text-center">
        <p className="text-lg font-semibold text-neutral-800">
          Template preview unavailable
        </p>

        <p className="mt-2 text-sm text-neutral-500">
          {template.name}
        </p>
      </div>
    </div>
  );
}


/* =========================================================
   TEMPLATE DETAIL PAGE
========================================================= */

export function TemplateDetail(): React.ReactElement {
  const { id } =
    useParams<{ id: string }>();

  const navigate =
    useNavigate();


  const {
    data: templates,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });


  const template =
    templates?.find(
      (item) =>
        item.id === id,
    );


  /* =====================================================
     LOADING
  ====================================================== */

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }


  /* =====================================================
     ERROR
  ====================================================== */

  if (
    isError ||
    !template
  ) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            navigate(
              "/templates",
            )
          }
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Templates
        </Button>


        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="font-medium text-red-700">
            {!template
              ? "Template not found"
              : (error as Error)
                    ?.message ??
                "Failed to load template."}
          </p>
        </div>
      </div>
    );
  }


  /* =====================================================
     MAIN PAGE
  ====================================================== */

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        {/* =================================================
            BACK BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={() =>
            navigate(
              "/templates",
            )
          }
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-neutral-200
            bg-white
            px-4
            py-2
            text-sm
            font-medium
            text-neutral-600
            shadow-sm
            transition-all
            duration-200
            hover:-translate-x-0.5
            hover:border-neutral-300
            hover:text-neutral-950
            hover:shadow-md
          "
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Templates
        </button>


        {/* =================================================
            HEADER
        ================================================== */}

        <div className="mx-auto mb-8 mt-8 max-w-3xl text-center">

          <span
            className="
              inline-flex
              rounded-full
              border
              border-violet-200
              bg-violet-50
              px-4
              py-1.5
              text-xs
              font-semibold
              uppercase
              tracking-[0.14em]
              text-violet-700
            "
          >
            {template.category}
          </span>


          <h1
            className="
              mt-4
              text-3xl
              font-bold
              tracking-tight
              text-neutral-950
              sm:text-4xl
            "
          >
            {template.name}
          </h1>


          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-500 sm:text-base">
            Preview this invitation design before using it
            for your event.
          </p>

        </div>


        {/* =================================================
            ACTUAL TEMPLATE
        ================================================== */}

        <section className="mx-auto flex max-w-[700px] justify-center">

          <div className="w-full">
            <ActualTemplatePreview
              template={template}
            />
          </div>

        </section>


        {/* =================================================
            USE TEMPLATE BUTTON
        ================================================== */}

        <div className="mx-auto mt-10 flex max-w-[700px] justify-center">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/create-event",
                {
                  state: {
                    templateId:
                      template.id,
                  },
                },
              )
            }
            className="
              inline-flex
              min-w-[240px]
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-gradient-to-r
              from-fuchsia-500
              via-violet-600
              to-indigo-600
              px-8
              py-4
              text-sm
              font-bold
              text-white
              shadow-[0_14px_40px_rgba(124,58,237,0.28)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-[0_20px_50px_rgba(124,58,237,0.35)]
              active:translate-y-0
            "
          >
            Use This Template

            <ExternalLink className="h-4 w-4" />
          </button>

        </div>


        <p className="mt-4 text-center text-xs text-neutral-400">
          Event details can be customized in the next step.
        </p>

      </div>
    </main>
  );
}