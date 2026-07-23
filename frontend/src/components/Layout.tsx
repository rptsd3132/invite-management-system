import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function Layout(): React.ReactElement {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
