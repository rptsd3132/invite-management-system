import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface OfficeInvitationProps {
  guestName?: string;
  eventName?: string;
  companyName?: string;
  date?: string;
  time?: string;
  location?: string;
  children?: ReactNode;
}

export default function OfficeInvitation({
  guestName = "Guest",
  eventName = "Corporate Event",
  companyName = "Corporate Event",
  date = "",
  time = "",
  location = "",
  children,
}: OfficeInvitationProps): React.ReactElement {
  const [ready, setReady] = useState(false);
  const [opening, setOpening] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setReady(true);
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const openInvitation = (): void => {
    if (opening || revealed) return;

    setOpening(true);

    window.setTimeout(() => {
      setRevealed(true);
    }, 1900);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#02050c]">
      {/* =====================================================
          REAL OFFICE TEMPLATE
      ====================================================== */}

      <div
        className={`
          relative
          z-10
          min-h-screen
          transition-all
          duration-[1200ms]
          ease-out
          ${
            revealed
              ? "scale-100 opacity-100 blur-0"
              : "pointer-events-none scale-[0.965] opacity-0 blur-md"
          }
        `}
      >
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 px-4 py-8">
          <div className="mx-auto w-full max-w-4xl">
            {children ?? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-600">
                  Official Invitation
                </p>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                  {eventName}
                </h1>

                <p className="mt-3 text-slate-500">
                  {companyName}
                </p>

                <p className="mt-8 font-semibold text-slate-800">
                  {guestName}
                </p>

                {date && (
                  <p className="mt-6 text-slate-500">
                    {date}
                  </p>
                )}

                {time && (
                  <p className="text-slate-500">
                    {time}
                  </p>
                )}

                {location && (
                  <p className="text-slate-500">
                    {location}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          EXECUTIVE PORTAL REVEAL
      ====================================================== */}

      <div
        className={`
          fixed
          inset-0
          z-50
          overflow-hidden
          bg-[#02050c]
          transition-opacity
          duration-1000
          ${
            revealed
              ? "pointer-events-none opacity-0"
              : "opacity-100"
          }
        `}
      >
        {/* ===================================================
            CINEMATIC BACKGROUND
        ==================================================== */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(37,99,235,0.18),transparent_30%),radial-gradient(circle_at_50%_120%,rgba(14,165,233,0.13),transparent_45%),linear-gradient(135deg,#01030a_0%,#06101f_48%,#02050c_100%)]" />

        {/* VERTICAL ARCHITECTURAL LINES */}

        <div className="absolute inset-0 opacity-[0.15]">
          <div className="absolute bottom-0 left-[8%] top-0 w-px bg-gradient-to-b from-transparent via-blue-300/40 to-transparent" />
          <div className="absolute bottom-0 left-[18%] top-0 w-px bg-gradient-to-b from-transparent via-slate-400/20 to-transparent" />
          <div className="absolute bottom-0 right-[8%] top-0 w-px bg-gradient-to-b from-transparent via-blue-300/40 to-transparent" />
          <div className="absolute bottom-0 right-[18%] top-0 w-px bg-gradient-to-b from-transparent via-slate-400/20 to-transparent" />
        </div>

        {/* HORIZONTAL LIGHT GUIDES */}

        <div className="absolute left-0 top-[18%] h-px w-full bg-gradient-to-r from-transparent via-blue-300/[0.12] to-transparent" />
        <div className="absolute bottom-[14%] left-0 h-px w-full bg-gradient-to-r from-transparent via-blue-300/[0.08] to-transparent" />

        {/* AMBIENT LIGHT */}

        <div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.08] blur-[150px]" />

        {/* ===================================================
            TOP LABEL
        ==================================================== */}

        <div
          className={`
            absolute
            left-1/2
            top-8
            z-30
            -translate-x-1/2
            transition-all
            duration-1000
            ${
              ready && !opening
                ? "translate-y-0 opacity-100"
                : "-translate-y-3 opacity-0"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-blue-300/70" />

            <p className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.34em] text-blue-100/65">
              Executive Portal
            </p>

            <span className="h-px w-10 bg-gradient-to-l from-transparent to-blue-300/70" />
          </div>
        </div>

        {/* ===================================================
            MAIN PORTAL
        ==================================================== */}

        <div className="relative z-20 flex min-h-screen items-center justify-center px-5 py-24">
          <div className="relative w-full max-w-[760px]">
            {/* OUTER PORTAL HALO */}

            <div
              className={`
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-[620px]
                w-[620px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-blue-300/[0.07]
                transition-all
                duration-[1600ms]
                ${
                  ready
                    ? "scale-100 opacity-100"
                    : "scale-[0.8] opacity-0"
                }
                ${
                  opening
                    ? "scale-125 opacity-0"
                    : ""
                }
              `}
            />

            <div
              className={`
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-[520px]
                w-[520px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-dashed
                border-cyan-200/[0.06]
                transition-all
                duration-[1700ms]
                ${
                  ready
                    ? "rotate-0 scale-100 opacity-100"
                    : "-rotate-45 scale-[0.85] opacity-0"
                }
                ${
                  opening
                    ? "rotate-90 scale-125 opacity-0"
                    : ""
                }
              `}
            />

            {/* ===============================================
                PORTAL FRAME
            ================================================ */}

            <button
              type="button"
              onClick={openInvitation}
              aria-label="Enter executive invitation portal"
              className="group relative block w-full focus:outline-none"
            >
              {/* FRAME GLOW */}

              <div
                className={`
                  absolute
                  -inset-[1px]
                  rounded-[34px]
                  bg-gradient-to-r
                  from-blue-500/35
                  via-cyan-200/60
                  to-indigo-500/35
                  blur-[1px]
                  transition-opacity
                  duration-700
                  ${
                    opening
                      ? "opacity-100"
                      : "opacity-35 group-hover:opacity-75"
                  }
                `}
              />

              {/* PORTAL BODY */}

              <div
                className={`
                  relative
                  min-h-[540px]
                  overflow-hidden
                  rounded-[34px]
                  border
                  border-white/[0.08]
                  bg-[#050b15]/95
                  shadow-[0_50px_140px_rgba(0,0,0,0.72)]
                  backdrop-blur-2xl
                  transition-all
                  duration-[1100ms]
                  ease-out
                  ${
                    ready
                      ? "translate-y-0 scale-100 opacity-100"
                      : "translate-y-10 scale-[0.94] opacity-0"
                  }
                  ${
                    opening
                      ? "scale-[1.035] shadow-[0_0_120px_rgba(59,130,246,0.18)]"
                      : "group-hover:-translate-y-1"
                  }
                `}
              >
                {/* TOP METALLIC LINE */}

                <div className="absolute left-[16%] right-[16%] top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/80 to-transparent" />

                {/* CORNER ACCENTS */}

                <div className="absolute left-5 top-5 h-7 w-7 border-l border-t border-blue-300/25" />
                <div className="absolute right-5 top-5 h-7 w-7 border-r border-t border-blue-300/25" />
                <div className="absolute bottom-5 left-5 h-7 w-7 border-b border-l border-blue-300/15" />
                <div className="absolute bottom-5 right-5 h-7 w-7 border-b border-r border-blue-300/15" />

                {/* =============================================
                    CONTENT
                ============================================== */}

                <div
                  className={`
                    relative
                    z-20
                    flex
                    min-h-[540px]
                    flex-col
                    justify-between
                    p-8
                    transition-all
                    duration-700
                    sm:p-12
                    ${
                      opening
                        ? "scale-[0.96] opacity-0 blur-sm"
                        : "opacity-100"
                    }
                  `}
                >
                  {/* HEADER */}

                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="h-px w-8 bg-blue-300/60" />

                        <p className="text-[9px] font-bold uppercase tracking-[0.34em] text-blue-200">
                          Official Invitation
                        </p>
                      </div>

                      <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-slate-600">
                        Private Executive Access
                      </p>
                    </div>

                    {/* EXECUTIVE MARK */}

                    <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-blue-300/[0.14]">
                      <div className="absolute inset-2 rounded-full border border-cyan-200/[0.08]" />

                      <div className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_22px_rgba(165,243,252,0.85)]" />
                    </div>
                  </div>

                  {/* MAIN EVENT AREA */}

                  <div className="my-12">
                    <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-slate-500">
                      You are invited to
                    </p>

                    <h1 className="mt-5 max-w-[620px] text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl">
                      {eventName}
                    </h1>

                    <div className="mt-5 flex items-center gap-4">
                      <span className="h-px w-12 bg-gradient-to-r from-blue-400 to-cyan-200" />

                      <p className="text-sm font-medium tracking-wide text-blue-300">
                        {companyName}
                      </p>
                    </div>
                  </div>

                  {/* GUEST AREA */}

                  <div className="grid gap-7 border-t border-white/[0.06] pt-7 sm:grid-cols-[1fr_auto] sm:items-end">
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-[0.28em] text-slate-600">
                        Prepared Exclusively For
                      </p>

                      <p className="mt-2 text-xl font-medium tracking-tight text-white">
                        {guestName}
                      </p>

                      {(date || time || location) && (
                        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                          {(date || time) && (
                            <span>
                              {date}
                              {date && time ? " · " : ""}
                              {time}
                            </span>
                          )}

                          {location && (
                            <span>
                              {location}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* ENTER BUTTON */}

                    <div className="inline-flex items-center gap-4 rounded-full border border-blue-300/20 bg-blue-300/[0.04] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100 transition-all duration-300 group-hover:border-cyan-200/50 group-hover:bg-cyan-200 group-hover:text-slate-950 group-hover:shadow-[0_0_35px_rgba(165,243,252,0.22)]">
                      Enter Portal

                      <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </div>

                {/* =============================================
                    CENTER PORTAL SEAM
                ============================================== */}

                <div
                  className={`
                    pointer-events-none
                    absolute
                    bottom-0
                    left-1/2
                    top-0
                    z-40
                    w-px
                    -translate-x-1/2
                    bg-gradient-to-b
                    from-transparent
                    via-cyan-100
                    to-transparent
                    shadow-[0_0_28px_rgba(165,243,252,0.9)]
                    transition-all
                    duration-[1100ms]
                    ${
                      opening
                        ? "scale-y-100 opacity-100"
                        : "scale-y-0 opacity-0"
                    }
                  `}
                />

                {/* =============================================
                    LEFT PORTAL DOOR
                ============================================== */}

                <div
                  className={`
                    pointer-events-none
                    absolute
                    bottom-0
                    left-0
                    top-0
                    z-30
                    w-1/2
                    origin-right
                    border-r
                    border-blue-200/[0.08]
                    bg-[linear-gradient(90deg,#040914_0%,#07111f_100%)]
                    transition-all
                    duration-[1550ms]
                    ease-[cubic-bezier(0.76,0,0.24,1)]
                    ${
                      opening
                        ? "-translate-x-[104%] opacity-0"
                        : "translate-x-0 opacity-0"
                    }
                  `}
                />

                {/* =============================================
                    RIGHT PORTAL DOOR
                ============================================== */}

                <div
                  className={`
                    pointer-events-none
                    absolute
                    bottom-0
                    right-0
                    top-0
                    z-30
                    w-1/2
                    origin-left
                    border-l
                    border-blue-200/[0.08]
                    bg-[linear-gradient(90deg,#07111f_0%,#040914_100%)]
                    transition-all
                    duration-[1550ms]
                    ease-[cubic-bezier(0.76,0,0.24,1)]
                    ${
                      opening
                        ? "translate-x-[104%] opacity-0"
                        : "translate-x-0 opacity-0"
                    }
                  `}
                />

                {/* =============================================
                    PORTAL LIGHT EXPANSION
                ============================================== */}

                <div
                  className={`
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    z-50
                    h-[120%]
                    -translate-x-1/2
                    -translate-y-1/2
                    bg-gradient-to-r
                    from-transparent
                    via-cyan-100
                    to-transparent
                    shadow-[0_0_80px_rgba(165,243,252,0.7)]
                    transition-all
                    duration-[1400ms]
                    ease-out
                    ${
                      opening
                        ? "w-[160%] opacity-0"
                        : "w-0 opacity-0"
                    }
                  `}
                />
              </div>
            </button>

            {/* ===============================================
                BOTTOM CAPTION
            ================================================ */}

            <div
              className={`
                mt-7
                flex
                items-center
                justify-center
                gap-3
                transition-all
                duration-700
                ${
                  ready && !opening
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0"
                }
              `}
            >
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-slate-700" />

              <p className="text-[8px] font-semibold uppercase tracking-[0.32em] text-slate-600">
                Select to enter invitation
              </p>

              <span className="h-px w-12 bg-gradient-to-l from-transparent to-slate-700" />
            </div>
          </div>
        </div>

        {/* ===================================================
            FINAL FULL-SCREEN LIGHT
        ==================================================== */}

        <div
          className={`
            pointer-events-none
            absolute
            inset-y-0
            left-1/2
            z-[70]
            -translate-x-1/2
            bg-gradient-to-r
            from-transparent
            via-blue-50
            to-transparent
            transition-all
            duration-[1350ms]
            ease-out
            ${
              opening
                ? "w-[200%] opacity-0"
                : "w-0 opacity-0"
            }
          `}
        />
      </div>
    </div>
  );
}