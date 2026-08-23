import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/Button";
import { ChevronDown, LayoutDashboard, LayoutTemplate, LogOut, Plus, Sparkles } from "lucide-react";
import { cn } from "../../lib/utils";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/templates", label: "Templates", icon: LayoutTemplate },
];

function initialsOf(firstName: string | null | undefined, lastName: string | null | undefined, email: string | null | undefined): string {
  if (firstName || lastName) {
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  }
  return (email ?? "").slice(0, 2).toUpperCase();
}

function Logo(): React.ReactElement {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#706FD3] to-indigo-600 text-white shadow-md shadow-[#706FD3]/25 transition-transform duration-200 ease-out group-hover:scale-105">
        <Sparkles className="h-4.5 w-4.5" />
        <span
          aria-hidden
          className="absolute inset-0 rounded-xl bg-[#706FD3]/40 blur-md -z-10 animate-glow-pulse"
        />
      </span>
      <span className="font-editorial text-lg font-semibold tracking-tight text-zinc-900">
        Invitation<span className="text-gradient">Maker</span>
      </span>
    </Link>
  );
}

export function Navbar(): React.ReactElement {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const handleLogout = (): void => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/50 bg-[#FDFBF7]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#FDFBF7]/70">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />

          {isAuthenticated && (
            <div className="hidden items-center gap-1 md:flex">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "text-zinc-900 after:absolute after:inset-x-3 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#706FD3] after:to-indigo-600"
                        : "text-zinc-500 hover:text-zinc-900",
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
              <Link to="/events/create">
                <Button size="sm" className="ml-1">
                  <Plus className="h-3.5 w-3.5" />
                  New Event
                </Button>
              </Link>
              <Link to="/organizer">
                <Button variant="outline" size="sm" className="ml-1">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Manage Events
                </Button>
              </Link>
            </div>
          )}
        </div>

        {isAuthenticated && user ? (
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className={cn(
                "flex items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-3 transition-all duration-200 ease-out",
                menuOpen
                  ? "border-[#706FD3]/40 bg-white shadow-md shadow-zinc-900/5 ring-4 ring-[#706FD3]/10"
                  : "border-stone-200/50 bg-white/70 hover:border-stone-300 hover:shadow-sm",
              )}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#706FD3] to-indigo-600 text-xs font-semibold text-white">
                {initialsOf(user.first_name, user.last_name, user.email)}
              </span>
              <span className="hidden max-w-40 truncate text-sm text-zinc-600 sm:block">
                {user.email}
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-zinc-400 transition-transform duration-200",
                  menuOpen && "rotate-180",
                )}
              />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-stone-100 bg-white shadow-xl shadow-zinc-900/10"
              >
                <div className="border-b border-zinc-100 px-4 py-3">
                  <p className="truncate text-sm font-medium text-zinc-900">
                    {user.first_name || user.last_name
                      ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
                      : "Organizer"}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-zinc-400">{user.email}</p>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
