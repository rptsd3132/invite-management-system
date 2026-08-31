import { useState, type ReactNode } from "react";

interface BirthdayInvitationProps {
  guestName?: string;
  birthdayPerson?: string;
  age?: string;
  date?: string;
  time?: string;
  location?: string;
  children?: ReactNode;
}

export default function BirthdayInvitation({
  guestName = "Special Guest",
  birthdayPerson = "Birthday Star",
  age = "",
  date = "",
  time = "",
  location = "",
  children,
}: BirthdayInvitationProps) {
  const [opening, setOpening] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const openInvitation = () => {
    if (opening || revealed) return;

    setOpening(true);

    window.setTimeout(() => {
      setRevealed(true);
    }, 1450);
  };

  const confetti = [
    ["left-[8%]", "top-[18%]", "rotate-12"],
    ["left-[18%]", "top-[35%]", "-rotate-12"],
    ["left-[28%]", "top-[12%]", "rotate-45"],
    ["right-[8%]", "top-[20%]", "-rotate-12"],
    ["right-[20%]", "top-[38%]", "rotate-12"],
    ["right-[30%]", "top-[10%]", "-rotate-45"],
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#6d28d9] via-[#c026d3] to-[#f59e0b]">
      {/* REAL TEMPLATE */}
      <div
        className={`relative z-10 min-h-screen transition-all duration-1000 ${
          revealed
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-[0.95] opacity-0"
        }`}
      >
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-amber-50 px-4 py-8">
          <div className="mx-auto w-full max-w-4xl">
            {children ?? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-2xl">
                <h1 className="text-4xl font-black text-slate-900">
                  {birthdayPerson}
                </h1>

                {age && (
                  <p className="mt-2 font-bold text-violet-600">
                    Turning {age}
                  </p>
                )}

                <p className="mt-6 text-slate-500">
                  Dear {guestName}, come celebrate with us!
                </p>

                {date && <p className="mt-6 text-slate-500">{date}</p>}
                {time && <p className="text-slate-500">{time}</p>}
                {location && <p className="text-slate-500">{location}</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OPENING */}
      <div
        className={`absolute inset-0 z-30 flex items-center justify-center overflow-hidden px-4 transition-all duration-1000 ${
          revealed
            ? "pointer-events-none scale-110 opacity-0"
            : "scale-100 opacity-100"
        }`}
      >
        <div className="absolute h-[500px] w-[500px] rounded-full bg-white/15 blur-[100px]" />

        {confetti.map(([x, y, rotate], index) => (
          <div
            key={index}
            className={`absolute ${x} ${y} ${rotate} h-3 w-8 rounded-full transition-all duration-1000 ${
              opening
                ? "translate-y-[-100px] scale-125 opacity-0"
                : "opacity-80"
            } ${
              index % 3 === 0
                ? "bg-yellow-300"
                : index % 3 === 1
                  ? "bg-pink-300"
                  : "bg-cyan-300"
            }`}
          />
        ))}

        <button
          type="button"
          onClick={openInvitation}
          className="group relative w-full max-w-md"
        >
          {/* bow loops */}
          <div
            className={`absolute left-1/2 top-0 z-30 h-24 w-28 -translate-x-[95%] rounded-[50%] border-[18px] border-yellow-300 transition-all duration-700 ${
              opening
                ? "-translate-x-[160%] -translate-y-16 -rotate-45 scale-75 opacity-0"
                : "-rotate-12"
            }`}
          />

          <div
            className={`absolute left-1/2 top-0 z-30 h-24 w-28 -translate-x-[5%] rounded-[50%] border-[18px] border-yellow-300 transition-all duration-700 ${
              opening
                ? "translate-x-[60%] -translate-y-16 rotate-45 scale-75 opacity-0"
                : "rotate-12"
            }`}
          />

          {/* gift lid */}
          <div
            className={`absolute left-1/2 top-[70px] z-20 h-24 w-[112%] -translate-x-1/2 rounded-[24px] bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 shadow-2xl transition-all duration-1000 ${
              opening
                ? "-translate-y-[180px] rotate-6 scale-110 opacity-0"
                : "group-hover:-translate-y-2"
            }`}
          >
            <div className="absolute left-1/2 top-0 h-full w-14 -translate-x-1/2 bg-yellow-500/70" />
          </div>

          {/* box */}
          <div
            className={`relative mt-24 min-h-[420px] overflow-hidden rounded-[34px] bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-[0_35px_100px_rgba(30,0,80,0.45)] transition-all duration-1000 ${
              opening ? "scale-110 opacity-0" : "group-hover:-translate-y-2"
            }`}
          >
            <div className="absolute left-1/2 top-0 h-full w-16 -translate-x-1/2 bg-yellow-300" />

            <div className="relative z-10 flex min-h-[420px] flex-col items-center justify-center px-10 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-4xl shadow-inner backdrop-blur">
                🎉
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.4em] text-yellow-200">
                Special Delivery
              </p>

              <h1 className="mt-4 text-3xl font-black text-white">
                {birthdayPerson}
              </h1>

              {age && (
                <p className="mt-2 font-bold text-yellow-200">
                  Turning {age}
                </p>
              )}

              <p className="mt-5 text-sm text-violet-100">
                A birthday surprise for {guestName}
              </p>

              <span className="mt-8 rounded-full bg-white px-8 py-3 text-sm font-bold text-violet-700 shadow-xl transition-transform duration-300 group-hover:scale-105">
                Unwrap Invitation
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}