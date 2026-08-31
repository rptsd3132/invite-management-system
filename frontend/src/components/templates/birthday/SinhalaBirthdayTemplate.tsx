import type { ReactElement } from "react";

import sinhalaBirthdayImage from "./assets/sinhala-birthday-template.png";

interface SinhalaBirthdayTemplateProps {
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

  const dateText = parsedDate.toLocaleDateString("si-LK", {
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

export default function SinhalaBirthdayTemplate({
  eventName,
  birthdayPerson,
  age = "",
  location,
  date,
  category = "Birthday",
  language = "si",
}: SinhalaBirthdayTemplateProps): ReactElement {
  const { dateText, timeText } = formatBirthdayDate(date);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#fff7e6] via-white to-[#fff0f5] px-3 py-6 sm:px-6 sm:py-10">
      {/* MAIN INVITATION CARD */}
      <div
        lang={language === "si" ? "si" : "en"}
        className="
          relative
          aspect-[1046/1536]
          w-full
          max-w-[560px]
          overflow-hidden
          rounded-[26px]
          bg-white
          shadow-[0_35px_100px_rgba(60,40,80,0.22)]
        "
        style={{
          fontFamily:
            '"Noto Sans Sinhala", "Noto Sans", Arial, system-ui, sans-serif',
        }}
      >
        {/* BACKGROUND IMAGE */}
        <img
          src={sinhalaBirthdayImage}
          alt="Sinhala Birthday Invitation"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* MAIN BLANK AREA CONTENT */}
        <div
          className="
            absolute
            left-[17%]
            right-[17%]
            top-[13%]
            z-10
            flex
            h-[52%]
            flex-col
            items-center
            text-center
          "
        >
          {/* SMALL TITLE */}
          <p
            className="
              text-[10px]
              font-bold
              tracking-[0.18em]
              text-[#e04c78]
              sm:text-xs
            "
          >
            🎉 උපන් දින සැමරුම 🎉
          </p>

          {/* DECORATION */}
          <div className="mt-3 flex items-center gap-3">
            <span className="h-px w-10 bg-[#f5ad4e]" />

            <span className="text-[#f09a36]">
              ✦
            </span>

            <span className="h-px w-10 bg-[#f5ad4e]" />
          </div>

          {/* INVITATION MESSAGE */}
          <p
            className="
              mt-4
              max-w-[95%]
              text-xs
              font-medium
              leading-[1.8]
              text-[#62477c]
              sm:text-base
            "
          >
            අපගේ ආදරණීය උපන් දින සැමරුමට
            <br />
            ඔබට සාදරයෙන් ආරාධනා
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
              text-[#e64d7b]
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
                border-[#ffd17a]
                bg-white/80
                px-5
                py-2
                shadow-sm
                backdrop-blur-sm
              "
            >
              <p className="text-xs font-bold text-[#e28427] sm:text-sm">
                {age} වන උපන් දිනය
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
              text-[#3d64a8]
              sm:text-lg
            "
          >
            {eventName}
          </p>

          {/* DIVIDER */}
          <div className="my-4 flex items-center justify-center">
            <span className="h-px w-14 bg-[#f6b54b]" />

            <span className="mx-3 text-[#e84e78]">
              ❦
            </span>

            <span className="h-px w-14 bg-[#f6b54b]" />
          </div>

          {/* DATE + TIME */}
          <div className="grid w-full grid-cols-2 gap-3">
            {/* DATE */}
            <div
              className="
                rounded-xl
                border
                border-orange-200
                bg-white/80
                px-2
                py-2
                shadow-sm
                backdrop-blur-[2px]
                sm:px-3
                sm:py-3
              "
            >
              <p
                className="
                  text-[8px]
                  font-bold
                  tracking-[0.12em]
                  text-[#e77b2e]
                  sm:text-xs
                "
              >
                දිනය
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  font-semibold
                  leading-relaxed
                  text-[#4d5790]
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
                border-pink-200
                bg-white/80
                px-2
                py-2
                shadow-sm
                backdrop-blur-[2px]
                sm:px-3
                sm:py-3
              "
            >
              <p
                className="
                  text-[8px]
                  font-bold
                  tracking-[0.12em]
                  text-[#e34e7b]
                  sm:text-xs
                "
              >
                වේලාව
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  font-semibold
                  text-[#4d5790]
                  sm:text-sm
                "
              >
                {timeText}
              </p>
            </div>
          </div>

          {/* LOCATION */}
          {location && (
            <div
              className="
                mt-3
                w-full
                rounded-xl
                border
                border-blue-200
                bg-white/80
                px-3
                py-2
                shadow-sm
                backdrop-blur-[2px]
                sm:px-4
                sm:py-3
              "
            >
              <p
                className="
                  text-[8px]
                  font-bold
                  tracking-[0.12em]
                  text-[#3979aa]
                  sm:text-xs
                "
              >
                ස්ථානය
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  font-semibold
                  leading-relaxed
                  text-[#4d5790]
                  sm:text-sm
                "
              >
                {location}
              </p>
            </div>
          )}

          {/* BOTTOM MESSAGE */}
          <p
            className="
              mt-4
              max-w-[95%]
              text-[9px]
              font-medium
              leading-relaxed
              text-[#745c8d]
              sm:text-xs
            "
          >
            ඔබගේ පැමිණීම අපගේ මේ සුන්දර සැමරුම
            <br />
            තවත් විශේෂ කරනු ඇත.
          </p>
        </div>

        {/* CATEGORY - hidden metadata style */}
        <span className="sr-only">{category}</span>
      </div>
    </div>
  );
}