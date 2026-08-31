import type { ReactElement } from "react";

import officeTemplateImage from "./assets/sinhala-office-ai-template.png";

interface SinhalaOfficeInvitationTemplateProps {
  eventName: string;
  companyName?: string;
  location: string;
  date: string;
  category?: string;
  language?: "en" | "si";
}

interface FormattedDate {
  dateText: string;
  timeText: string;
}

function formatEventDate(value: string): FormattedDate {
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

export default function SinhalaOfficeInvitationTemplate({
  eventName,
  companyName = "",
  location,
  date,
  category = "Office",
  language = "si",
}: SinhalaOfficeInvitationTemplateProps): ReactElement {
  const { dateText, timeText } = formatEventDate(date);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#001526] via-[#062b45] to-[#087ca3] px-3 py-6 sm:px-6 sm:py-10">
      {/* =====================================================
          MAIN OFFICE INVITATION CARD
      ====================================================== */}

      <div
        lang={language}
        className="
          relative
          aspect-[1080/1350]
          w-full
          max-w-[600px]
          overflow-hidden
          rounded-[28px]
          bg-[#021828]
          shadow-[0_35px_100px_rgba(0,20,40,0.55)]
        "
        style={{
          fontFamily:
            '"Noto Sans Sinhala", "Noto Sans", system-ui, sans-serif',
        }}
      >
        {/* BACKGROUND IMAGE */}

        <img
          src={officeTemplateImage}
          alt="Sinhala Technology Office Invitation"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* TOP DARK OVERLAY FOR TEXT */}

        <div className="absolute inset-0 bg-gradient-to-b from-[#00172a]/70 via-transparent to-transparent" />

        {/* =====================================================
            MAIN SAFE CONTENT AREA
        ====================================================== */}

        <div
          className="
            absolute
            left-[10%]
            right-[10%]
            top-[8%]
            z-10
            flex
            h-[47%]
            flex-col
            items-center
            text-center
          "
        >
          {/* CATEGORY */}

          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-cyan-300/80" />

            <p
              className="
                text-[9px]
                font-bold
                tracking-[0.22em]
                text-cyan-200
                sm:text-xs
              "
            >
              {category === "Office"
                ? "තාක්ෂණික සහ ව්‍යාපාරික උත්සවය"
                : category}
            </p>

            <span className="h-px w-10 bg-cyan-300/80" />
          </div>

          {/* INVITATION LABEL */}

          <p
            className="
              mt-4
              text-xs
              font-semibold
              tracking-[0.12em]
              text-white/75
              sm:text-sm
            "
          >
            ඔබට සාදරයෙන් ආරාධනා
          </p>

          {/* EVENT NAME */}

          <h1
            className="
              mt-4
              max-w-full
              break-words
              text-3xl
              font-black
              leading-tight
              text-white
              sm:text-4xl
              md:text-5xl
            "
          >
            {eventName}
          </h1>

          {/* COMPANY NAME */}

          {companyName && (
            <p
              className="
                mt-3
                text-sm
                font-semibold
                tracking-wide
                text-cyan-200
                sm:text-base
              "
            >
              {companyName}
            </p>
          )}

          {/* DIVIDER */}

          <div className="my-5 flex items-center gap-2">
            <span className="h-px w-14 bg-cyan-300" />

            <span className="text-cyan-300">
              ✦
            </span>

            <span className="h-px w-14 bg-cyan-300" />
          </div>

          {/* DESCRIPTION */}

          <p
            className="
              max-w-[92%]
              text-[10px]
              font-medium
              leading-[1.9]
              text-white/80
              sm:text-sm
            "
          >
            නවෝත්පාදන, තාක්ෂණය සහ ඩිජිටල් අනාගතය පිළිබඳ
            විශේෂ උත්සවයකට අප සමඟ එක්වන්න.
          </p>

          {/* =====================================================
              DATE + TIME
          ====================================================== */}

          <div className="mt-5 grid w-full grid-cols-2 gap-3">
            {/* DATE */}

            <div
              className="
                rounded-xl
                border
                border-cyan-300/30
                bg-[#001c30]/70
                px-3
                py-3
                shadow-sm
                backdrop-blur-sm
              "
            >
              <p
                className="
                  text-[8px]
                  font-bold
                  tracking-[0.15em]
                  text-cyan-300
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
                  text-white
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
                border-cyan-300/30
                bg-[#001c30]/70
                px-3
                py-3
                shadow-sm
                backdrop-blur-sm
              "
            >
              <p
                className="
                  text-[8px]
                  font-bold
                  tracking-[0.15em]
                  text-cyan-300
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
                  text-white
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
                border-cyan-300/30
                bg-[#001c30]/70
                px-4
                py-3
                shadow-sm
                backdrop-blur-sm
              "
            >
              <p
                className="
                  text-[8px]
                  font-bold
                  tracking-[0.15em]
                  text-cyan-300
                  sm:text-xs
                "
              >
                ස්ථානය
              </p>

              <p
                className="
                  mt-1
                  break-words
                  text-[10px]
                  font-semibold
                  leading-relaxed
                  text-white
                  sm:text-sm
                "
              >
                {location}
              </p>
            </div>
          )}

          {/* FOOTER */}

          <p
            className="
              mt-4
              text-[9px]
              font-medium
              tracking-[0.08em]
              text-white/60
              sm:text-xs
            "
          >
            නවෝත්පාදනය • සම්බන්ධතාවය • පරිවර්තනය
          </p>
        </div>
      </div>
    </div>
  );
}