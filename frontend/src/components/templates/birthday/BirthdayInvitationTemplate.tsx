import type { ReactElement } from "react";

import birthdayTemplateImage from "./assets/Purple and Pink Watercolor Birthday Invitation.png";

interface BirthdayInvitationTemplateProps {
  eventName: string;
  birthdayPerson: string;
  age?: string;
  location: string;
  date: string;
  category?: string;
  language?: "en" | "si";
}

interface FormattedDate {
  dateText: string;
  timeText: string;
}

function formatBirthdayDate(value: string): FormattedDate {
  if (!value) {
    return {
      dateText: "",
      timeText: "",
    };
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    const parts = value.split(" at ");

    return {
      dateText: parts[0] ?? value,
      timeText: parts[1] ?? "",
    };
  }

  const dateText = parsedDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timeText = parsedDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return {
    dateText,
    timeText,
  };
}

export default function BirthdayInvitationTemplate({
  eventName,
  birthdayPerson,
  age = "",
  location,
  date,
  category = "Birthday",
  language = "en",
}: BirthdayInvitationTemplateProps): ReactElement {
  const { dateText, timeText } = formatBirthdayDate(date);

  const isSinhala = language === "si";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#f0e9ff] via-white to-[#ffeafb] px-3 py-6 sm:px-6 sm:py-10">
      {/* =====================================================
          MAIN BIRTHDAY CARD
      ====================================================== */}

      <div
        lang={isSinhala ? "si" : "en"}
        className="
          relative
          aspect-[1046/1536]
          w-full
          max-w-[560px]
          overflow-hidden
          rounded-[26px]
          bg-white
          shadow-[0_35px_100px_rgba(100,70,160,0.25)]
        "
        style={{
          fontFamily: isSinhala
            ? '"Noto Sans Sinhala", "Noto Sans", system-ui, sans-serif'
            : undefined,
        }}
      >
        {/* =====================================================
            BACKGROUND IMAGE
        ====================================================== */}

        <img
          src={birthdayTemplateImage}
          alt="Birthday invitation background"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* =====================================================
            LIGHT OVERLAY
        ====================================================== */}

        <div className="absolute inset-0 bg-white/[0.02]" />

        {/* =====================================================
            MAIN CONTENT SAFE AREA
        ====================================================== */}

        <div
          className="
            absolute
            left-[14%]
            right-[14%]
            top-[11%]
            z-10
            flex
            h-[57%]
            flex-col
            items-center
            text-center
          "
        >
          {/* CATEGORY */}

          <p
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.32em]
              text-[#7358a8]
              sm:text-xs
            "
          >
            {isSinhala ? "උපන් දින සැමරුම" : category}
          </p>

          {/* DECORATION */}

          <div className="mt-3 flex items-center gap-3">
            <span className="h-px w-10 bg-[#baa3da]" />

            <span className="text-base text-[#9b7ac7] sm:text-lg">
              ✦
            </span>

            <span className="h-px w-10 bg-[#baa3da]" />
          </div>

          {/* INVITATION MESSAGE */}

          <p
            className="
              mt-4
              max-w-[92%]
              text-xs
              font-semibold
              leading-relaxed
              text-[#8066a7]
              sm:text-base
              md:text-lg
            "
          >
            {isSinhala
              ? "අප සමඟ මෙම විශේෂ උපන් දින සැමරුමට එක්වන්න"
              : "Join us for a very special birthday celebration"}
          </p>

          {/* BIRTHDAY PERSON */}

          <h1
            className="
              mt-4
              max-w-full
              break-words
              text-3xl
              font-black
              leading-tight
              text-[#67458f]
              sm:text-4xl
              md:text-5xl
            "
          >
            {birthdayPerson}
          </h1>

          {/* AGE */}

          {age && (
            <div
              className="
                mt-3
                rounded-full
                border
                border-purple-200/80
                bg-white/75
                px-5
                py-2
                shadow-sm
                backdrop-blur-sm
              "
            >
              <p className="text-xs font-bold text-[#9b5fab] sm:text-sm">
                {isSinhala
                  ? `${age} වන උපන් දිනය`
                  : `Turning ${age}`}
              </p>
            </div>
          )}

          {/* EVENT NAME */}

          <p
            className="
              mt-4
              max-w-[95%]
              break-words
              text-sm
              font-bold
              leading-relaxed
              text-[#8c69ad]
              sm:text-lg
            "
          >
            {eventName}
          </p>

          {/* DIVIDER */}

          <div className="my-4 flex items-center justify-center sm:my-5">
            <span className="h-px w-14 bg-[#cdb8e5] sm:w-16" />

            <span className="mx-3 text-[#a681cf]">
              ❦
            </span>

            <span className="h-px w-14 bg-[#cdb8e5] sm:w-16" />
          </div>

          {/* =====================================================
              DATE + TIME
          ====================================================== */}

          <div className="grid w-full grid-cols-2 gap-3 sm:gap-4">
            {/* DATE */}

            <div
              className="
                rounded-xl
                border
                border-purple-200/70
                bg-white/75
                px-2
                py-2
                shadow-sm
                backdrop-blur-[2px]
                sm:rounded-2xl
                sm:px-3
                sm:py-3
              "
            >
              <p
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[#aa88c8]
                  sm:text-xs
                "
              >
                {isSinhala ? "දිනය" : "Date"}
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  font-semibold
                  leading-relaxed
                  text-[#6e528e]
                  sm:text-sm
                "
              >
                {dateText}
              </p>
            </div>

            {/* TIME */}

            <div
              className="
                rounded-xl
                border
                border-pink-200/70
                bg-white/75
                px-2
                py-2
                shadow-sm
                backdrop-blur-[2px]
                sm:rounded-2xl
                sm:px-3
                sm:py-3
              "
            >
              <p
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[#bd82ad]
                  sm:text-xs
                "
              >
                {isSinhala ? "වේලාව" : "Time"}
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  font-semibold
                  text-[#76538f]
                  sm:text-sm
                "
              >
                {timeText}
              </p>
            </div>
          </div>

          {/* =====================================================
              LOCATION
          ====================================================== */}

          {location && (
            <div
              className="
                mt-3
                w-full
                rounded-xl
                border
                border-purple-200/70
                bg-white/75
                px-3
                py-2
                shadow-sm
                backdrop-blur-[2px]
                sm:mt-4
                sm:rounded-2xl
                sm:px-4
                sm:py-3
              "
            >
              <p
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[#a686bf]
                  sm:text-xs
                "
              >
                {isSinhala ? "ස්ථානය" : "Location"}
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  font-semibold
                  leading-relaxed
                  text-[#705486]
                  sm:text-sm
                "
              >
                {location}
              </p>
            </div>
          )}

          {/* =====================================================
              BOTTOM MESSAGE
          ====================================================== */}

          <p
            className="
              mt-4
              max-w-[94%]
              text-[9px]
              font-medium
              leading-relaxed
              text-[#9576aa]
              sm:text-xs
            "
          >
            {isSinhala
              ? "ඔබගේ පැමිණීම මෙම සැමරුම තවත් සුන්දර කරනු ඇත."
              : "Cake, laughter and wonderful memories await you."}
          </p>
        </div>
      </div>
    </div>
  );
}