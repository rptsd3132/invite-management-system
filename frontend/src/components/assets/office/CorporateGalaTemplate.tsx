import { useEffect, useState, type ReactElement } from "react";

export interface CorporateGalaTemplateProps {
  eventName?: string;
  companyName?: string;
  guestName?: string;
  location?: string;
  date?: string;
  time?: string;
  language?: "en" | "si";
  category?: string;
  compact?: boolean;
}

function formatDate(value?: string, time?: string, language: "en" | "si" = "en") {
  if (!value) return { date: language === "si" ? "2027 දෙසැම්බර් 18 වන සිකුරාදා" : "Friday, December 18, 2027", time: time || "18:30 HRS (IST) ONWARDS" };
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return { date: value, time: time || "" };
  return {
    date: parsed.toLocaleDateString(language === "si" ? "si-LK" : "en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    time: time || parsed.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) + " HRS (IST) ONWARDS",
  };
}

export default function CorporateGalaTemplate({ eventName, companyName = "NEXUS TECH", location, date, time, language = "en", compact = false }: CorporateGalaTemplateProps): ReactElement {
  const [flipped, setFlipped] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);
  const isSinhala = language === "si";
  const details = formatDate(date, time, language);
  const title = eventName || "NEXUS TECH 2027";
  const venue = location || (isSinhala ? "ෂැන්ග්‍රි-ලා හොටෙල්, කොළඹ" : "Shangri-La Hotel, Colombo");
  const labels = isSinhala ? { badge: "නිල VIP ආරාධනාවයි", open: "ආරාධනා පත්‍රය විවෘත කිරීමට ක්ලික් කරන්න", annual: "වාර්ෂික තාක්ෂණික ඇගයීම් රාත්‍රිය", invite: "අධ්‍යක්ෂ මණ්ඩලයේ ගෞරවනීය ආරාධනාවයි", excellence: "විශිෂ්ටත්වයේ උළෙල", body: "තාක්ෂණික ක්ෂේත්‍රයේ විශිෂ්ටත්වය සහ නවෝත්පාදනය සැමරෙන අපගේ වාර්ෂික සම්මාන උළෙල සහ රාත්‍රී භෝජන සංග්‍රහය සඳහා ඔබ වෙත ගෞරවයෙන් ආරාධනා කරමු.", venue: "ද ග්‍රෑන්ඩ් මොනාක් රීජන්සි බෝල්රූම්", dress: "ඇඳුම් කේතය: බ්ලැක් ටයි / විධිමත් ඇඳුම" } : { badge: "OFFICIAL VIP INVITATION", open: "Click to Open Invitation (Flip Card)", annual: "Annual Technology Excellence Gala", invite: "The Board of Directors Cordially Invites You To", excellence: "EXCELLENCE GALA", body: "Join us as we celebrate innovation, leadership, and outstanding technological achievements at our annual awards night and dinner.", venue: "The Grand Monarch Regency Ballroom", dress: "DRESS CODE: BLACK TIE / FORMAL ATTIRE" };
  const palette = ["#00F2FE", "#8B5CF6", "#F59E0B"];

  useEffect(() => setParticles(Array.from({ length: 25 }, (_, index) => index)), []);

  return <div className={`corporate-gala-template ${flipped ? "flipped" : ""} ${compact ? "compact" : ""}`} lang={language} onClick={() => setFlipped((value) => !value)}>
    <style>{`.corporate-gala-template{position:relative;width:100%;min-height:680px;display:flex;align-items:center;justify-content:center;padding:1rem;background:#030712;color:#f8fafc;font-family:Inter,Arial,sans-serif;overflow:hidden}.corporate-gala-template *{box-sizing:border-box}.corporate-gala-template .bg-particle{position:fixed;border-radius:50%;animation:cgFloat 12s linear infinite;pointer-events:none}.corporate-gala-template .stage{position:relative;width:100%;max-width:36rem;height:680px;perspective:2000px;z-index:1}.corporate-gala-template.compact{min-height:0;padding:.5rem}.corporate-gala-template.compact .stage{height:560px}.corporate-gala-template .inner{position:relative;width:100%;height:100%;transition:transform 1.2s cubic-bezier(.16,1,.3,1);transform-style:preserve-3d}.corporate-gala-template.flipped .inner{transform:rotateY(180deg)}.corporate-gala-template .face{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:3rem 2rem;border-radius:1.5rem;backface-visibility:hidden;background:linear-gradient(135deg,rgba(15,23,42,.9),rgba(30,27,75,.85));box-shadow:0 30px 70px -15px #000,0 0 45px #00f2fe26,inset 0 0 25px #8b5cf626;text-align:center;overflow:hidden}.corporate-gala-template .front{border:2px solid #00f2fe66}.corporate-gala-template .back{transform:rotateY(180deg);border:2px solid #f59e0b80}.corporate-gala-template .corner{position:absolute;width:1.5rem;height:1.5rem;border-color:#00f2fe;border-style:solid}.corporate-gala-template .tl{top:.75rem;left:.75rem;border-width:2px 0 0 2px}.corporate-gala-template .tr{top:.75rem;right:.75rem;border-width:2px 2px 0 0}.corporate-gala-template .bl{bottom:.75rem;left:.75rem;border-width:0 0 2px 2px}.corporate-gala-template .br{bottom:.75rem;right:.75rem;border-width:0 2px 2px 0}.corporate-gala-template .badge{padding:.5rem 1.25rem;border:1px solid #00f2fe66;border-radius:999px;color:#00f2fe;font:700 .7rem Orbitron,monospace;letter-spacing:.15em}.corporate-gala-template .emblem{width:10rem;height:10rem;border-radius:50%;padding:2px;background:linear-gradient(135deg,#8b5cf6,#00f2fe,#f59e0b);animation:cgSpin 16s linear infinite}.corporate-gala-template .emblem-inner{display:flex;height:100%;flex-direction:column;align-items:center;justify-content:center;border:1px solid #00f2fe80;border-radius:50%;background:#030712}.corporate-gala-template .tech{font-family:Orbitron,monospace}.corporate-gala-template .metal{background:linear-gradient(135deg,#00f2fe,#fde68a 35%,#f59e0b 60%,#8b5cf6);background-clip:text;-webkit-background-clip:text;color:transparent;background-size:200% auto;animation:cgMetal 5s linear infinite}.corporate-gala-template .back{justify-content:space-between}.corporate-gala-template .back h2{margin:.5rem 0;font-size:2.25rem}.corporate-gala-template .content{display:flex;flex:1;flex-direction:column;justify-content:center;gap:1rem}.corporate-gala-template .date-box{padding:1rem;border:1px solid #00f2fe66;border-radius:.75rem;background:#020617e6}.corporate-gala-template .compact-text{font-size:.8rem}.corporate-gala-template.compact .face{padding:2rem 1.25rem}.corporate-gala-template.compact .emblem{width:7rem;height:7rem}.corporate-gala-template.compact .back h2{font-size:1.7rem}@keyframes cgSpin{to{transform:rotate(360deg)}}@keyframes cgMetal{to{background-position:200% 50%}}@keyframes cgFloat{from{transform:translateY(100vh);opacity:0}20%,80%{opacity:.8}to{transform:translateY(-100vh) rotate(360deg);opacity:0}}@media(max-width:640px){.corporate-gala-template{min-height:620px}.corporate-gala-template .stage{height:620px}.corporate-gala-template .face{padding:2rem 1.25rem}.corporate-gala-template .badge{font-size:.55rem}.corporate-gala-template .back h2{font-size:1.8rem}}`}</style>
    {particles.map((particle) => <span key={particle} className="bg-particle" style={{ left: `${(particle * 37) % 100}%`, bottom: "-10px", width: `${particle % 3 + 3}px`, height: `${particle % 3 + 3}px`, background: palette[particle % palette.length], boxShadow: `0 0 10px ${palette[particle % palette.length]}`, animationDelay: `${particle * .15}s` }} />)}
    <div className="stage"><div className="inner">
      <section className="face front"><i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" /><div className="badge"><span style={{ display: "inline-block", marginRight: ".5rem", width: 8, height: 8, borderRadius: "50%", background: "#00F2FE" }} />{labels.badge}</div><div className="emblem"><div className="emblem-inner"><span className="tech" style={{ fontSize: "3rem", fontWeight: 900, color: "#00F2FE" }}>IT</span><span className="tech" style={{ fontSize: 10, color: "#F59E0B", letterSpacing: ".2em" }}>GALA 2027</span></div></div><div><h3 className="serif" style={{ margin: 0, fontSize: "1.45rem" }}>{labels.annual}</h3><p className="tech" style={{ color: "#F59E0B", fontSize: 10, letterSpacing: ".12em" }}>✦ {labels.open} ✦</p></div></section>
      <section className="face back"><div style={{ position: "absolute", inset: "1rem", border: "1px solid #F59E0B4d", borderRadius: 12, pointerEvents: "none" }} /><header><p className="serif" style={{ fontSize: 11, letterSpacing: ".15em", color: "#F59E0B" }}>{labels.invite}</p><h2 className="tech metal">{companyName || title}</h2></header><div className="content"><div style={{ color: "#00F2FE", fontSize: 11, letterSpacing: ".12em" }}>◆ {labels.excellence} ◆</div><p className="compact-text" style={{ lineHeight: 1.7, color: "#e2e8f0" }}>{labels.body}</p><div className="date-box"><p className="serif" style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>{details.date}</p><p className="tech" style={{ margin: ".5rem 0 0", fontSize: 10, color: "#00F2FE" }}>{details.time}</p></div><div><p className="serif" style={{ margin: 0, fontWeight: 700 }}>{labels.venue}</p><p style={{ margin: ".4rem 0 0", fontSize: 11, color: "#94a3b8" }}>{venue}</p></div></div><footer style={{ borderTop: "1px solid #1e293b", paddingTop: "1rem", width: "100%" }}><p className="tech" style={{ margin: 0, fontSize: 9, color: "#94a3b8", letterSpacing: ".12em" }}>✦ {labels.dress} ✦</p></footer></section>
    </div></div>
  </div>;
}
