import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar, Footer } from "@/components/Navbar";
import { setRole, type Role } from "@/lib/ayur-store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — AyurSutra" }, { name: "description", content: "Sign in as a patient, doctor or admin to access AyurSutra." }] }),
  component: LoginPage,
});

const roles: { id: Role; label: string; desc: string; demoUser: string; icon: string }[] = [
  { id: "patient", label: "Patient", desc: "Generate AI treatment plans & track therapy", demoUser: "Riya Kapoor", icon: "🪷" },
  { id: "doctor", label: "Doctor", desc: "Review patients, medical history & alerts", demoUser: "Dr. Aarav Sharma", icon: "🩺" },
  { id: "admin", label: "Admin", desc: "Manage centre, staff, rooms & appointments", demoUser: "Centre Admin", icon: "⚙️" },
];

function LoginPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState<Role>("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = roles.find((r) => r.id === active)?.demoUser ?? "User";
    setRole(active, name);
    navigate({ to: active === "patient" ? "/patient" : active === "doctor" ? "/doctor" : "/admin" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-5 py-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-leaf">Welcome back</p>
          <h1 className="mt-3 font-display text-5xl">Sign in to AyurSutra</h1>
          <p className="mt-4 text-muted-foreground max-w-md">
            Choose your role to enter the right workspace. This is a demo — any email / password works.
          </p>

          <div className="mt-8 grid sm:grid-cols-3 gap-3">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setActive(r.id)}
                className={`text-left p-4 rounded-2xl border transition ${
                  active === r.id
                    ? "border-primary bg-primary text-primary-foreground shadow-lg"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="text-2xl">{r.icon}</div>
                <p className="font-display text-lg mt-2">{r.label}</p>
                <p className={`text-xs mt-1 ${active === r.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {r.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="card-soft p-8">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{roles.find(r=>r.id===active)?.label} login</p>
          <h2 className="font-display text-2xl mt-1">Continue as {roles.find(r=>r.id===active)?.demoUser}</h2>

          <label className="block mt-6 text-sm">
            Email
            <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)}
              placeholder="you@ayursutra.in"
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </label>
          <label className="block mt-4 text-sm">
            Password
            <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </label>

          <button type="submit" className="btn-primary mt-6 w-full">Sign in</button>
          <p className="mt-3 text-xs text-muted-foreground text-center">Demo mode — credentials are not validated.</p>
        </form>
      </div>
      <Footer />
    </div>
  );
}
