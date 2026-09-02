import { useEffect, useRef, useState, type ReactElement } from "react";

export interface KasunNethmiExactWeddingTemplateProps {
  eventName?: string;
  brideName?: string;
  groomName?: string;
  guestName?: string;
  date?: string;
  time?: string;
  location?: string;
  category?: string;
  language?: "en" | "si";
  compact?: boolean;
}

function coupleNames(eventName?: string, groomName?: string, brideName?: string) {
  const parts = eventName?.split(/\s+(?:&|and|සහ)\s+/i) ?? [];
  return {
    groom: groomName && groomName !== "Groom" ? groomName : parts[0]?.trim() || "Kasun",
    bride: brideName && brideName !== "Bride" ? brideName : parts[1]?.trim() || "Nethmi",
  };
}

function eventDate(date?: string, time?: string) {
  if (!date) return { dateText: "Saturday, 14 March 2027", timeText: time || "At Six O'clock in the Evening" };
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return { dateText: date, timeText: time || "" };
  return {
    dateText: parsed.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    timeText: time || `At ${parsed.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`,
  };
}

export default function KasunNethmiExactWeddingTemplate({
  eventName,
  brideName,
  groomName,
  date,
  time,
  location,
  category = "Wedding",
  compact = false,
}: KasunNethmiExactWeddingTemplateProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);
  const cardRef = useRef<HTMLElement | null>(null);
  const names = coupleNames(eventName, groomName, brideName);
  const details = eventDate(date, time);
  const venue = location || "Colombo, Sri Lanka";

  useEffect(() => {
    setParticles(Array.from({ length: 20 }, (_, index) => index));
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isOpen || !cardRef.current) return;
      const rotateX = (event.clientY / window.innerHeight - 0.5) * -8;
      const rotateY = (event.clientX / window.innerWidth - 0.5) * 8;
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isOpen]);

  return (
    <div className={`exact-wedding-template ${isOpen ? "is-open" : ""} ${compact ? "is-compact" : ""}`}>
      <style>{`
        .exact-wedding-template { position: relative; width: 100%; overflow-x: hidden; background: #FAF7F0; color: #222220; font-family: Montserrat, sans-serif; }
        .exact-wedding-template * { box-sizing: border-box; }
        .exact-wedding-template .paper-texture { background-image: radial-gradient(#E5DFD3 .75px, transparent .75px); background-size: 16px 16px; }
        .exact-wedding-template .gold-text { background: linear-gradient(135deg,#8B6F3E,#D4AF37 25%,#F8E8C0 50%,#D4AF37 75%,#8B6F3E); background-size: 200% auto; background-clip: text; -webkit-background-clip: text; color: transparent; animation: exactGold 6s ease infinite; }
        .exact-wedding-template .serif { font-family: Cinzel, Georgia, serif; }
        .exact-wedding-template .script { font-family: 'Great Vibes', cursive; }
        .exact-wedding-template .envelope { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(11,34,27,.95); perspective: 1400px; transition: opacity 1s cubic-bezier(.16,1,.3,1) .7s, visibility 1s ease .7s; }
        .exact-wedding-template.is-open .envelope { opacity: 0; visibility: hidden; pointer-events: none; }
        .exact-wedding-template .envelope-box { position: relative; width: min(100%, 32rem); aspect-ratio: 4 / 2.8; display: flex; align-items: center; justify-content: center; padding: 2rem; border: 1px solid rgba(212,175,55,.4); border-radius: 4px; background: #F1EAD9; box-shadow: 0 25px 50px rgba(0,0,0,.3); }
        .exact-wedding-template .envelope-flap { position: absolute; inset: 0 0 auto; z-index: 3; height: 60%; transform-origin: 50% 0%; transform-style: preserve-3d; transition: transform .9s cubic-bezier(.16,1,.3,1); pointer-events: none; }
        .exact-wedding-template.is-open .envelope-flap { transform: rotateX(-170deg); }
        .exact-wedding-template .envelope-box::after { content: ""; position: absolute; inset: .75rem; z-index: 1; border: 1px solid rgba(212,175,55,.4); border-radius: 4px; pointer-events: none; }
        .exact-wedding-template .seal { position: relative; z-index: 2; width: 5rem; height: 5rem; border: 0; border-radius: 999px; padding: 2px; background: linear-gradient(135deg,#8B6F3E,#D4AF37,#F8E8C0); cursor: pointer; }
        .exact-wedding-template .seal-inner { display: grid; height: 100%; place-items: center; border: 1px solid rgba(212,175,55,.6); border-radius: inherit; background: #0B221B; }
        .exact-wedding-template.is-open .seal { opacity: 0; transform: translateY(1rem) scale(.5) rotate(-30deg); transition: opacity .4s ease, transform .5s cubic-bezier(.34,1.56,.64,1); }
        .exact-wedding-template .envelope-copy { position: absolute; bottom: 2rem; text-align: center; }
        .exact-wedding-template .card-area { position: relative; z-index: 2; display: flex; min-height: 100vh; align-items: center; justify-content: center; padding: 3rem 1rem; }
        .exact-wedding-template.is-compact .card-area { min-height: 0; padding: 1rem; }
        .exact-wedding-template .card { position: relative; width: 100%; max-width: 36rem; padding: 4rem; border: 2px solid rgba(212,175,55,.3); background: rgba(250,247,240,.88); box-shadow: 0 25px 60px -15px rgba(0,0,0,.15); text-align: center; opacity: 0; transform: translateY(30px) scale(.95); transition: opacity 1.2s ease .6s, transform 1.2s ease .6s; }
        .exact-wedding-template.is-open .card { opacity: 1; transform: translateY(0) scale(1); }
        .exact-wedding-template.is-compact .card { padding: 2rem; }
        .exact-wedding-template.is-compact .envelope { display: none; }
        .exact-wedding-template.is-compact .card { opacity: 1; transform: none; }
        .exact-wedding-template .inner-border { position: absolute; inset: 1.25rem; border: 1px solid rgba(212,175,55,.4); pointer-events: none; }
        .exact-wedding-template .inner-border.second { inset: 1.5rem; border-color: rgba(212,175,55,.2); }
        .exact-wedding-template .names { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: .25rem .75rem; margin: 1.5rem 0; }
        .exact-wedding-template .details { margin: 2rem 0; }
        .exact-wedding-template .location { font-size: .75rem; letter-spacing: .2em; text-transform: uppercase; }
        .exact-wedding-template .dust { position: fixed; z-index: 1; width: 4px; height: 4px; border-radius: 50%; background: radial-gradient(circle,rgba(212,175,55,.8),transparent 70%); animation: exactFloat 14s linear infinite; pointer-events: none; }
        @keyframes exactGold { 0%,100% { background-position: 0 50%; } 50% { background-position: 100% 50%; } }
        @keyframes exactFloat { from { transform: translateY(100vh); opacity: 0; } 30%,80% { opacity: .6; } to { transform: translateY(-100vh); opacity: 0; } }
        @media (max-width: 640px) { .exact-wedding-template .card { padding: 2.5rem 1.5rem; } .exact-wedding-template .names h1 { font-size: 2rem; } }
      `}</style>

      <div className="paper-texture">
        {particles.map((particle) => <span key={particle} className="dust" style={{ left: `${(particle * 37) % 100}%`, bottom: "-20px", animationDelay: `${particle * 0.18}s` }} />)}

        <div className="envelope">
          <div className="envelope-box">
            <div className="envelope-flap">
              <svg width="100%" height="100%" viewBox="0 0 300 180" preserveAspectRatio="none">
                <polygon points="0,0 300,0 150,150" fill="#F1EAD9" stroke="#D4AF37" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="inner-border" />
            <button type="button" className="seal" onClick={() => setIsOpen(true)} aria-label="Open wedding invitation">
              <span className="seal-inner script gold-text">{names.groom.charAt(0)} &amp; {names.bride.charAt(0)}</span>
            </button>
            <div className="envelope-copy">
              <p className="serif" style={{ margin: 0, fontSize: 11, letterSpacing: ".35em", textTransform: "uppercase", color: "#8B6F3E" }}>For Our Cherished Guests</p>
              <p style={{ margin: ".5rem 0 0", fontSize: 9, letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(34,34,32,.6)" }}>Tap Seal To Open</p>
            </div>
          </div>
        </div>

        <main className="card-area">
          <article ref={cardRef} className="card">
            <div className="inner-border" /><div className="inner-border second" />
            <header className="serif" style={{ position: "relative", zIndex: 1 }}>
              <p style={{ margin: 0, fontSize: 11, letterSpacing: ".4em", color: "#8B6F3E", textTransform: "uppercase" }}>✦ {category} Invitation ✦</p>
              <h2 style={{ margin: "1rem 0", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 300, letterSpacing: ".25em", textTransform: "uppercase" }}>Together with their families</h2>
              <p style={{ margin: 0, fontSize: 12, fontStyle: "italic", color: "rgba(34,34,32,.6)" }}>they request the honour of your presence to celebrate their marriage</p>
            </header>

            <div className="serif" style={{ margin: "1.5rem 0", color: "rgba(212,175,55,.7)", fontSize: 24 }}>⌒⌒</div>
            <section className="names">
              <h1 className="serif gold-text" style={{ margin: 0, fontSize: "clamp(2.25rem, 8vw, 3.75rem)", letterSpacing: ".04em", textTransform: "uppercase" }}>{names.groom}</h1>
              <span className="script" style={{ fontSize: "clamp(2.5rem, 9vw, 3.75rem)", color: "#8B6F3E" }}>&amp;</span>
              <h1 className="serif gold-text" style={{ margin: 0, fontSize: "clamp(2.25rem, 8vw, 3.75rem)", letterSpacing: ".04em", textTransform: "uppercase" }}>{names.bride}</h1>
            </section>

            <div style={{ margin: "1.5rem 0", color: "#D4AF37" }}>♡</div>
            <section className="details serif">
              <p style={{ margin: 0, fontSize: "clamp(1rem, 3vw, 1.25rem)", letterSpacing: ".08em" }}>{details.dateText}</p>
              <p style={{ margin: ".4rem 0 1.5rem", fontSize: 12, fontWeight: 600, letterSpacing: ".25em", color: "#8B6F3E", textTransform: "uppercase" }}>{details.timeText}</p>
              <div style={{ width: 64, height: 1, margin: "0 auto 1.5rem", background: "#D4AF37" }} />
              <p style={{ margin: 0, fontSize: "clamp(1rem, 3vw, 1.25rem)", letterSpacing: ".04em" }}>The Grand Ballroom</p>
              <p className="location" style={{ margin: ".4rem 0 0", color: "rgba(34,34,32,.7)" }}>{venue}</p>
            </section>
            <p className="serif" style={{ maxWidth: 320, margin: "2rem auto 0", fontSize: 12, fontStyle: "italic", lineHeight: 1.6, color: "rgba(34,34,32,.8)" }}>&quot;We would be delighted to celebrate this beautiful moment with you.&quot;</p>
          </article>
        </main>
      </div>
    </div>
  );
}
