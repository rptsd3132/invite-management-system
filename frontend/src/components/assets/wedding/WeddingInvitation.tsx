import { useEffect, useState, type ReactNode } from "react";

interface WeddingInvitationProps {
  guestName?: string;
  brideName?: string;
  groomName?: string;
  date?: string;
  time?: string;
  location?: string;
  eventName?: string;
  companyName?: string;
  birthdayPerson?: string;
  children?: ReactNode;
}

export default function WeddingInvitation({
  guestName = "Our Special Guest",
  brideName = "Bride",
  groomName = "Groom",
  date = "",
  time = "",
  location = "",
  eventName = "Wedding Invitation",
  companyName,
  birthdayPerson,
  children,
}: WeddingInvitationProps) {
  const [opening, setOpening] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const openInvitation = () => {
    if (opening || revealed) return;

    setOpening(true);

    window.setTimeout(() => {
      setRevealed(true);
    }, 1500);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      openInvitation();
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f7efe4] via-[#fffaf3] to-[#ead8c1]">
      {/* REAL SELECTED TEMPLATE */}
      <div
        className={`relative z-10 min-h-screen transition-all duration-1000 ${
          revealed
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-[0.96] opacity-0"
        }`}
      >
        <div className="min-h-screen px-4 py-8">
          <div className="mx-auto w-full max-w-4xl">
            {children ?? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-2xl">
                <p className="text-sm uppercase tracking-[0.3em] text-amber-700">
                  Wedding Invitation
                </p>

                <h1 className="mt-6 font-serif text-4xl text-stone-800">
                  {brideName} & {groomName}
                </h1>

                <p className="mt-6 text-stone-500">
                  Dear {guestName}, you are warmly invited.
                </p>

                <div className="mt-6 space-y-1 text-sm text-stone-500">
                  {date && <p>{date}</p>}
                  {time && <p>{time}</p>}
                  {location && <p>{location}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OPENING SCREEN */}
      <div
        className={`absolute inset-0 z-30 flex items-center justify-center px-4 transition-all duration-1000 ${
          revealed
            ? "pointer-events-none scale-105 opacity-0"
            : "scale-100 opacity-100"
        }`}
      >
        {/* glow */}
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/30 blur-[110px]" />

        <button
          type="button"
          onClick={openInvitation}
          className="group relative w-full max-w-xl"
        >
          {/* envelope shadow */}
          <div className="absolute inset-x-8 bottom-2 h-16 rounded-full bg-stone-900/15 blur-2xl" />

          {/* envelope body */}
          <div
            className={`relative mx-auto aspect-[1.45/1] w-full max-w-[560px] overflow-hidden rounded-[28px] border border-white/80 bg-[#efe0ca] shadow-[0_35px_100px_rgba(91,65,35,0.25)] transition-all duration-1000 ${
              opening ? "translate-y-8 scale-[1.03]" : "group-hover:-translate-y-2"
            }`}
          >
            {/* back */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f6ead8] to-[#ddc09a]" />

            {/* letter */}
            <div
              className={`absolute left-[8%] top-[12%] h-[78%] w-[84%] rounded-[20px] border border-amber-100 bg-[#fffdf8] px-8 py-8 text-center shadow-xl transition-all duration-[1200ms] ${
                opening
                  ? "-translate-y-[72%] scale-100"
                  : "translate-y-[20%] scale-[0.94]"
              }`}
            >
              <div className="mx-auto h-px w-20 bg-amber-300" />

              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.45em] text-amber-700">
                You Are Invited
              </p>

              <h1 className="mt-5 font-serif text-3xl text-stone-800">
                {brideName}
                <span className="mx-3 text-amber-500">&</span>
                {groomName}
              </h1>

              <p className="mt-5 text-sm text-stone-500">
                Specially for {guestName}
              </p>
            </div>

            {/* left envelope fold */}
            <div className="absolute bottom-0 left-0 h-full w-[58%] origin-bottom-left bg-[#e4c9a5] [clip-path:polygon(0_30%,100%_100%,0_100%)]" />

            {/* right envelope fold */}
            <div className="absolute bottom-0 right-0 h-full w-[58%] origin-bottom-right bg-[#d9b98f] [clip-path:polygon(100%_30%,0_100%,100%_100%)]" />

            {/* bottom fold */}
            <div className="absolute bottom-0 left-0 h-[58%] w-full bg-[#ead5b7] [clip-path:polygon(0_100%,50%_20%,100%_100%)]" />

            {/* flap */}
            <div
              className={`absolute left-0 top-0 z-20 h-[58%] w-full origin-top bg-gradient-to-b from-[#f5e4cb] to-[#d7b58a] [clip-path:polygon(0_0,100%_0,50%_100%)] transition-transform duration-1000 ${
                opening
                  ? "[transform:perspective(900px)_rotateX(175deg)]"
                  : "[transform:perspective(900px)_rotateX(0deg)]"
              }`}
            />

            {/* wax seal */}
            <div
              className={`absolute left-1/2 top-[42%] z-30 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full border-4 border-[#a96343]/30 bg-gradient-to-br from-[#b96d4b] to-[#7d3d2c] text-lg font-semibold text-[#f8dca7] shadow-xl transition-all duration-700 ${
                opening
                  ? "scale-0 rotate-45 opacity-0"
                  : "scale-100 opacity-100"
              }`}
            >
              {brideName.charAt(0)}
              <span className="mx-1 text-xs">&</span>
              {groomName.charAt(0)}
            </div>
          </div>

          <div
            className={`mt-10 text-center transition-all duration-500 ${
              opening ? "translate-y-4 opacity-0" : "opacity-100"
            }`}
          >
            <p className="font-serif text-2xl text-stone-800">
              {brideName} & {groomName}
            </p>

            <p className="mt-2 text-sm text-stone-500">
              A special invitation awaits you
            </p>

            <span className="mt-6 inline-flex rounded-full border border-amber-300 bg-white/70 px-8 py-3 text-sm font-semibold text-amber-900 shadow-lg backdrop-blur transition-all duration-300 group-hover:scale-105 group-hover:bg-white">
              Open Wedding Invitation
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}