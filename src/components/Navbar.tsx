import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getRole, setRole } from "@/lib/ayur-store";

export function Navbar() {
  const navigate = useNavigate();
  const [session, setSession] = useState<ReturnType<typeof getRole>>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => { setSession(getRole()); }, []);

  const logout = () => {
    setRole(null);
    setSession(null);
    navigate({ to: "/" });
  };

  const dashHref =
    session?.role === "patient" ? "/patient" :
    session?.role === "doctor" ? "/doctor" :
    session?.role === "admin" ? "/admin" : "/login";

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-border">
      <div className="mx-auto max-w-7xl px-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4 sm:flex sm:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-display text-lg">A</span>
          <span className="truncate font-display text-xl font-semibold tracking-tight">AyurSutra</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="/#about" className="hover:text-foreground transition">About</a>
          <a href="/#features" className="hover:text-foreground transition">Features</a>
          <a href="/#therapies" className="hover:text-foreground transition">Therapies</a>
          <a href="/#doctors" className="hover:text-foreground transition">Doctors</a>
          <a href="/#contact" className="hover:text-foreground transition">Contact</a>
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          {session ? (
            <>
              <Link to={dashHref} className="text-sm text-muted-foreground hover:text-foreground">
                {session.name || session.role} dashboard
              </Link>
              <button onClick={logout} className="btn-outline text-sm">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn-primary text-sm">Sign in</Link>
          )}
        </div>

        <button className="sm:hidden text-sm text-muted-foreground" onClick={() => setOpen((v) => !v)}>
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="sm:hidden border-t border-border bg-background px-5 py-4 flex flex-col gap-3 text-sm">
          <a href="/#about" onClick={() => setOpen(false)}>About</a>
          <a href="/#features" onClick={() => setOpen(false)}>Features</a>
          <a href="/#therapies" onClick={() => setOpen(false)}>Therapies</a>
          <a href="/#doctors" onClick={() => setOpen(false)}>Doctors</a>
          <a href="/#contact" onClick={() => setOpen(false)}>Contact</a>
          {session ? (
            <button onClick={() => { logout(); setOpen(false); }} className="btn-outline text-sm w-fit">Logout</button>
          ) : (
            <Link to="/login" className="btn-primary text-sm w-fit" onClick={() => setOpen(false)}>Sign in</Link>
          )}
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-5 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground font-display">A</span>
            <span className="font-display text-xl">AyurSutra</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            AI-guided Panchakarma care — blending ancient Ayurvedic wisdom with modern clinical workflows.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3">Visit us</h4>
          <p className="text-sm text-muted-foreground">AyurSutra Wellness Centre<br />MG Road, Bengaluru — 560001</p>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3">Contact</h4>
          <p className="text-sm text-muted-foreground">+91 80 4000 1234<br />care@ayursutra.in</p>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3">Hours</h4>
          <p className="text-sm text-muted-foreground">Mon – Sat · 7:00 AM – 8:00 PM<br />Sun · 8:00 AM – 1:00 PM</p>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AyurSutra. Crafted with care for holistic healing.
      </div>
    </footer>
  );
}
