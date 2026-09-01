import type { ReactElement } from "react";

import birthdayTemplateImage from "./assets/Purple and Pink Watercolor Birthday Invitation.png";

interface SinhalaBirthdayTemplateProps {
  guestName?: string;
  eventName?: string;
  date?: string;
  time?: string;
  location?: string;
  category?: string;
  language?: "en" | "si";
}

function formatBirthdayDate(value: string): {
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

export default function SinhalaBirthdayTemplate({
  guestName = "Guest",
  eventName = "Birthday Celebration",
  date = "",
  time = "",
  location = "",
  category = "Birthday",
  language = "si",
}: SinhalaBirthdayTemplateProps): ReactElement {
  const { dateText, timeText } = formatBirthdayDate(date);

  return (
    <div
      className="
        flex
        min-h-screen
        w-full
        items-center
        justify-center
        bg-[#f6ebf9]
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
          bg-[#f8f2f6]
          shadow-[0_30px_90px_rgba(149,112,163,0.25)]
        "
      >
        <img
          src={birthdayTemplateImage}
          alt="Sinhala birthday invitation"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-white/30 to-transparent" />

        <div
          className="
            absolute
            inset-x-[18%]
            top-[12%]
            z-10
            flex
            flex-col
            items-center
            text-center
          "
        >
          <p
            className="
              text-[clamp(10px,1.5vw,12px)]
              font-semibold
              uppercase
              tracking-[0.35em]
              text-[#9d7bb3]
            "
          >
            {category}
          </p>

          <h1
            className="
              mt-[12%]
              font-serif
              text-[clamp(30px,7vw,58px)]
              font-bold
              leading-none
              text-[#8a71a4]
            "
          >
            {guestName}
          </h1>

          <div className="mt-[8%] flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#cfb4d7]" />
            <span className="text-[clamp(14px,2vw,20px)] text-[#9d7bb3]">✦</span>
            <span className="h-px w-10 bg-[#cfb4d7]" />
          </div>

          <div className="mt-[8%] space-y-2">
            <p
              className="
                text-[clamp(12px,2vw,18px)]
                font-medium
                text-[#8c6ea1]
              "
            >
              {dateText || "දිනය පසුව දැනුම් දෙනු ලැබේ"}
            </p>
            <p
              className="
                text-[clamp(12px,2vw,18px)]
                font-medium
                text-[#8c6ea1]
              "
            >
              {timeText || "වේලාව පසුව දැනුම් දෙනු ලැබේ"}
            </p>
            <p
              className="
                text-[clamp(12px,2vw,18px)]
                font-medium
                text-[#8c6ea1]
              "
            >
              {location || "ස්ථානය පසුව දැනුම් දෙනු ලැබේ"}
            </p>
          </div>

          <div className="mt-[10%]">
            <p
              className="
                text-[clamp(12px,2vw,18px)]
                font-serif
                italic
                text-[#8d6b9d]
              "
            >
              ඔබට ආරාධනය
            </p>
            <p
              className="
                mt-2
                text-[clamp(18px,3vw,28px)]
                font-semibold
                text-[#7a5d8c]
              "
            >
              {eventName}
            </p>
          </div>
        </div>

        <div className="absolute inset-x-[14%] bottom-[12%] z-10 text-center">
          <p
            className="
              font-serif
              text-[clamp(14px,2vw,22px)]
              italic
              text-[#8f6fa1]
            "
          >
            සියලු ප්‍රජාවක් එක්ව
          </p>
        </div>
      </div>
    </div>
  );
}