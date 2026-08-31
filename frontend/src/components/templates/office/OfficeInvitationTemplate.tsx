import type { ReactElement } from "react";

import officeTemplateImage from "./assets/office-ai-template.png";

interface OfficeInvitationTemplateProps {
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

export default function OfficeInvitationTemplate({
  eventName,
  companyName = "",
  location,
  date,
  category = "Office",
  language = "en",
}: OfficeInvitationTemplateProps): ReactElement {
  const { dateText, timeText } = formatEventDate(date);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#09031c] via-[#160a3d] to-[#35158f] px-3 py-6 sm:px-6 sm:py-10">
      <div
        lang={language}
        className="
          relative
          aspect-square
          w-full
          max-w-[650px]
          overflow-hidden
          rounded-[28px]
          bg-[#16084b]
          shadow-[0_35px_100px_rgba(20,5,70,0.55)]
        "
      >
        {/* BACKGROUND IMAGE */}
        <img
          src={officeTemplateImage}
          alt="Technology office event invitation"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* READABILITY OVERLAY */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#10052d]/75
            via-[#241060]/25
            to-transparent
          "
        />

        {/* MAIN CONTENT */}
        <div
          className="
            absolute
            left-[8%]
            top-[17%]
            z-10
            flex
            h-[67%]
            w-[48%]
            flex-col
            justify-center
          "
        >
          {/* CATEGORY */}
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-violet-300" />

            <p
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.35em]
                text-violet-200
                sm:text-xs
              "
            >
              {category} Event
            </p>
          </div>

          {/* INVITATION LABEL */}
          <p
            className="
              mt-5
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.25em]
              text-white/70
              sm:text-xs
            "
          >
            You Are Invited
          </p>

          {/* EVENT NAME */}
          <h1
            className="
              mt-3
              max-w-full
              break-words
              text-2xl
              font-black
              uppercase
              leading-[1.05]
              tracking-tight
              text-white
              sm:text-3xl
              md:text-4xl
            "
          >
            {eventName}
          </h1>

          {/* COMPANY */}
          {companyName && (
            <p
              className="
                mt-3
                text-xs
                font-semibold
                tracking-[0.08em]
                text-violet-200
                sm:text-sm
              "
            >
              Presented by {companyName}
            </p>
          )}

          {/* DIVIDER */}
          <div className="my-5 flex items-center gap-2">
            <div className="h-[2px] w-12 bg-white" />
            <div className="h-[5px] w-[5px] rotate-45 bg-violet-300" />
            <div className="h-[2px] w-5 bg-violet-300" />
          </div>

          {/* DESCRIPTION */}
          <p
            className="
              max-w-[95%]
              text-[10px]
              font-medium
              leading-relaxed
              text-white/75
              sm:text-xs
            "
          >
            Join us for an inspiring event focused on innovation,
            technology and the future of digital transformation.
          </p>

          {/* DATE + TIME */}
          <div className="mt-5 grid w-full grid-cols-2 gap-2">
            <div
              className="
                rounded-lg
                border
                border-violet-300/40
                bg-[#16063d]/70
                px-2
                py-2
                backdrop-blur-sm
                sm:px-3
              "
            >
              <p
                className="
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-violet-300
                  sm:text-[9px]
                "
              >
                Date
              </p>

              <p
                className="
                  mt-1
                  text-[8px]
                  font-semibold
                  leading-relaxed
                  text-white
                  sm:text-[10px]
                "
              >
                {dateText}
              </p>
            </div>

            <div
              className="
                rounded-lg
                border
                border-violet-300/40
                bg-[#16063d]/70
                px-2
                py-2
                backdrop-blur-sm
                sm:px-3
              "
            >
              <p
                className="
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-violet-300
                  sm:text-[9px]
                "
              >
                Time
              </p>

              <p
                className="
                  mt-1
                  text-[8px]
                  font-semibold
                  text-white
                  sm:text-[10px]
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
                mt-2
                w-full
                rounded-lg
                border
                border-violet-300/40
                bg-[#16063d]/70
                px-3
                py-2
                backdrop-blur-sm
              "
            >
              <p
                className="
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-violet-300
                  sm:text-[9px]
                "
              >
                Location
              </p>

              <p
                className="
                  mt-1
                  break-words
                  text-[8px]
                  font-semibold
                  leading-relaxed
                  text-white
                  sm:text-[10px]
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
              text-[8px]
              font-medium
              uppercase
              tracking-[0.12em]
              text-white/60
              sm:text-[10px]
            "
          >
            Innovate • Connect • Transform
          </p>
        </div>
      </div>
    </div>
  );
}