import { useMemo } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { getTemplates } from "../lib/api";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";
import { resolveTemplateImage } from "../components/templates/templateImages";

import type { Template } from "../types";


/* =========================================================
   CATEGORY COLORS
========================================================= */

const categoryColors: Record<
  string,
  string
> = {
  Wedding:
    "bg-pink-100 text-pink-700 border-pink-200",

  Office:
    "bg-blue-100 text-blue-700 border-blue-200",

  Birthday:
    "bg-yellow-100 text-yellow-700 border-yellow-200",
};


/* =========================================================
   ONLY THESE SIX TEMPLATES WILL BE DISPLAYED
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
   TEMPLATE PREVIEW CARD
========================================================= */

function TemplatePreview({
  template,
}: {
  template: Template;
}): React.ReactElement {
  const navigate =
    useNavigate();


  const colorClass =
    categoryColors[
      template.category
    ] ??
    "bg-neutral-100 text-neutral-700 border-neutral-200";


  const rawSchema =
    template.design_schema as
      | {
          background_image?:
            | string
            | null;
        }
      | null
      | undefined;


  const thumbnailPath =
    template.thumbnail_url ??
    rawSchema?.background_image ??
    null;


  const imageSource =
    resolveTemplateImage(
      thumbnailPath,
    );


  return (
    <button
      type="button"
      onClick={() =>
        navigate(
          `/templates/${template.id}`,
        )
      }
      className="
        group
        w-full
        rounded-xl
        text-left
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-brand
        focus-visible:ring-offset-2
      "
    >
      <div
        className="
          overflow-hidden
          rounded-xl
          border
          border-neutral-200
          bg-white
          shadow-sm
          transition-all
          duration-300
          group-hover:-translate-y-1
          group-hover:shadow-xl
        "
      >
        {/* =================================================
            IMAGE
        ================================================== */}

        <div className="p-3">
          <div
            className="
              relative
              aspect-[3/4]
              w-full
              overflow-hidden
              rounded-lg
              bg-neutral-100
            "
          >
            {imageSource ? (
              <img
                src={imageSource}
                alt={template.name}
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  ease-out
                  group-hover:scale-[1.04]
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-full
                  w-full
                  items-center
                  justify-center
                  bg-neutral-100
                  px-4
                  text-center
                  text-sm
                  text-neutral-400
                "
              >
                No Preview
              </div>
            )}


            {/* DARK GRADIENT */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-black/25
                via-transparent
                to-transparent
              "
            />


            {/* HOVER EFFECT */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-0
                transition-opacity
                duration-300
                group-hover:bg-white/5
                group-hover:opacity-100
              "
            />
          </div>
        </div>


        {/* =================================================
            CARD INFORMATION
        ================================================== */}

        <div className="flex items-center justify-between gap-2 px-3 pb-3">

          <span
            className="
              min-w-0
              truncate
              text-sm
              font-medium
              text-neutral-800
            "
          >
            {template.name}
          </span>


          <span
            className={cn(
              "shrink-0 rounded-full border px-2 py-0.5 text-xs",
              colorClass,
            )}
          >
            {template.category}
          </span>

        </div>
      </div>
    </button>
  );
}


/* =========================================================
   MAIN TEMPLATES PAGE
========================================================= */

export function Templates(): React.ReactElement {
  const navigate =
    useNavigate();


  const [
    searchParams,
  ] = useSearchParams();


  const categoryFilter =
    searchParams.get(
      "category",
    );


  const {
    data: templates,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "templates",
    ],

    queryFn:
      getTemplates,
  });


  /* =====================================================
     REMOVE ALL OLD TEMPLATES
  ====================================================== */

  const activeTemplates =
    useMemo(() => {
      if (!templates) {
        return [];
      }


      return templates.filter(
        (template) =>
          ACTIVE_TEMPLATE_NAMES.includes(
            template.name,
          ),
      );
    }, [
      templates,
    ]);


  /* =====================================================
     FILTER BY CATEGORY
  ====================================================== */

  const filtered =
    useMemo(() => {
      if (
        !categoryFilter
      ) {
        return activeTemplates;
      }


      return activeTemplates.filter(
        (template) =>
          template.category ===
          categoryFilter,
      );
    }, [
      activeTemplates,
      categoryFilter,
    ]);


  /* =====================================================
     CATEGORY BUTTONS
  ====================================================== */

  const categories =
    useMemo(() => {
      return [
        ...new Set(
          activeTemplates.map(
            (template) =>
              template.category,
          ),
        ),
      ];
    }, [
      activeTemplates,
    ]);


  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* ===================================================
          HEADER
      ==================================================== */}

      <div className="mb-8 flex items-center gap-4">

        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            navigate("/")
          }
        >
          <ArrowLeft className="h-4 w-4" />

          Back
        </Button>


        <div>

          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">

            {categoryFilter
              ? categoryFilter
              : "All"}{" "}

            Templates

          </h1>


          <p className="mt-1 text-sm text-neutral-500">

            {categoryFilter
              ? `Showing ${
                  filtered.length
                } template${
                  filtered.length !==
                  1
                    ? "s"
                    : ""
                }`
              : `${
                  activeTemplates.length
                } template${
                  activeTemplates.length !==
                  1
                    ? "s"
                    : ""
                } available`}

          </p>

        </div>
      </div>


      {/* ===================================================
          CATEGORY FILTER BUTTONS
      ==================================================== */}

      {categories.length >
        1 &&
        !categoryFilter && (

        <div className="mb-6 flex flex-wrap gap-2">

          {categories.map(
            (category) => (

              <button
                key={category}
                type="button"
                onClick={() =>
                  navigate(
                    `/templates?category=${encodeURIComponent(
                      category,
                    )}`,
                  )
                }
                className={cn(
                  "rounded-full border px-3 py-1 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm",

                  categoryColors[
                    category
                  ] ??
                    "bg-neutral-100 text-neutral-700 border-neutral-200",
                )}
              >
                {category}
              </button>

            ),
          )}

        </div>
      )}


      {/* ===================================================
          LOADING
      ==================================================== */}

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

          {Array.from({
            length: 6,
          }).map(
            (
              _,
              index,
            ) => (

              <div
                key={index}
                className="
                  animate-pulse
                  overflow-hidden
                  rounded-xl
                  border
                  border-neutral-200
                  bg-white
                "
              >
                <div className="m-3 aspect-[3/4] rounded-lg bg-neutral-100" />

                <div className="space-y-2 p-3">

                  <div className="h-4 w-3/4 rounded bg-neutral-100" />

                  <div className="h-3 w-1/4 rounded bg-neutral-100" />

                </div>
              </div>

            ),
          )}

        </div>
      )}


      {/* ===================================================
          ERROR
      ==================================================== */}

      {isError && (
        <div
          className="
            flex
            flex-col
            items-center
            gap-4
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-8
            text-center
          "
        >

          <p className="text-red-700">

            {(error as Error)
              ?.message ??
              "Failed to load templates."}

          </p>


          <Button
            variant="outline"
            onClick={() =>
              refetch()
            }
          >
            Retry
          </Button>

        </div>
      )}


      {/* ===================================================
          NO TEMPLATES
      ==================================================== */}

      {!isLoading &&
        !isError &&
        filtered.length ===
          0 && (

        <div
          className="
            flex
            flex-col
            items-center
            gap-4
            rounded-xl
            border
            border-neutral-200
            bg-white
            p-12
            text-center
          "
        >

          <p className="text-lg font-medium text-neutral-600">
            No templates found
          </p>


          <p className="text-sm text-neutral-400">

            {categoryFilter
              ? `No active templates in the "${categoryFilter}" category.`
              : "No active templates are available."}

          </p>


          {categoryFilter && (
            <Button
              variant="outline"
              onClick={() =>
                navigate(
                  "/templates",
                )
              }
            >
              View All Templates
            </Button>
          )}

        </div>
      )}


      {/* ===================================================
          TEMPLATE GRID
      ==================================================== */}

      {!isLoading &&
        !isError &&
        filtered.length >
          0 && (

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

          {filtered.map(
            (template) => (

              <TemplatePreview
                key={
                  template.id
                }
                template={
                  template
                }
              />

            ),
          )}

        </div>
      )}

    </div>
  );
}