import { Outlet } from "react-router-dom";
import { Navbar } from "./layout/Navbar";

export function Layout(): React.ReactElement {
  return (
    <div className="relative min-h-screen bg-[#FDFBF7]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(112,111,211,0.06),transparent_65%)]"
      />
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
