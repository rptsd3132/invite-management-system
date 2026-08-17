import { Outlet } from "react-router-dom";
import { Navbar } from "./layout/Navbar";

export function Layout(): React.ReactElement {
  return (
    <div className="relative min-h-screen bg-zinc-50">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.08),transparent_65%)]"
      />
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
