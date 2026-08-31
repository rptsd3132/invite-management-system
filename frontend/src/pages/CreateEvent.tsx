import { useMemo, useState } from "react";
import {
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";

import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import {
  ArrowLeft,
  Cake,
  CalendarDays,
  Heart,
  Loader2,
  MapPin,
  PartyPopper,
  Tag,
  User,
} from "lucide-react";

import {
  createEvent,
  getTemplates,
} from "../lib/api";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

import {
  LocationPicker,
} from "../components/events/LocationPicker";

import type {
  VenueLocation,
} from "../components/events/LocationPicker";

import { StudioCanvas } from "../components/events/StudioCanvas";

/* =========================================================
   ACTUAL INVITATION TEMPLATES
========================================================= */

import WeddingInvitationTemplate from "../components/templates/wedding/WeddingInvitationTemplate";
import SinhalaWeddingTemplate from "../components/templates/wedding/SinhalaWeddingTemplate";

import BirthdayInvitationTemplate from "../components/templates/birthday/BirthdayInvitationTemplate";
import SinhalaBirthdayTemplate from "../components/templates/birthday/SinhalaBirthdayTemplate";

import OfficeInvitationTemplate from "../components/templates/office/OfficeInvitationTemplate";
import SinhalaOfficeInvitationTemplate from "../components/templates/office/SinhalaOfficeInvitationTemplate";

import {
  fieldLabel,
  getInvitationCopy,
  type InvitationLanguage,
} from "../lib/invitationLanguage";

import type {
  CreateEventPayload,
  Template,
} from "../types";


/* =========================================================
   FIELD GROUPS
========================================================= */

const DATE_LABEL_FIELDS = [
  "event_date_time",
  "event_date",
];

const LOCATION_FIELDS = [
  "event_location",
  "location",
];

const NAME_FIELDS = [
  "event_name",
];


/* =========================================================
   FIELD HELPERS
========================================================= */

function formatFieldLabel(
  key: string,
  language: InvitationLanguage,
): string {
  return fieldLabel(
    key,
    language,
  );
}


function fieldIcon(
  field: string,
): React.ReactNode {
  if (
    DATE_LABEL_FIELDS.includes(
      field,
    )
  ) {
    return (
      <CalendarDays className="h-4 w-4" />
    );
  }


  if (
    LOCATION_FIELDS.includes(
      field,
    )
  ) {
    return (
      <MapPin className="h-4 w-4" />
    );
  }


  if (
    field === "event_name"
  ) {
    return (
      <PartyPopper className="h-4 w-4" />
    );
  }


  if (
    field === "participant_name" ||
    field === "guest_name"
  ) {
    return (
      <User className="h-4 w-4" />
    );
  }


  if (
    field.includes("bride") ||
    field.includes("groom")
  ) {
    return (
      <Heart className="h-4 w-4" />
    );
  }


  if (
    field.includes("birthday")
  ) {
    return (
      <Cake className="h-4 w-4" />
    );
  }


  return (
    <Tag className="h-4 w-4" />
  );
}


function inputType(
  field: string,
): string {
  if (
    DATE_LABEL_FIELDS.includes(
      field,
    )
  ) {
    return "datetime-local";
  }

  return "text";
}


/* =========================================================
   ACTUAL LIVE PREVIEW
========================================================= */

function ActualTemplatePreview({
  template,
  fieldValues,
}: {
  template: Template;
  fieldValues: Record<string, string>;
}): React.ReactElement {
  const eventName =
    fieldValues.event_name ||
    "";

  const location =
    fieldValues.event_location ||
    fieldValues.location ||
    "";

  const date =
    fieldValues.event_date_time ||
    fieldValues.event_date ||
    "";


  /* =====================================================
     ENGLISH WEDDING
  ====================================================== */

  if (
    template.name ===
    "English Wedding"
  ) {
    return (
      <WeddingInvitationTemplate
        eventName={
          eventName
        }
        location={
          location
        }
        date={
          date
        }
        category="Wedding"
        language="en"
      />
    );
  }


  /* =====================================================
     SINHALA WEDDING
  ====================================================== */

  if (
    template.name ===
    "Sinhala Wedding"
  ) {
    return (
      <SinhalaWeddingTemplate
        eventName={
          eventName
        }
        location={
          location
        }
        date={
          date
        }
        category="Wedding"
        language="si"
      />
    );
  }


  /* =====================================================
     ENGLISH BIRTHDAY
  ====================================================== */

  if (
    template.name ===
    "English Birthday"
  ) {
    return (
      <BirthdayInvitationTemplate
        eventName={
          eventName
        }
        birthdayPerson={
          fieldValues.birthday_person_name ||
          fieldValues.birthday_person ||
          ""
        }
        age={
          fieldValues.age ||
          ""
        }
        location={
          location
        }
        date={
          date
        }
        category="Birthday"
        language="en"
      />
    );
  }


  /* =====================================================
     SINHALA BIRTHDAY
  ====================================================== */

  if (
    template.name ===
    "Sinhala Birthday"
  ) {
    return (
      <SinhalaBirthdayTemplate
        eventName={
          eventName
        }
        birthdayPerson={
          fieldValues.birthday_person_name ||
          fieldValues.birthday_person ||
          ""
        }
        age={
          fieldValues.age ||
          ""
        }
        location={
          location
        }
        date={
          date
        }
        category="Birthday"
        language="si"
      />
    );
  }


  /* =====================================================
     ENGLISH OFFICE
  ====================================================== */

  if (
    template.name ===
    "English Office"
  ) {
    return (
      <OfficeInvitationTemplate
        eventName={
          eventName
        }
        companyName={
          fieldValues.company_name ||
          fieldValues.companyName ||
          ""
        }
        location={
          location
        }
        date={
          date
        }
        category="Technology"
        language="en"
      />
    );
  }


  /* =====================================================
     SINHALA OFFICE
  ====================================================== */

  if (
    template.name ===
    "Sinhala Office"
  ) {
    return (
      <SinhalaOfficeInvitationTemplate
        eventName={
          eventName
        }
        companyName={
          fieldValues.company_name ||
          fieldValues.companyName ||
          ""
        }
        location={
          location
        }
        date={
          date
        }
        category="Office"
        language="si"
      />
    );
  }


  /* =====================================================
     FALLBACK
  ====================================================== */

  return (
    <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-neutral-200 bg-white p-8 text-center">
      <div>
        <p className="font-semibold text-neutral-800">
          Preview unavailable
        </p>

        <p className="mt-2 text-sm text-neutral-500">
          {template.name}
        </p>
      </div>
    </div>
  );
}


/* =========================================================
   CREATE EVENT PAGE
========================================================= */

export function CreateEvent(): React.ReactElement {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    searchParams,
  ] = useSearchParams();


  /* =====================================================
     TEMPLATE ID
  ====================================================== */

  const templateId =
    (
      location.state as {
        templateId?: string;
      } | null
    )?.templateId ??
    searchParams.get(
      "templateId",
    ) ??
    "";


  /* =====================================================
     LOAD TEMPLATES
  ====================================================== */

  const {
    data: templates,
  } = useQuery({
    queryKey: [
      "templates",
    ],

    queryFn:
      getTemplates,
  });


  const template:
    | Template
    | undefined =
    useMemo(
      () =>
        templates?.find(
          (item) =>
            item.id ===
            templateId,
        ),
      [
        templates,
        templateId,
      ],
    );


  /* =====================================================
     LANGUAGE FROM TEMPLATE
  ====================================================== */

  const language:
    InvitationLanguage =
    template?.name
      .toLowerCase()
      .includes(
        "sinhala",
      )
      ? "si"
      : "en";


  const copy =
    getInvitationCopy(
      language,
    );


  /* =====================================================
     REQUIRED FIELDS
  ====================================================== */

  const requiredFields =
    useMemo(
      () =>
        template
          ?.design_schema
          .required_fields ??
        [],
      [
        template,
      ],
    );


  /* =====================================================
     STATE
  ====================================================== */

  const [
    fieldValues,
    setFieldValues,
  ] = useState<
    Record<
      string,
      string
    >
  >({});


  const [
    errors,
    setErrors,
  ] = useState<
    Record<
      string,
      string
    >
  >({});


  const [
    venue,
    setVenue,
  ] = useState<
    VenueLocation | null
  >(null);


  /* =====================================================
     SET FIELD
  ====================================================== */

  const setField = (
    field: string,
    value: string,
  ): void => {
    setFieldValues(
      (
        previous,
      ) => ({
        ...previous,
        [field]:
          value,
      }),
    );


    if (
      errors[field]
    ) {
      setErrors(
        (
          previous,
        ) => ({
          ...previous,
          [field]:
            "",
        }),
      );
    }
  };


  /* =====================================================
     VENUE CHANGE
  ====================================================== */

  const handleVenueChange = (
    nextLocation:
      VenueLocation,
  ): void => {
    setVenue(
      nextLocation,
    );


    const hasTypedLocation =
      Boolean(
        fieldValues[
          "event_location"
        ] ||
          fieldValues[
            "location"
          ],
      );


    if (
      !hasTypedLocation
    ) {
      if (
        requiredFields.includes(
          "event_location",
        )
      ) {
        setField(
          "event_location",
          nextLocation.address,
        );
      }

      else if (
        requiredFields.includes(
          "location",
        )
      ) {
        setField(
          "location",
          nextLocation.address,
        );
      }
    }
  };


  /* =====================================================
     VALIDATION
  ====================================================== */

  const validate =
    (): boolean => {
      const nextErrors:
        Record<
          string,
          string
        > = {};


      for (
        const field
        of requiredFields
      ) {
        if (
          !fieldValues[
            field
          ]?.trim()
        ) {
          nextErrors[
            field
          ] =
            language ===
            "si"
              ? `${formatFieldLabel(
                  field,
                  language,
                )} ${copy.required}`
              : `${formatFieldLabel(
                  field,
                  language,
                )} is required`;
        }
      }


      setErrors(
        nextErrors,
      );


      return (
        Object.keys(
          nextErrors,
        ).length ===
        0
      );
    };


  /* =====================================================
     CREATE EVENT MUTATION
  ====================================================== */

  const mutation =
    useMutation({
      mutationFn: (
        payload:
          CreateEventPayload,
      ) =>
        createEvent(
          payload,
        ),


      onSuccess:
        () => {
          navigate(
            "/dashboard",
          );
        },
    });


  /* =====================================================
     SUBMIT EVENT
  ====================================================== */

  const onSubmit = (
    event:
      React.FormEvent,
  ): void => {
    event.preventDefault();


    if (
      !validate()
    ) {
      return;
    }


    const metadata:
      Record<
        string,
        string
      > = {};


    for (
      const field
      of requiredFields
    ) {
      if (
        !NAME_FIELDS.includes(
          field,
        ) &&
        !LOCATION_FIELDS.includes(
          field,
        ) &&
        !DATE_LABEL_FIELDS.includes(
          field,
        )
      ) {
        metadata[
          field
        ] =
          fieldValues[
            field
          ] ??
          "";
      }
    }


    metadata.language =
      language;


    const dateValue =
      fieldValues[
        "event_date_time"
      ] ??
      fieldValues[
        "event_date"
      ];


    const typedLocation =
      fieldValues[
        "event_location"
      ] ??
      fieldValues[
        "location"
      ] ??
      "";


    const payload:
      CreateEventPayload =
    {
      template_id:
        templateId,

      event_name:
        fieldValues[
          "event_name"
        ] ??
        "",

      location:
        typedLocation.trim() ||
        venue?.address ||
        "",

      event_date:
        dateValue
          ? new Date(
              dateValue,
            ).toISOString()
          : new Date().toISOString(),

      address:
        venue?.address ??
        null,

      latitude:
        venue?.latitude ??
        null,

      longitude:
        venue?.longitude ??
        null,

      event_metadata:
        metadata,
    };


    mutation.mutate(
      payload,
    );
  };


  /* =====================================================
     NO TEMPLATE
  ====================================================== */

  if (
    !templateId
  ) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">

        <p className="text-zinc-500">
          No template selected.
        </p>


        <Button
          className="mt-4"
          onClick={() =>
            navigate(
              "/templates",
            )
          }
        >
          Browse Templates
        </Button>

      </div>
    );
  }


  /* =====================================================
     LOADING TEMPLATE
  ====================================================== */

  if (
    !template
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">

        <Loader2 className="h-8 w-8 animate-spin text-brand" />

      </div>
    );
  }


  /* =====================================================
     PAGE
  ====================================================== */

  return (
    <div
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      lang={
        language ===
        "si"
          ? "si"
          : "en"
      }
    >

      {/* =================================================
          BACK
      ================================================== */}

      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          navigate(-1)
        }
      >
        <ArrowLeft className="h-4 w-4" />

        {copy.back}
      </Button>


      {/* =================================================
          HEADER
      ================================================== */}

      <div className="mt-6">

        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          {copy.createEvent}
        </h1>


        <p className="mt-1 text-sm text-zinc-500">
          {language ===
          "si"
            ? "පහත විස්තර පුරවන්න. ආරාධනා පත්‍රයේ පෙරදසුන සජීවීව යාවත්කාලීන වේ."
            : "Fill in the details below. The invitation preview updates live."}
        </p>

      </div>


      {/* =================================================
          FORM
      ================================================== */}

      <form
        onSubmit={
          onSubmit
        }
        noValidate
        className="mt-8"
      >

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_500px] lg:gap-10">

          {/* =================================================
              LEFT FORM
          ================================================== */}

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm shadow-zinc-900/5 sm:p-8">

            {/* TEMPLATE HEADER */}

            <div className="border-b border-zinc-100 pb-5">

              <div className="flex flex-wrap items-center justify-between gap-3">

                <div>

                  <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                    {template.name}
                  </h2>


                  <p className="mt-1 text-sm text-zinc-500">
                    {language ===
                    "si"
                      ? "මෙම ආරාධනා පත්‍රයට අවශ්‍ය විස්තර පහතින් ඇතුළත් කරන්න."
                      : "Enter the details required for this invitation."}
                  </p>

                </div>


                <span
                  className="
                    rounded-full
                    border
                    border-violet-200
                    bg-violet-50
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-violet-700
                  "
                >
                  {language ===
                  "si"
                    ? "සිංහල"
                    : "English"}
                </span>

              </div>
            </div>


            {/* =================================================
                FIELDS
            ================================================== */}

            <div className="space-y-5 pt-6">

              {requiredFields.map(
                (
                  field,
                ) => (

                  <Input
                    key={
                      field
                    }
                    id={`field-${field}`}
                    type={
                      inputType(
                        field,
                      )
                    }
                    label={
                      formatFieldLabel(
                        field,
                        language,
                      )
                    }
                    leadingIcon={
                      fieldIcon(
                        field,
                      )
                    }
                    value={
                      fieldValues[
                        field
                      ] ??
                      ""
                    }
                    error={
                      errors[
                        field
                      ]
                    }
                    onChange={(
                      event,
                    ) =>
                      setField(
                        field,
                        event.target.value,
                      )
                    }
                  />

                ),
              )}


              {/* =================================================
                  LOCATION PICKER
              ================================================== */}

              <div className="border-t border-zinc-100 pt-5">

                <h3 className="text-sm font-semibold text-zinc-800">
                  {language ===
                  "si"
                    ? "උත්සව ස්ථානය"
                    : "Venue Location"}
                </h3>


                <p className="mb-4 mt-1 text-xs text-zinc-400">
                  {language ===
                  "si"
                    ? "ස්ථානය සොයන්න හෝ සිතියම මත ස්ථානයක් තෝරන්න."
                    : "Search for the venue or click the map to select the location."}
                </p>


                <LocationPicker
                  value={
                    venue
                  }
                  onChange={
                    handleVenueChange
                  }
                />

              </div>
            </div>


            {/* =================================================
                BUTTONS
            ================================================== */}

            <div className="mt-8 flex gap-3 border-t border-zinc-100 pt-6">

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate(
                    "/templates",
                  )
                }
              >
                {language ===
                "si"
                  ? "ආරාධනා පත්‍රය වෙනස් කරන්න"
                  : "Change Template"}
              </Button>


              <Button
                type="submit"
                disabled={
                  mutation.isPending
                }
                className="flex-1"
              >

                {mutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}


                {mutation.isPending
                  ? copy.creating
                  : copy.createEvent}

              </Button>
            </div>


            {/* =================================================
                ERROR
            ================================================== */}

            {mutation.isError && (
              <p className="mt-4 text-sm text-red-600">

                {(mutation.error as Error)
                  ?.message ??
                  (language ===
                  "si"
                    ? "උත්සවය සෑදීමට නොහැකි විය."
                    : "Failed to create event.")}

              </p>
            )}

          </div>


          {/* =================================================
              RIGHT - ACTUAL TEMPLATE LIVE PREVIEW
          ================================================== */}

          <div className="lg:sticky lg:top-24 lg:self-start">

            <div className="mb-3 flex items-center justify-between">

              <p className="text-sm font-medium text-zinc-700">
                {language ===
                "si"
                  ? "සජීවී පෙරදසුන"
                  : "Live Preview"}
              </p>


              <span className="text-xs text-zinc-400">
                {template.name}
              </span>

            </div>


            <StudioCanvas>

              <div className="w-full overflow-hidden rounded-2xl shadow-2xl shadow-zinc-900/20">

                <ActualTemplatePreview
                  template={
                    template
                  }
                  fieldValues={
                    fieldValues
                  }
                />

              </div>

            </StudioCanvas>

          </div>
        </div>
      </form>
    </div>
  );
}