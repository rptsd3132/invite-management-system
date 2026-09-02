import type { ReactElement } from "react";

import weddingTemplateImage from "./assets/traditional-wedding-template.png";

interface WeddingInvitationTemplateProps {
  eventName: string;
  location: string;
  date: string;
  category?: string;
  language?: "en" | "si";
}

function formatWeddingDate(value: string): {
  dateText: string;
  timeText: string;
} {
  if (!value) {
    return {
      dateText: "",
      timeText: "",
    };
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    const atIndex = value.toLowerCase().lastIndexOf(" at ");

    if (atIndex !== -1) {
      return {
        dateText: value.slice(0, atIndex).trim(),
        timeText: value.slice(atIndex + 4).trim(),
      };
    }

    return {
      dateText: value,
      timeText: "",
    };
  }

  return {
    dateText: parsedDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    timeText: parsedDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

function getWeddingTitleFontSize(text: string): string {
  const len = text ? text.trim().length : 0;
  if (len <= 8) return "text-[clamp(22px,4.5vw,36px)]";
  if (len <= 15) return "text-[clamp(16px,3.2vw,24px)]";
  if (len <= 25) return "text-[clamp(13px,2.4vw,18px)]";
  if (len <= 40) return "text-[clamp(10px,1.8vw,14px)]";
  if (len <= 60) return "text-[clamp(8.5px,1.4vw,11px)]";
  return "text-[clamp(7px,1.1vw,9.5px)]";
}

function getWeddingDateFontSize(text: string): string {
  const len = text ? text.trim().length : 0;
  if (len <= 15) return "text-[clamp(13px,2.3vw,19px)]";
  if (len <= 28) return "text-[clamp(11px,1.8vw,15px)]";
  if (len <= 45) return "text-[clamp(9px,1.4vw,12px)]";
  return "text-[clamp(7.5px,1.1vw,9.5px)]";
}

function getWeddingLocationFontSize(text: string): string {
  const len = text ? text.trim().length : 0;
  if (len <= 15) return "text-[clamp(12px,2vw,16px)]";
  if (len <= 30) return "text-[clamp(10px,1.6vw,13px)]";
  if (len <= 50) return "text-[clamp(8.5px,1.3vw,11px)]";
  if (len <= 80) return "text-[clamp(7.5px,1.1vw,9.5px)]";
  return "text-[clamp(6.5px,0.9vw,8.5px)]";
}

export default function WeddingInvitationTemplate({
  eventName,
  location,
  date,
  category = "Wedding",
  language = "en",
}: WeddingInvitationTemplateProps): ReactElement {
  const { dateText, timeText } = formatWeddingDate(date);
  const isSinhala = language === "si";

  const displayTitle = eventName || (isSinhala ? "විවාහ මංගල්‍යය" : "Wedding Celebration");
  const displayDate = dateText || (isSinhala ? "දිනය පසුව දැනුම් දෙනු ලැබේ" : "Date to be announced");
  const displayLocation = location || (isSinhala ? "ස්ථානය පසුව දැනුම් දෙනු ලැබේ" : "Venue to be announced");

  return (
    <div
      className="
        flex
        min-h-screen
        w-full
        items-center
        justify-center
        bg-[#eee9df]
        px-3
        py-6
        sm:px-6
        sm:py-10
      "
    >
      <div
        lang={isSinhala ? "si" : "en"}
        className="
          relative
          aspect-[2/3]
          w-full
          max-w-[620px]
          overflow-hidden
          bg-[#f8f1df]
          shadow-[0_30px_90px_rgba(47,37,21,0.30)]
        "
        style={{
          fontFamily: isSinhala
            ? '"Noto Sans Sinhala", "Noto Sans", system-ui, sans-serif'
            : undefined,
        }}
      >
        <img
          src={weddingTemplateImage}
          alt="Traditional wedding invitation"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
          "
        />

        <div
          className="
            absolute
            left-[12%]
            right-[12%]
            top-[14%]
            bottom-[42%]
            z-10
            flex
            flex-col
            items-center
            justify-around
            text-center
          "
        >
          <p
            className="
              text-[clamp(8px,1.4vw,11px)]
              font-semibold
              uppercase
              tracking-[0.3em]
              text-[#92713e]
            "
          >
            {category}
          </p>

          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#b99a63]" />
            <span className="text-[clamp(11px,1.8vw,16px)] text-[#98733c]">❦</span>
            <span className="h-px w-8 bg-[#b99a63]" />
          </div>

          <p
            className="
              text-[clamp(7.5px,1.3vw,10px)]
              font-medium
              uppercase
              tracking-[0.14em]
              text-[#81633c]
            "
          >
            {isSinhala
              ? "ඔබට අපගේ විවාහ උත්සවයට ආරාධනා"
              : "Together With Their Families"}
          </p>

          <h1
            className={`
              w-full
              break-words
              [overflow-wrap:anywhere]
              font-serif
              font-semibold
              leading-[1.05]
              tracking-[-0.02em]
              text-[#704822]
              ${getWeddingTitleFontSize(displayTitle)}
            `}
          >
            {displayTitle}
          </h1>

          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#b08a50]" />
            <span className="text-[clamp(8px,1.4vw,12px)] text-[#9b743e]">✦</span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#b08a50]" />
          </div>

          <div className="w-full">
            <p
              className="
                text-[clamp(7px,1.1vw,9.5px)]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[#9a7948]
              "
            >
              {isSinhala ? "දිනය" : "Date"}
            </p>

            <p
              className={`
                mt-0.5
                font-serif
                font-semibold
                leading-tight
                text-[#674824]
                break-words
                [overflow-wrap:anywhere]
                ${getWeddingDateFontSize(displayDate)}
              `}
            >
              {displayDate}
            </p>
          </div>

          {timeText && (
            <div>
              <p
                className="
                  text-[clamp(7px,1.1vw,9.5px)]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#9a7948]
                "
              >
                {isSinhala ? "වේලාව" : "Time"}
              </p>

              <p
                className="
                  mt-0.5
                  text-[clamp(10px,1.6vw,14px)]
                  font-semibold
                  text-[#674824]
                "
              >
                {timeText}
              </p>
            </div>
          )}

          <div className="w-full">
            <p
              className="
                text-[clamp(7px,1.1vw,9.5px)]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[#9a7948]
              "
            >
              {isSinhala ? "ස්ථානය" : "Location"}
            </p>

            <p
              className={`
                mx-auto
                mt-0.5
                max-w-[95%]
                break-words
                [overflow-wrap:anywhere]
                font-semibold
                leading-tight
                text-[#674824]
                ${getWeddingLocationFontSize(displayLocation)}
              `}
            >
              {displayLocation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}