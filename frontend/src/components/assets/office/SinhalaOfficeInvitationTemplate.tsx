import type { ReactElement } from "react";

import officeTemplateImage from "./assets/office-ai-template.png";

interface SinhalaOfficeInvitationTemplateProps {
  guestName?: string;
  eventName?: string;
  companyName?: string;
  date?: string;
  time?: string;
  location?: string;
  category?: string;
  language?: "en" | "si";
}

function formatOfficeDate(value: string): {
  dateText: string;
  timeText: string;
} {
  if (!value) {
    return { dateText: "", timeText: "" };
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
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    timeText: parsedDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

export default function SinhalaOfficeInvitationTemplate({
  guestName = "Guest",
  eventName = "Corporate Event",
  companyName = "Company Name",
  date = "",
  time = "",
  location = "",
  category = "Office",
  language = "si",
}: SinhalaOfficeInvitationTemplateProps): ReactElement {
  const { dateText, timeText } = formatOfficeDate(date);

  return (
    <div
      className="
        flex
        min-h-screen
        w-full
        items-center
        justify-center
        bg-[#edf4ff]
        px-3
        py-6
        sm:px-6
        sm:py-10
      "
    >
      <div
        lang="si"
        className="
          relative
          aspect-[2/3]
          w-full
          max-w-[620px]
          overflow-hidden
          bg-white
          shadow-[0_30px_90px_rgba(11,32,74,0.18)]
        "
      >
        <img
          src={officeTemplateImage}
          alt="Corporate Sinhala invitation"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-[#0f172a]/10" />

        <div
          className="
            absolute
            inset-x-[12%]
            top-[10%]
            z-10
            text-center
          "
        >
          <p
            className="
              text-[clamp(10px,1.5vw,12px)]
              font-semibold
              uppercase
              tracking-[0.33em]
              text-[#2f4d77]
            "
          >
            {category}
          </p>

          <h1
            className="
              mt-5
              text-[clamp(28px,6vw,52px)]
              font-bold
              tracking-[-0.04em]
              text-[#162c4e]
            "
          >
            {companyName}
          </h1>

          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-[#7fa4d6]" />
            <span className="text-[#2f4d77]">✦</span>
            <span className="h-px w-12 bg-[#7fa4d6]" />
          </div>

          <p
            className="
              mt-5
              text-[clamp(13px,2vw,18px)]
              font-medium
              uppercase
              tracking-[0.2em]
              text-[#33517a]
            "
          >
            සැලසුම් සහ ආරාධනය
          </p>
        </div>

        <div
          className="
            absolute
            inset-x-[16%]
            top-[38%]
            z-10
            rounded-3xl
            border
            border-white/50
            bg-white/75
            p-5
            text-center
            shadow-lg
            backdrop-blur-sm
          "
        >
          <p className="text-sm uppercase tracking-[0.26em] text-slate-500">
            ආගන්තුකයා
          </p>
          <h2 className="mt-3 text-[clamp(24px,4vw,38px)] font-bold text-[#1d3557]">
            {guestName}
          </h2>

          <div className="mt-4">
            <p className="text-[clamp(12px,2vw,16px)] font-medium text-slate-700">
              ඔබව අපගේ උත්සවයට ආරාධනා කරයි
            </p>
            <p className="mt-2 text-[clamp(18px,3vw,28px)] font-bold text-[#1d3557]">
              {eventName}
            </p>
          </div>
        </div>

        <div
          className="
            absolute
            inset-x-[16%]
            bottom-[12%]
            z-10
            grid
            gap-3
          "
        >
          <div className="rounded-2xl bg-slate-900/90 px-4 py-3 text-white shadow-md">
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-300">
              දිනය
            </p>
            <p className="mt-1 text-base font-semibold">{dateText || "පසුව දැනුම් දෙනු ලැබේ"}</p>
          </div>

          <div className="rounded-2xl bg-white/85 px-4 py-3 text-slate-800 shadow-md ring-1 ring-slate-200">
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
              වේලාව
            </p>
            <p className="mt-1 text-base font-semibold">{timeText || "පසුව දැනුම් දෙනු ලැබේ"}</p>
          </div>

          <div className="rounded-2xl bg-white/85 px-4 py-3 text-slate-800 shadow-md ring-1 ring-slate-200">
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
              ස්ථානය
            </p>
            <p className="mt-1 text-base font-semibold">{location || "පසුව දැනුම් දෙනු ලැබේ"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}