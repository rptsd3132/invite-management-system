import type { ReactElement } from "react";

import officeTemplateImage from "./assets/sinhala-office-ai-template.png";

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

function formatOfficeDate(value: string, timeValue = ""): {
  dateText: string;
  timeText: string;
} {
  if (!value) {
    return { dateText: "", timeText: timeValue };
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    const atIndex = value.toLowerCase().lastIndexOf(" at ");

    if (atIndex !== -1) {
      return {
        dateText: value.slice(0, atIndex).trim(),
        timeText: timeValue || value.slice(atIndex + 4).trim(),
      };
    }

    return {
      dateText: value,
      timeText: timeValue,
    };
  }

  return {
    dateText: parsedDate.toLocaleDateString("si-LK", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    timeText: timeValue || parsedDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

function getOfficeCompanyFontSize(text: string): string {
  const len = text ? text.trim().length : 0;
  if (len <= 12) return "text-[clamp(24px,5.5vw,46px)]";
  if (len <= 22) return "text-[clamp(18px,4vw,32px)]";
  if (len <= 35) return "text-[clamp(14px,2.8vw,22px)]";
  return "text-[clamp(11px,2vw,16px)]";
}

function getOfficeGuestFontSize(text: string): string {
  const len = text ? text.trim().length : 0;
  if (len <= 15) return "text-[clamp(22px,3.8vw,34px)]";
  if (len <= 28) return "text-[clamp(16px,2.8vw,24px)]";
  return "text-[clamp(12px,2vw,17px)]";
}

function getOfficeEventFontSize(text: string): string {
  const len = text ? text.trim().length : 0;
  if (len <= 16) return "text-[clamp(16px,2.8vw,26px)]";
  if (len <= 30) return "text-[clamp(13px,2.2vw,19px)]";
  return "text-[clamp(10px,1.6vw,14px)]";
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
  const { dateText, timeText } = formatOfficeDate(date, time);
  const isSinhala = language === "si";

  const displayDate = dateText || "දිනය පසුව දැනුම් දෙනු ලැබේ";
  const displayTime = timeText || "වේලාව පසුව දැනුම් දෙනු ලැබේ";
  const displayLocation = location || "ස්ථානය පසුව දැනුම් දෙනු ලැබේ";

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
        lang={isSinhala ? "si" : "en"}
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
            inset-x-[10%]
            top-[8%]
            z-10
            text-center
            max-h-[30%]
            overflow-hidden
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
            className={`
              mt-3
              font-bold
              tracking-[-0.03em]
              text-[#162c4e]
              break-words
              [overflow-wrap:anywhere]
              ${getOfficeCompanyFontSize(companyName)}
            `}
          >
            {companyName}
          </h1>

          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-[#7fa4d6]" />
            <span className="text-[#2f4d77]">✦</span>
            <span className="h-px w-12 bg-[#7fa4d6]" />
          </div>

          <p
            className="
              mt-3
              text-[clamp(11px,1.8vw,15px)]
              font-medium
              uppercase
              tracking-[0.18em]
              text-[#33517a]
            "
          >
            සැලසුම් සහ ආරාධනය
          </p>
        </div>

        <div
          className="
            absolute
            inset-x-[14%]
            top-[36%]
            z-10
            max-h-[38%]
            overflow-hidden
            rounded-3xl
            border
            border-white/50
            bg-white/75
            p-4
            text-center
            shadow-lg
            backdrop-blur-sm
          "
        >
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            ආගන්තුකයා
          </p>
          <h2
            className={`
              mt-2
              font-bold
              text-[#1d3557]
              break-words
              [overflow-wrap:anywhere]
              ${getOfficeGuestFontSize(guestName)}
            `}
          >
            {guestName}
          </h2>

          <div className="mt-3">
            <p className="text-[clamp(11px,1.8vw,14px)] font-medium text-slate-700">
              ඔබව අපගේ උත්සවයට ආරාධනා කරයි
            </p>
            <p
              className={`
                mt-1
                font-bold
                text-[#1d3557]
                break-words
                [overflow-wrap:anywhere]
                ${getOfficeEventFontSize(eventName)}
              `}
            >
              {eventName}
            </p>
            <p className="mt-2 text-[clamp(10px,1.5vw,13px)] leading-relaxed text-slate-600">
              අපගේ මෙහෙයුම, සම්බන්ධතාවය සහ අත්කරගත් සාර්ථකත්වය සමගින් මෙම අවස්ථාව සැමරීමට ඔබගේ පැමිණීම අපි ඉතා අගය කරනවා.
            </p>
          </div>
        </div>

        <div
          className="
            absolute
            inset-x-[14%]
            bottom-[8%]
            z-10
            grid
            gap-2
          "
        >
          <div className="rounded-xl bg-slate-900/90 px-3.5 py-2 text-white shadow-md">
            <p className="text-[9.5px] uppercase tracking-[0.22em] text-slate-300">
              දිනය
            </p>
            <p className="mt-0.5 text-sm font-semibold break-words [overflow-wrap:anywhere]">{displayDate}</p>
          </div>

          <div className="rounded-xl bg-white/85 px-3.5 py-2 text-slate-800 shadow-md ring-1 ring-slate-200">
            <p className="text-[9.5px] uppercase tracking-[0.22em] text-slate-500">
              වේලාව
            </p>
            <p className="mt-0.5 text-sm font-semibold break-words [overflow-wrap:anywhere]">{displayTime}</p>
          </div>

          <div className="rounded-xl bg-white/85 px-3.5 py-2 text-slate-800 shadow-md ring-1 ring-slate-200">
            <p className="text-[9.5px] uppercase tracking-[0.22em] text-slate-500">
              ස්ථානය
            </p>
            <p className="mt-0.5 text-sm font-semibold break-words [overflow-wrap:anywhere]">{displayLocation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}