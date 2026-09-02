import { useEffect, useRef, useState, type ReactElement } from "react";

interface Props {
  eventName?: string;
  birthdayPerson?: string;
  age?: string;
  date?: string;
  time?: string;
  location?: string;
  category?: string;
  language?: "en" | "si";
  compact?: boolean;
}

function details(value?: string, time?: string) {
  if (!value) return { dateText: "2027 මාර්තු 14 වන සෙනසුරාදා", timeText: time || "රාත්‍රී 7.00 සිට ඉදිරියට" };
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return { dateText: value, timeText: time || "" };
  return {
    dateText: parsed.toLocaleDateString("si-LK", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    timeText: time || parsed.toLocaleTimeString("si-LK", { hour: "numeric", minute: "2-digit", hour12: true }),
  };
}

export default function SinhalaBirthdayInvitationTemplate({
  eventName,
  birthdayPerson = "කසුන්",
  age = "25",
  date,
  time,
  location,
  category = "විශේෂ ආරාධනාවයි",
  compact = false,
}: Props): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);
  const cardRef = useRef<HTMLElement | null>(null);
  const eventDetails = details(date, time);
  const venue = location || "හොටෙල් කිංස්බරි, කොළඹ";
  const title = birthdayPerson || eventName || "කසුන්";

  useEffect(() => setParticles(Array.from({ length: 30 }, (_, index) => index)), []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isOpen || !cardRef.current) return;
      const rotateX = (event.clientY / window.innerHeight - 0.5) * -10;
      const rotateY = (event.clientX / window.innerWidth - 0.5) * 10;
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isOpen]);

  return (
    <div className={`sinhala-birthday-template ${isOpen ? "is-open" : ""} ${compact ? "is-compact" : ""}`} lang="si">
      <style>{`
        .sinhala-birthday-template { position:relative; width:100%; overflow-x:hidden; background:#050A18; color:#FCFBF7; font-family:'Abhaya Libre','Noto Serif Sinhala',serif; }
        .sinhala-birthday-template * { box-sizing:border-box; }
        .sinhala-birthday-template .paper { background:radial-gradient(circle at 50% 20%,rgba(74,14,78,.5),transparent 38%),radial-gradient(circle at 90% 85%,rgba(255,215,0,.12),transparent 28%); }
        .sinhala-birthday-template .gold { background:linear-gradient(135deg,#FFD700,#E85D75 25%,#FFF099 50%,#C5A059 75%,#FFD700); background-size:200% auto; background-clip:text; -webkit-background-clip:text; color:transparent; animation:birthdayGold 5s ease infinite; }
        .sinhala-birthday-template .serif { font-family:Cinzel,'Playfair Display',serif; }
        .sinhala-birthday-template .script { font-family:'Great Vibes',cursive; }
        .sinhala-birthday-template .envelope { position:fixed; inset:0; z-index:50; display:flex; align-items:center; justify-content:center; padding:1rem; background:rgba(5,10,24,.96); perspective:1400px; transition:opacity 1s ease .7s,visibility 1s ease .7s; }
        .sinhala-birthday-template.is-open .envelope { opacity:0; visibility:hidden; pointer-events:none; }
        .sinhala-birthday-template .envelope-box { position:relative; width:min(100%,32rem); aspect-ratio:4/2.8; display:flex; align-items:center; justify-content:center; padding:2rem; border:1px solid rgba(255,215,0,.4); border-radius:12px; background:linear-gradient(135deg,#0B132B,#050A18,#4A0E4E); box-shadow:0 20px 50px rgba(0,0,0,.8); }
        .sinhala-birthday-template .flap { position:absolute; inset:0 0 auto; z-index:3; height:60%; transform-origin:50% 0; transform-style:preserve-3d; transition:transform .9s cubic-bezier(.16,1,.3,1); pointer-events:none; }
        .sinhala-birthday-template.is-open .flap { transform:rotateX(-170deg); }
        .sinhala-birthday-template .seal { position:relative; z-index:4; width:5rem; height:5rem; border:0; border-radius:999px; padding:2px; background:linear-gradient(135deg,#E85D75,#FFD700,#FFF099); cursor:pointer; transition:opacity .4s ease,transform .5s ease; }
        .sinhala-birthday-template.is-open .seal { opacity:0; transform:scale(.5) rotate(-30deg); }
        .sinhala-birthday-template .seal-inner { display:grid; height:100%; place-items:center; border:1px solid rgba(255,215,0,.6); border-radius:inherit; background:#0B132B; font-size:1.5rem; }
        .sinhala-birthday-template .envelope-copy { position:absolute; bottom:2rem; z-index:4; text-align:center; }
        .sinhala-birthday-template .card-area { position:relative; z-index:2; display:flex; min-height:100vh; align-items:center; justify-content:center; padding:3rem 1rem; }
        .sinhala-birthday-template.is-compact .envelope { display:none; }
        .sinhala-birthday-template.is-compact .card-area { min-height:0; padding:1rem; }
        .sinhala-birthday-template .card { position:relative; width:100%; max-width:36rem; padding:4rem; border:2px solid rgba(255,215,0,.4); border-radius:16px; background:rgba(11,19,43,.85); box-shadow:0 20px 50px rgba(0,0,0,.5),0 0 30px rgba(232,93,117,.15); text-align:center; opacity:0; transform:translateY(30px) scale(.95); transition:opacity 1.2s ease .6s,transform 1.2s ease .6s; }
        .sinhala-birthday-template.is-open .card,.sinhala-birthday-template.is-compact .card { opacity:1; transform:none; }
        .sinhala-birthday-template.is-compact .card { padding:2rem; }
        .sinhala-birthday-template .border { position:absolute; inset:1.25rem; border:1px solid rgba(255,215,0,.3); border-radius:12px; pointer-events:none; }
        .sinhala-birthday-template .border.second { inset:1.5rem; border-color:rgba(232,93,117,.2); border-radius:8px; }
        .sinhala-birthday-template .dust { position:fixed; z-index:1; width:5px; height:5px; border-radius:50%; animation:birthdayFloat 12s linear infinite; pointer-events:none; }
        @keyframes birthdayGold { 0%,100%{background-position:0 50%} 50%{background-position:100% 50%} }
        @keyframes birthdayFloat { from{transform:translateY(100vh) rotate(0);opacity:0} 20%,80%{opacity:.8} to{transform:translateY(-100vh) rotate(720deg);opacity:0} }
        @media(max-width:640px){.sinhala-birthday-template .card{padding:2.5rem 1.5rem}.sinhala-birthday-template .card h1{font-size:2.5rem!important}}
      `}</style>
      <div className="paper">
        {particles.map((particle) => <span key={particle} className="dust" style={{ left:`${(particle * 37) % 100}%`, bottom:"-20px", background:["#FFD700","#E85D75","#FFF099","#9B51E0","#4A90E2"][particle % 5], boxShadow:`0 0 10px ${["#FFD700","#E85D75","#FFF099","#9B51E0","#4A90E2"][particle % 5]}`, animationDelay:`${particle * .15}s` }} />)}
        <div className="envelope">
          <div className="envelope-box">
            <div className="flap"><svg width="100%" height="100%" viewBox="0 0 300 180" preserveAspectRatio="none"><polygon points="0,0 300,0 150,150" fill="#0B132B" stroke="#FFD700" strokeWidth="1.5" /></svg></div>
            <div className="border" />
            <button type="button" className="seal" onClick={() => setIsOpen(true)} aria-label="ආරාධනාව විවෘත කරන්න"><span className="seal-inner">🎂</span></button>
            <div className="envelope-copy"><p style={{margin:0,fontSize:13,letterSpacing:'.12em',fontWeight:600,color:'#FFD700'}}>{category}</p><p style={{margin:'.5rem 0 0',fontSize:10,color:'rgba(252,251,247,.65)'}}>ආරාධනාව බලන්න සීල් එක තට්ටු කරන්න</p></div>
          </div>
        </div>
        <main className="card-area">
          <article ref={cardRef} className="card">
            <div className="border" /><div className="border second" />
            <header style={{position:'relative',zIndex:1}}><p style={{margin:0,fontSize:13,letterSpacing:'.12em',fontWeight:700,color:'#E85D75'}}>✦ YOU'RE INVITED TO CELEBRATE ✦</p><h2 style={{margin:'1rem 0',fontSize:16,letterSpacing:'.08em',color:'#FFD700'}}>විශේෂ උපන්දින සංවත්සර සාදය</h2><p style={{margin:0,fontSize:13,fontStyle:'italic',color:'rgba(252,251,247,.8)'}}>මගේ උපන්දිනයේ සතුට අලුත් මතකයන් අතරින් බෙදාගන්න ඔබ සැමට ආදරයෙන් ඇරයුම් කරමි!</p></header>
            <div className="serif" style={{margin:'1.5rem 0',fontSize:24,color:'#FFD700'}}>✦ ✨ ✦</div>
            <section style={{margin:'1.5rem 0'}}><p style={{margin:0,fontSize:13,color:'rgba(252,251,247,.7)'}}>සුභ උපන්දිනයක්</p><h1 className="gold" style={{margin:'.5rem 0',fontSize:'clamp(2.5rem,8vw,3.75rem)',fontWeight:900}}>{title}</h1><p className="serif" style={{margin:0,fontSize:18,fontStyle:'italic',color:'#E85D75'}}>~ {age}th Birthday Bash ~</p></section>
            <div style={{margin:'1.5rem 0',fontSize:24}}>🥂</div>
            <section style={{margin:'2rem 0'}}><p style={{margin:0,fontSize:'clamp(1rem,3vw,1.5rem)',fontWeight:700}}>{eventDetails.dateText}</p><p style={{margin:'.4rem 0 1.5rem',fontSize:13,fontWeight:700,letterSpacing:'.08em',color:'#FFD700'}}>{eventDetails.timeText}</p><div style={{width:96,height:1,margin:'0 auto 1.5rem',background:'#E85D75'}} /><p style={{margin:0,fontSize:'clamp(1rem,3vw,1.25rem)',fontWeight:700}}>The Rooftop Lounge</p><p style={{margin:'.4rem 0 0',fontSize:13,color:'#FFF099'}}>{venue}</p></section>
          </article>
        </main>
      </div>
    </div>
  );
}
