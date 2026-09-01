import type { ReactElement } from "react";

import weddingTemplateImage from "./assets/traditional-wedding-template.png";

interface SinhalaWeddingTemplateProps {
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
    dateText: parsedDate.toLocaleDateString("si-LK", {
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
          fontFamily:
            '"Noto Sans Sinhala", "Noto Sans", system-ui, sans-serif',
        }}
      >
        <img
          src={weddingTemplateImage}
          alt="Traditional Sinhala wedding invitation"
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
            left-[20%]
            right-[20%]
            top-[19%]
            z-10
            flex
            h-[43%]
            flex-col
            items-center
            text-center
          "
        >
          <p
            className="
              text-[clamp(8px,1.4vw,12px)]
              font-semibold
              uppercase
              tracking-[0.32em]
              text-[#92713e]
            "
          >
            {category}
          </p>

          <div className="mt-[3%] flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#b99a63]" />
            <span className="text-[clamp(12px,2vw,18px)] text-[#98733c]">❦</span>
            <span className="h-px w-8 bg-[#b99a63]" />
          </div>

          <p
            className="
              mt-[4%]
              text-[clamp(8px,1.5vw,12px)]
              font-medium
              uppercase
              leading-relaxed
              tracking-[0.16em]
              text-[#81633c]
            "
          >
            ඔබට අපගේ විවාහ උත්සවයට ආරාධනා
          </p>

          <h1
            className="
              mt-[4%]
              w-full
              break-words
              font-serif
              text-[clamp(25px,5vw,45px)]
              font-semibold
              leading-[1.05]
              tracking-[-0.025em]
              text-[#704822]
            "
          >
            {eventName || "විවාහ මංගල්‍යය"}
          </h1>

          <div className="mt-[5%] flex items-center justify-center gap-2">
            <span
              className="
                h-px
                w-10
                bg-gradient-to-r
                from-transparent
                to-[#b08a50]
              "
            />
            <span
              className="
                text-[clamp(10px,1.8vw,15px)]
                text-[#9b743e]
              "
            >
              ✦
            </span>
            <span
              className="
                h-px
                w-10
                bg-gradient-to-l
                from-transparent
                to-[#b08a50]
              "
            />
          </div>

          <div className="mt-[5%] w-full">
            <p
              className="
                text-[clamp(8px,1.3vw,11px)]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-[#9a7948]
              "
            >
              දිනය
            </p>

            <p
              className="
                mt-1
                font-serif
                text-[clamp(13px,2.3vw,19px)]
                font-semibold
                leading-snug
                text-[#674824]
              "
            >
              {dateText || "දිනය පසුව දැනුම් දෙනු ලැබේ"}
            </p>
          </div>

          {timeText && (
            <div className="mt-[3%]">
              <p
                className="
                  text-[clamp(8px,1.3vw,11px)]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-[#9a7948]
                "
              >
                වේලාව
              </p>

              <p
                className="
                  mt-1
                  text-[clamp(12px,2vw,17px)]
                  font-semibold
                  text-[#674824]
                "
              >
                {timeText}
              </p>
            </div>
          )}

          <div className="mt-[4%] w-full">
            <div
              className="
                mx-auto
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                border
                border-[#b79a69]
                text-[#8a6838]
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-3.5 w-3.5"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="
                    M12 21
                    s6-4.35 6-11
                    a6 6 0 1 0-12 0
                    c0 6.65 6 11 6 11Z
                  "
                />
                <circle cx="12" cy="10" r="2.25" />
              </svg>
            </div>

            <p
              className="
                mt-1.5
                text-[clamp(8px,1.3vw,11px)]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[#9a7948]
              "
            >
              ස්ථානය
            </p>

            <p
              className="
                mx-auto
                mt-1
                max-w-[95%]
                break-words
                text-[clamp(11px,1.9vw,16px)]
                font-semibold
                leading-snug
                text-[#674824]
              "
            >
              {location || "ස්ථානය පසුව දැනුම් දෙනු ලැබේ"}
            </p>
          </div>

          <p
            className="
              mt-[5%]
              font-serif
              text-[clamp(9px,1.5vw,13px)]
              italic
              leading-relaxed
              text-[#876b46]
            "
          >
            ඔබගේ පැමිණීම අපගේ විශේෂ දිනය තවත් සුන්දර කරයි
          </p>
        </div>
      </div>
    </div>
  );
}