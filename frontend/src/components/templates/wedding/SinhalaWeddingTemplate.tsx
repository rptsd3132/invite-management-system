import type { ReactElement } from "react";

import sinhalaWeddingImage from "./assets/sinhala-wedding-template.jpg";

interface SinhalaWeddingTemplateProps {
  eventName: string;
  location: string;
  date: string;
  category?: string;
  language?: "en" | "si";
}

interface FormattedDate {
  dateText: string;
  timeText: string;
}

function formatWeddingDate(value: string): FormattedDate {
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

  const dateText = parsedDate.toLocaleDateString("en-GB", {
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

export default function SinhalaWeddingTemplate({
  eventName,
  location,
  date,
  category = "Wedding",
  language = "si",
}: SinhalaWeddingTemplateProps): ReactElement {
  const { dateText, timeText } = formatWeddingDate(date);

  const isSinhala = language === "si";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#e9dfd2] px-3 py-6 sm:px-6 sm:py-10">
      {/* =====================================================
          MAIN INVITATION CARD
      ====================================================== */}

      <div
        lang={isSinhala ? "si" : "en"}
        className="
          relative
          aspect-[1.45/1]
          w-full
          max-w-[1100px]
          overflow-hidden
          rounded-[8px]
          bg-[#f5efe7]
          shadow-[0_30px_90px_rgba(79,48,27,0.30)]
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
          src={sinhalaWeddingImage}
          alt="Sinhala Wedding Invitation"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* subtle readability overlay */}
        <div className="absolute inset-0 bg-white/[0.03]" />

        {/* =====================================================
            LEFT CONTENT AREA
        ====================================================== */}

        <div
          className="
            absolute
            left-[5%]
            top-[18%]
            z-10
            flex
            h-[62%]
            w-[43%]
            flex-col
            items-center
            justify-center
            text-center
          "
        >
          {/* category */}

          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.35em]
              text-[#87572f]
              sm:text-xs
              md:text-sm
            "
          >
            {isSinhala ? "විවාහ මංගල්‍යය" : category}
          </p>

          {/* small ornament */}

          <div className="my-3 flex items-center gap-3">
            <span className="h-px w-8 bg-[#a06c42]/60 sm:w-12" />

            <span className="text-lg text-[#9a6135]">
              ❦
            </span>

            <span className="h-px w-8 bg-[#a06c42]/60 sm:w-12" />
          </div>

          {/* main invitation text */}

          <p
            className="
              max-w-[420px]
              text-[13px]
              font-medium
              leading-[1.9]
              text-[#855329]
              sm:text-base
              md:text-xl
            "
          >
            {isSinhala
              ? "අපගේ විවාහ මංගල්‍යයට සාදරයෙන් ආරාධනා"
              : "We warmly invite you to celebrate our wedding"}
          </p>

          {/* EVENT NAME */}

          <h1
            className="
              mt-4
              max-w-[95%]
              break-words
              text-2xl
              font-bold
              leading-snug
              text-[#774822]
              sm:text-3xl
              md:text-4xl
            "
          >
            {eventName}
          </h1>

          {/* decorative divider */}

          <div className="my-4 flex items-center justify-center">
            <div className="h-px w-16 bg-[#a56a3c]/60 sm:w-24" />

            <span className="mx-3 text-[#9a6033]">
              ✦
            </span>

            <div className="h-px w-16 bg-[#a56a3c]/60 sm:w-24" />
          </div>

          {/* =====================================================
              DATE + TIME
          ====================================================== */}

          <div className="grid w-full max-w-[420px] grid-cols-2 gap-5">
            {/* date */}

            <div className="text-center">
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#a07452]
                  sm:text-xs
                "
              >
                {isSinhala ? "දිනය" : "Date"}
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  font-semibold
                  text-[#764a29]
                  sm:text-sm
                  md:text-base
                "
              >
                {dateText}
              </p>
            </div>

            {/* time */}

            <div className="text-center">
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#a07452]
                  sm:text-xs
                "
              >
                {isSinhala ? "වේලාව" : "Time"}
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  font-semibold
                  text-[#764a29]
                  sm:text-sm
                  md:text-base
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
            <div className="mt-5 max-w-[430px] text-center">
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#a07452]
                  sm:text-xs
                "
              >
                {isSinhala ? "ස්ථානය" : "Location"}
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  font-medium
                  leading-relaxed
                  text-[#754927]
                  sm:text-sm
                  md:text-base
                "
              >
                {location}
              </p>
            </div>
          )}

          {/* bottom message */}

          <p
            className="
              mt-5
              text-[10px]
              italic
              text-[#9b6c49]
              sm:text-xs
              md:text-sm
            "
          >
            {isSinhala
              ? "ඔබගේ පැමිණීම අපගේ සතුට තවත් වැඩි කරනු ඇත"
              : "Your presence will make our celebration even more special"}
          </p>
        </div>
      </div>
    </div>
  );
}