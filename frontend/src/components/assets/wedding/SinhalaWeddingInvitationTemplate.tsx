import { useEffect, useRef, useState, type ReactElement } from "react";

interface SinhalaWeddingInvitationTemplateProps {
  eventName?: string;
  brideName?: string;
  groomName?: string;
  date?: string;
  time?: string;
  location?: string;
  category?: string;
  compact?: boolean;
}

function getNames(eventName?: string, groomName?: string, brideName?: string) {
  const parts = eventName?.split(/\s+(?:සහ|&|and)\s+/i) ?? [];
  return {
    groom: groomName && groomName !== "Groom" ? groomName : parts[0] || "කසුන්",
    bride: brideName && brideName !== "Bride" ? brideName : parts[1] || "නෙත්මි",
  };
}

function getDate(value?: string, time?: string) {
  if (!value) return { dateText: "2027 මාර්තු 14 වන සෙනසුරාදා", timeText: time || "සවස 6.00 සිට ඉදිරියට" };
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return { dateText: value, timeText: time || "" };
  return {
    dateText: parsed.toLocaleDateString("si-LK", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    timeText: time || parsed.toLocaleTimeString("si-LK", { hour: "numeric", minute: "2-digit", hour12: true }),
  };
}

export default function SinhalaWeddingInvitationTemplate({
  eventName,
  brideName,
  groomName,
  date,
  time,
  location,
  category = "මංගල ආරාධනා පත්‍රය",
  compact = false,
}: SinhalaWeddingInvitationTemplateProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);
  const cardRef = useRef<HTMLElement | null>(null);
  const names = getNames(eventName, groomName, brideName);
  const details = getDate(date, time);
  const venue = location || "කොළඹ, ශ්‍රී ලංකාව";

  useEffect(() => setParticles(Array.from({ length: 20 }, (_, index) => index)), []);

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
    <div className={`sinhala-wedding-template ${isOpen ? "is-open" : ""} ${compact ? "is-compact" : ""}`} lang="si">
      <style>{`
        .sinhala-wedding-template { position:relative; width:100%; overflow-x:hidden; background:#FAF7F0; color:#222220; font-family:'Abhaya Libre','Noto Serif Sinhala',serif; }
        .sinhala-wedding-template * { box-sizing:border-box; }
        .sinhala-wedding-template .paper { background-image:radial-gradient(#E5DFD3 .75px,transparent .75px); background-size:16px 16px; }
        .sinhala-wedding-template .gold { background:linear-gradient(135deg,#8B6F3E,#D4AF37 25%,#F8E8C0 50%,#D4AF37 75%,#8B6F3E); background-size:200% auto; background-clip:text; -webkit-background-clip:text; color:transparent; animation:sinhalaGold 6s ease infinite; }
        .sinhala-wedding-template .serif { font-family:Cinzel,serif; }
        .sinhala-wedding-template .script { font-family:'Great Vibes',cursive; }
        .sinhala-wedding-template .envelope { position:fixed; inset:0; z-index:50; display:flex; align-items:center; justify-content:center; padding:1rem; background:rgba(11,34,27,.95); perspective:1400px; transition:opacity 1s ease .7s,visibility 1s ease .7s; }
        .sinhala-wedding-template.is-open .envelope { opacity:0; visibility:hidden; pointer-events:none; }
        .sinhala-wedding-template .envelope-box { position:relative; width:min(100%,32rem); aspect-ratio:4/2.8; display:flex; align-items:center; justify-content:center; padding:2rem; border:1px solid rgba(212,175,55,.4); border-radius:4px; background:#F1EAD9; box-shadow:0 25px 50px rgba(0,0,0,.3); }
        .sinhala-wedding-template .flap { position:absolute; inset:0 0 auto; z-index:3; height:60%; transform-origin:50% 0; transform-style:preserve-3d; transition:transform .9s cubic-bezier(.16,1,.3,1); pointer-events:none; }
        .sinhala-wedding-template.is-open .flap { transform:rotateX(-170deg); }
        .sinhala-wedding-template .seal { position:relative; z-index:4; width:5rem; height:5rem; border:0; border-radius:999px; padding:2px; background:linear-gradient(135deg,#8B6F3E,#D4AF37,#F8E8C0); cursor:pointer; transition:opacity .4s ease,transform .5s ease; }
        .sinhala-wedding-template.is-open .seal { opacity:0; transform:scale(.5) rotate(-30deg); }
        .sinhala-wedding-template .seal-inner { display:grid; height:100%; place-items:center; border:1px solid rgba(212,175,55,.6); border-radius:inherit; background:#0B221B; }
        .sinhala-wedding-template .envelope-copy { position:absolute; bottom:2rem; z-index:4; text-align:center; }
        .sinhala-wedding-template .card-area { position:relative; z-index:2; display:flex; min-height:100vh; align-items:center; justify-content:center; padding:3rem 1rem; }
        .sinhala-wedding-template.is-compact .envelope { display:none; }
        .sinhala-wedding-template.is-compact .card-area { min-height:0; padding:1rem; }
        .sinhala-wedding-template .card { position:relative; width:100%; max-width:36rem; padding:4rem; border:2px solid rgba(212,175,55,.3); background:rgba(250,247,240,.88); box-shadow:0 25px 60px -15px rgba(0,0,0,.15); text-align:center; opacity:0; transform:translateY(30px) scale(.95); transition:opacity 1.2s ease .6s,transform 1.2s ease .6s; }
        .sinhala-wedding-template.is-open .card,.sinhala-wedding-template.is-compact .card { opacity:1; transform:none; }
        .sinhala-wedding-template.is-compact .card { padding:2rem; }
        .sinhala-wedding-template .border { position:absolute; inset:1.25rem; border:1px solid rgba(212,175,55,.4); pointer-events:none; }
        .sinhala-wedding-template .border.second { inset:1.5rem; border-color:rgba(212,175,55,.2); }
        .sinhala-wedding-template .names { display:flex; flex-direction:column; align-items:center; margin:1.5rem 0; }
        .sinhala-wedding-template .dust { position:fixed; z-index:1; width:4px; height:4px; border-radius:50%; background:radial-gradient(circle,rgba(212,175,55,.8),transparent 70%); animation:sinhalaFloat 14s linear infinite; pointer-events:none; }
        @keyframes sinhalaGold { 0%,100%{background-position:0 50%} 50%{background-position:100% 50%} }
        @keyframes sinhalaFloat { from{transform:translateY(100vh);opacity:0} 30%,80%{opacity:.6} to{transform:translateY(-100vh);opacity:0} }
        @media(max-width:640px){.sinhala-wedding-template .card{padding:2.5rem 1.5rem}.sinhala-wedding-template .names h1{font-size:2.25rem!important}}
      `}</style>
      <div className="paper">
        {particles.map((particle) => <span key={particle} className="dust" style={{ left: `${(particle * 37) % 100}%`, bottom: "-20px", animationDelay: `${particle * .18}s` }} />)}
        <div className="envelope">
          <div className="envelope-box">
            <div className="flap"><svg width="100%" height="100%" viewBox="0 0 300 180" preserveAspectRatio="none"><polygon points="0,0 300,0 150,150" fill="#F1EAD9" stroke="#D4AF37" strokeWidth="1.2" /></svg></div>
            <div className="border" />
            <button type="button" className="seal" onClick={() => setIsOpen(true)} aria-label="විවාහ ආරාධනාව විවෘත කරන්න"><span className="seal-inner script gold">{names.groom.charAt(0)} &amp; {names.bride.charAt(0)}</span></button>
            <div className="envelope-copy"><p style={{ margin:0, fontSize:12, letterSpacing:'.12em', fontWeight:600, color:'#8B6F3E' }}>ගෞරවනීය අමුත්තන් උදෙසා</p><p style={{ margin:'.5rem 0 0', fontSize:10, color:'rgba(34,34,32,.6)' }}>විවෘත කිරීමට සීල් එක තට්ටු කරන්න</p></div>
          </div>
        </div>
        <main className="card-area">
          <article ref={cardRef} className="card">
            <div className="border" /><div className="border second" />
            <header style={{ position:'relative', zIndex:1 }}>
              <p style={{ margin:0, fontSize:13, letterSpacing:'.12em', fontWeight:600, color:'#8B6F3E' }}>✦ {category} ✦</p>
              <h2 style={{ margin:'1rem 0', fontSize:14, fontWeight:400, letterSpacing:'.08em' }}>දෙමාපියන්ගේ ආශීර්වාදයෙන්</h2>
              <p style={{ margin:0, fontSize:13, fontStyle:'italic', color:'rgba(34,34,32,.7)' }}>අපගේ විවාහ මංගලෝත්සවය සැමරීම සඳහා ඔබගේ පැමිණීමේ ගෞරවය කාරුණිකව අයැද සිටිමු</p>
            </header>
            <div className="serif" style={{ margin:'1.5rem 0', color:'rgba(212,175,55,.7)', fontSize:24 }}>⌒⌒</div>
            <section className="names">
              <h1 className="gold" style={{ margin:0, fontSize:'clamp(2.5rem,8vw,3.5rem)', fontWeight:700 }}>{names.groom}</h1>
              <span className="script" style={{ fontSize:'clamp(2.5rem,9vw,3.75rem)', color:'#8B6F3E' }}>&amp;</span>
              <h1 className="gold" style={{ margin:0, fontSize:'clamp(2.5rem,8vw,3.5rem)', fontWeight:700 }}>{names.bride}</h1>
            </section>
            <div style={{ margin:'1.5rem 0', color:'#D4AF37' }}>♡</div>
            <section style={{ margin:'2rem 0' }}>
              <p style={{ margin:0, fontSize:'clamp(1rem,3vw,1.25rem)', fontWeight:600 }}>{details.dateText}</p>
              <p style={{ margin:'.4rem 0 1.5rem', fontSize:13, fontWeight:700, letterSpacing:'.08em', color:'#8B6F3E' }}>{details.timeText}</p>
              <div style={{ width:64, height:1, margin:'0 auto 1.5rem', background:'#D4AF37' }} />
              <p style={{ margin:0, fontSize:'clamp(1rem,3vw,1.25rem)', fontWeight:600 }}>ද ග්‍රෑන්ඩ් බෝල්රූම් (The Grand Ballroom)</p>
              <p style={{ margin:'.4rem 0 0', fontSize:13, color:'rgba(34,34,32,.7)' }}>{venue}</p>
            </section>
            <p style={{ maxWidth:320, margin:'2rem auto 0', fontSize:13, fontStyle:'italic', lineHeight:1.7, color:'rgba(34,34,32,.8)' }}>"අපගේ ජීවිතයේ මෙම සුන්දර මොහොත ඔබ සමඟ සැමරීමට ලැබීම අපට මහත් ප්‍රීතියකි."</p>
          </article>
        </main>
      </div>
    </div>
  );
}
