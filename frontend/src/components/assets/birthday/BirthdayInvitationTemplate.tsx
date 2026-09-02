import type { ReactElement } from "react";

import birthdayTemplateImage from "./assets/Purple and Pink Watercolor Birthday Invitation.png";

interface BirthdayInvitationTemplateProps {
  guestName?: string;
  eventName?: string;
  date?: string;
  time?: string;
  location?: string;
  category?: string;
  language?: "en" | "si";
}

function formatBirthdayDate(value: string, timeValue = ""): {
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
    dateText: parsedDate.toLocaleDateString("en-US", {
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

function getBirthdayGuestFontSize(text: string): string {
  const len = text ? text.trim().length : 0;
  if (len <= 10) return "text-[clamp(26px,6vw,52px)]";
  if (len <= 18) return "text-[clamp(20px,4.5vw,36px)]";
  if (len <= 28) return "text-[clamp(15px,3.2vw,24px)]";
  return "text-[clamp(11px,2.2vw,16px)]";
}

function getBirthdayEventFontSize(text: string): string {
  const len = text ? text.trim().length : 0;
  if (len <= 12) return "text-[clamp(18px,3vw,28px)]";
  if (len <= 24) return "text-[clamp(14px,2.4vw,20px)]";
  return "text-[clamp(11px,1.8vw,15px)]";
}

function getBirthdayDetailFontSize(text: string): string {
  const len = text ? text.trim().length : 0;
  if (len <= 20) return "text-[clamp(12px,2vw,18px)]";
  if (len <= 35) return "text-[clamp(10px,1.6vw,14px)]";
  return "text-[clamp(8.5px,1.3vw,11px)]";
}

export default function BirthdayInvitationTemplate({
  guestName = "Guest",
  eventName = "Birthday Celebration",
  date = "",
  time = "",
  location = "",
  category = "Birthday",
  language = "en",
}: BirthdayInvitationTemplateProps): ReactElement {
  const { dateText, timeText } = formatBirthdayDate(date, time);
  const isSinhala = language === "si";

  const displayDate = dateText || (isSinhala ? "දිනය පසුව දැනුම් දෙනු ලැබේ" : "Date to be announced");
  const displayTime = timeText || (isSinhala ? "වේලාව පසුව දැනුම් දෙනු ලැබේ" : "Time to be announced");
  const displayLocation = location || (isSinhala ? "ස්ථානය පසුව දැනුම් දෙනු ලැබේ" : "Venue to be announced");

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
        lang={isSinhala ? "si" : "en"}
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
          alt="Birthday invitation"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-white/30 to-transparent" />

        <div
          className="
            absolute
            inset-x-[16%]
            top-[10%]
            z-10
            flex
            max-h-[75%]
            flex-col
            items-center
            text-center
            overflow-hidden
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
            className={`
              mt-[6%]
              font-serif
              font-bold
              leading-none
              text-[#8a71a4]
              break-words
              [overflow-wrap:anywhere]
              ${getBirthdayGuestFontSize(guestName)}
            `}
          >
            {guestName}
          </h1>

          <div className="mt-[5%] flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#cfb4d7]" />
            <span className="text-[clamp(14px,2vw,20px)] text-[#9d7bb3]">✦</span>
            <span className="h-px w-10 bg-[#cfb4d7]" />
          </div>

          <div className="mt-[4%] space-y-1.5 w-full">
            <div className="flex flex-col items-center">
              <span className="text-[clamp(8px,1.2vw,10px)] font-semibold uppercase tracking-[0.2em] text-[#9d7bb3]">
                {isSinhala ? "දිනය" : "Date"}
              </span>
              <p
                className={`
                  font-semibold
                  text-[#8c6ea1]
                  break-words
                  [overflow-wrap:anywhere]
                  ${getBirthdayDetailFontSize(displayDate)}
                `}
              >
                {displayDate}
              </p>
            </div>

            {displayTime && (
              <div className="flex flex-col items-center mt-0.5">
                <span className="text-[clamp(8px,1.2vw,10px)] font-semibold uppercase tracking-[0.2em] text-[#9d7bb3]">
                  {isSinhala ? "වේලාව" : "Time"}
                </span>
                <p
                  className={`
                    font-semibold
                    text-[#8c6ea1]
                    break-words
                    [overflow-wrap:anywhere]
                    ${getBirthdayDetailFontSize(displayTime)}
                  `}
                >
                  {displayTime}
                </p>
              </div>
            )}

            <div className="flex flex-col items-center mt-0.5">
              <span className="text-[clamp(8px,1.2vw,10px)] font-semibold uppercase tracking-[0.2em] text-[#9d7bb3]">
                {isSinhala ? "ස්ථානය" : "Location"}
              </span>
              <p
                className={`
                  font-semibold
                  text-[#8c6ea1]
                  break-words
                  [overflow-wrap:anywhere]
                  ${getBirthdayDetailFontSize(displayLocation)}
                `}
              >
                {displayLocation}
              </p>
            </div>
          </div>

          <div className="mt-[6%]">
            <p
              className="
                text-[clamp(11px,1.8vw,16px)]
                font-serif
                italic
                text-[#8d6b9d]
              "
            >
              {isSinhala ? "ඔබට ආරාධනය" : "You are invited"}
            </p>
            <p
              className={`
                mt-1
                font-semibold
                text-[#7a5d8c]
                break-words
                [overflow-wrap:anywhere]
                ${getBirthdayEventFontSize(eventName)}
              `}
            >
              {eventName}
            </p>
          </div>

          <p
            className="
              mt-[5%]
              max-w-[85%]
              text-[clamp(9.5px,1.6vw,13px)]
              leading-relaxed
              text-[#7a628b]
            "
          >
            {isSinhala
              ? "සතුට, සිනහව සහ සෙනෙහස පිරුණු මේ උදාවේ ඔබව අපිත් එක්ව සතුටෙන් සැමරීමට ඉතා ප්‍රසාද කරනවා."
              : "With laughter, love, and warm wishes, we would be delighted to celebrate this special day with you."}
          </p>
        </div>

        <div className="absolute inset-x-[14%] bottom-[8%] z-10 text-center">
          <p
            className="
              font-serif
              text-[clamp(13px,1.8vw,19px)]
              italic
              text-[#8f6fa1]
            "
          >
            {isSinhala
              ? "සියලු ප්‍රජාවක් එක්ව"
              : "Join us for a joyful celebration"}
          </p>
          <p
            className="
              mt-1
              text-[clamp(9.5px,1.4vw,12px)]
              uppercase
              tracking-[0.18em]
              text-[#8a709f]
            "
          >
            {isSinhala
              ? "ආදරයෙන් හා සතුටින්"
              : "With love and happiness"}
          </p>
        </div>
      </div>
    </div>
  );
}