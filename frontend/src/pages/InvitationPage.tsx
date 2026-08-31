import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Navigation } from "lucide-react";

import { getInvitationByToken } from "../lib/api";

/* =========================================================
   OPENING ANIMATIONS
========================================================= */

import WeddingInvitation from "../components/templates/wedding/WeddingInvitation";
import BirthdayInvitation from "../components/templates/birthday/BirthdayInvitation";
import OfficeInvitation from "../components/templates/office/OfficeInvitation";

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
  formatInvitationDate,
  getInvitationCopy,
  normalizeInvitationLanguage,
  rsvpStatusLabel,
} from "../lib/invitationLanguage";


/* =========================================================
   INVITATION PAGE
========================================================= */

export function InvitationPage(): React.ReactElement {
  const { token } =
    useParams<{ token: string }>();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "invitation",
      token,
    ],

    queryFn: () =>
      getInvitationByToken(
        token!,
      ),

    enabled: !!token,
  });


  /* =====================================================
     LANGUAGE
  ====================================================== */

  const language =
    normalizeInvitationLanguage(
      data?.event?.event_metadata?.language,
    );

  const copy =
    getInvitationCopy(language);


  /* =====================================================
     FIELD DATA
  ====================================================== */

  const localizedFieldData =
    useMemo(() => {
      if (!data) {
        return {};
      }

      const next: Record<
        string,
        string | undefined
      > = {
        ...data.field_data,
      };


      next.event_date_time =
        formatInvitationDate(
          data.event.event_date,
          language,
        );


      if (
        "event_date" in next
      ) {
        next.event_date =
          formatInvitationDate(
            data.event.event_date,
            language,
          );
      }


      next.event_location =
        data.event.location ??
        undefined;


      next.event_name =
        data.event.event_name;


      next.participant_name =
        data.participant.guest_name;


      next.guest_name =
        data.participant.guest_name;


      return next;
    }, [
      data,
      language,
    ]);


  /* =====================================================
     LOADING
  ====================================================== */

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">

        <Loader2 className="h-8 w-8 animate-spin text-brand" />

      </div>
    );
  }


  /* =====================================================
     ERROR
  ====================================================== */

  if (
    isError ||
    !data
  ) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4">

        <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-8 text-center">

          <h1 className="text-lg font-semibold text-red-700">
            {copy.invitationNotFound}
          </h1>


          <p className="mt-2 text-sm text-red-600">
            {(error as Error)
              ?.message ??
              copy.invalidInvitation}
          </p>

        </div>
      </div>
    );
  }


  const {
    event,
    participant,
    template,
  } = data;


  /* =====================================================
     EVENT METADATA
  ====================================================== */

  const metadata =
    event.event_metadata ?? {};


  const brideName =
    localizedFieldData.bride_name ??
    localizedFieldData.brideName ??
    metadata.bride_name ??
    metadata.brideName ??
    "";


  const groomName =
    localizedFieldData.groom_name ??
    localizedFieldData.groomName ??
    metadata.groom_name ??
    metadata.groomName ??
    "";


  const birthdayPerson =
    localizedFieldData.birthday_person_name ??
    localizedFieldData.birthday_person ??
    localizedFieldData.birthdayPerson ??
    metadata.birthday_person_name ??
    metadata.birthdayPerson ??
    event.event_name;


  const age =
    localizedFieldData.age ??
    metadata.age ??
    "";


  const companyName =
    localizedFieldData.company_name ??
    localizedFieldData.companyName ??
    metadata.company_name ??
    metadata.companyName ??
    "";


  /* =====================================================
     ACTUAL SELECTED TEMPLATE
  ====================================================== */

  let actualTemplate:
    React.ReactNode;


  /* -----------------------------------------------------
     ENGLISH WEDDING
  ------------------------------------------------------ */

  if (
    template.name ===
    "English Wedding"
  ) {
    actualTemplate = (
      <WeddingInvitationTemplate
        eventName={
          event.event_name
        }
        location={
          event.location ?? ""
        }
        date={
          event.event_date
        }
        category="Wedding"
        language="en"
      />
    );
  }

  /* -----------------------------------------------------
     SINHALA WEDDING
  ------------------------------------------------------ */

  else if (
    template.name ===
    "Sinhala Wedding"
  ) {
    actualTemplate = (
      <SinhalaWeddingTemplate
        eventName={
          event.event_name
        }
        location={
          event.location ?? ""
        }
        date={
          event.event_date
        }
        category="Wedding"
        language="si"
      />
    );
  }

  /* -----------------------------------------------------
     ENGLISH BIRTHDAY
  ------------------------------------------------------ */

  else if (
    template.name ===
    "English Birthday"
  ) {
    actualTemplate = (
      <BirthdayInvitationTemplate
        eventName={
          event.event_name
        }
        birthdayPerson={
          birthdayPerson
        }
        age={
          age
        }
        location={
          event.location ?? ""
        }
        date={
          event.event_date
        }
        category="Birthday"
        language="en"
      />
    );
  }

  /* -----------------------------------------------------
     SINHALA BIRTHDAY
  ------------------------------------------------------ */

  else if (
    template.name ===
    "Sinhala Birthday"
  ) {
    actualTemplate = (
      <SinhalaBirthdayTemplate
        eventName={
          event.event_name
        }
        birthdayPerson={
          birthdayPerson
        }
        age={
          age
        }
        location={
          event.location ?? ""
        }
        date={
          event.event_date
        }
        category="Birthday"
        language="si"
      />
    );
  }

  /* -----------------------------------------------------
     ENGLISH OFFICE
  ------------------------------------------------------ */

  else if (
    template.name ===
    "English Office"
  ) {
    actualTemplate = (
      <OfficeInvitationTemplate
        eventName={
          event.event_name
        }
        companyName={
          companyName
        }
        location={
          event.location ?? ""
        }
        date={
          event.event_date
        }
        category="Technology"
        language="en"
      />
    );
  }

  /* -----------------------------------------------------
     SINHALA OFFICE
  ------------------------------------------------------ */

  else if (
    template.name ===
    "Sinhala Office"
  ) {
    actualTemplate = (
      <SinhalaOfficeInvitationTemplate
        eventName={
          event.event_name
        }
        companyName={
          companyName
        }
        location={
          event.location ?? ""
        }
        date={
          event.event_date
        }
        category="Office"
        language="si"
      />
    );
  }

  /* -----------------------------------------------------
     UNKNOWN TEMPLATE
  ------------------------------------------------------ */

  else {
    actualTemplate = (
      <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm">

        <p className="text-lg font-semibold text-neutral-800">
          Invitation
        </p>

        <p className="mt-2 text-sm text-neutral-500">
          Template not supported:
          {" "}
          {template.name}
        </p>

      </div>
    );
  }


  /* =====================================================
     RSVP SECTION
  ====================================================== */

  const rsvpSection = (
    <div className="mx-auto mt-8 w-full max-w-xl rounded-3xl border border-neutral-200 bg-white px-6 py-7 text-center shadow-xl">

      <p className="text-sm text-neutral-500">

        {copy.invitedAs}
        {" "}

        <span className="font-semibold text-neutral-900">
          {participant.guest_name}
        </span>

      </p>


      <p className="mt-2 text-xs text-neutral-400">

        {copy.rsvpStatus}
        :
        {" "}

        <span className="font-medium text-neutral-600">
          {rsvpStatusLabel(
            participant.rsvp_status,
            language,
          )}
        </span>

      </p>


      {participant.rsvp_status ===
        "pending" && (
        <div className="mt-6 flex flex-wrap justify-center gap-4">

          <button
            type="button"
            className="
              rounded-xl
              bg-brand
              px-7
              py-3
              text-sm
              font-semibold
              text-white
              shadow-lg
              shadow-brand/20
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-brand/90
              active:scale-[0.98]
            "
          >
            {copy.confirmAttendance}
          </button>


          <button
            type="button"
            className="
              rounded-xl
              border
              border-neutral-300
              bg-white
              px-7
              py-3
              text-sm
              font-semibold
              text-neutral-700
              transition-all
              duration-200
              hover:bg-neutral-50
              active:scale-[0.98]
            "
          >
            {copy.decline}
          </button>

        </div>
      )}


      {event.latitude != null &&
        event.longitude != null && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-brand
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              shadow-lg
              shadow-brand/20
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-brand/90
              active:scale-[0.98]
            "
          >

            <Navigation className="h-4 w-4" />

            Get Directions

          </a>
        )}


      <p className="mt-8 text-xs text-neutral-400">
        {copy.poweredBy}
      </p>

    </div>
  );


  /* =====================================================
     TEMPLATE + RSVP
  ====================================================== */

  const invitationContent = (
    <div className="mx-auto w-full max-w-[700px] px-4 py-8">

      {actualTemplate}

      {rsvpSection}

    </div>
  );


  /* =====================================================
     CATEGORY OPENING ANIMATION
  ====================================================== */

  const category =
    (
      template.category ??
      ""
    ).toLowerCase();


  let animatedInvitation:
    React.ReactNode;


  /* -----------------------------------------------------
     WEDDING
  ------------------------------------------------------ */

  if (
    category.includes(
      "wedding",
    )
  ) {
    animatedInvitation = (
      <WeddingInvitation
        guestName={
          participant.guest_name
        }
        brideName={
          brideName
        }
        groomName={
          groomName
        }
        date={formatInvitationDate(
          event.event_date,
          language,
        )}
        time={
          localizedFieldData.event_time ??
          localizedFieldData.time ??
          ""
        }
        location={
          event.location ??
          ""
        }
      >

        {invitationContent}

      </WeddingInvitation>
    );
  }

  /* -----------------------------------------------------
     BIRTHDAY
  ------------------------------------------------------ */

  else if (
    category.includes(
      "birthday",
    )
  ) {
    animatedInvitation = (
      <BirthdayInvitation
        guestName={
          participant.guest_name
        }
        birthdayPerson={
          birthdayPerson
        }
        age={
          age
        }
        date={formatInvitationDate(
          event.event_date,
          language,
        )}
        time={
          localizedFieldData.event_time ??
          localizedFieldData.time ??
          ""
        }
        location={
          event.location ??
          ""
        }
      >

        {invitationContent}

      </BirthdayInvitation>
    );
  }

  /* -----------------------------------------------------
     OFFICE
  ------------------------------------------------------ */

  else if (
    category.includes(
      "office",
    ) ||
    category.includes(
      "business",
    ) ||
    category.includes(
      "corporate",
    )
  ) {
    animatedInvitation = (
      <OfficeInvitation
        guestName={
          participant.guest_name
        }
        eventName={
          event.event_name
        }
        companyName={
          companyName
        }
        date={formatInvitationDate(
          event.event_date,
          language,
        )}
        time={
          localizedFieldData.event_time ??
          localizedFieldData.time ??
          ""
        }
        location={
          event.location ??
          ""
        }
      >

        {invitationContent}

      </OfficeInvitation>
    );
  }

  /* -----------------------------------------------------
     FALLBACK
  ------------------------------------------------------ */

  else {
    animatedInvitation = (
      <div className="min-h-screen bg-neutral-50">

        {invitationContent}

      </div>
    );
  }


  /* =====================================================
     FINAL PAGE
  ====================================================== */

  return (
    <div
      className="min-h-screen bg-neutral-50"
      lang={
        language === "si"
          ? "si"
          : "en"
      }
    >

      {animatedInvitation}

    </div>
  );
}