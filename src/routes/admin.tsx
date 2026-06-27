import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar, Footer } from "@/components/Navbar";
import { state, therapists, rooms, doctors, getRole } from "@/lib/ayur-store";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin dashboard — AyurSutra" }] }),
  component: AdminDash,
});

const tabs = ["Overview", "Patients", "Doctors", "Therapists", "Rooms", "Appointments"] as const;
type Tab = typeof tabs[number];

function AdminDash() {
  const [session, setSession] = useState<ReturnType<typeof getRole>>(null);
  const [tab, setTab] = useState<Tab>("Overview");
  useEffect(() => { setSession(getRole()); }, []);

  if (session && session.role !== "admin") {
    return (
      <div className="min-h-screen"><Navbar />
        <div className="mx-auto max-w-2xl p-12 text-center">
          <h1 className="font-display text-3xl">Admin access only</h1>
          <Link to="/login" className="btn-primary mt-6 inline-flex">Switch account</Link>
        </div></div>
    );
  }

  const stats = [
    { label: "Total patients", value: state.patients.length + 47, accent: "leaf" },
    { label: "Doctors", value: doctors.length, accent: "primary" },
    { label: "Therapists", value: therapists.length, accent: "gold" },
    { label: "Rooms in use", value: rooms.length, accent: "primary" },
    { label: "Appointments", value: state.plans.length, accent: "leaf" },
    { label: "Open alerts", value: state.sideEffects.length, accent: "gold" },
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="mx-auto max-w-7xl px-5 py-10">
        <div className="card-soft bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8">
          <p className="text-xs uppercase tracking-[0.2em] opacity-80">Centre admin</p>
          <h1 className="font-display text-4xl mt-2">AyurSutra · Bengaluru</h1>
          <p className="opacity-90 mt-1">Everything happening across your wellness centre today.</p>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card-soft p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="font-display text-3xl mt-1 text-primary">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm transition border ${
                tab === t ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/50"
              }`}>{t}</button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "Overview" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="card-soft">
                <h3 className="font-display text-xl mb-3">Today's appointments</h3>
                <ul className="space-y-3 text-sm">
                  {state.plans.slice(0, 5).map(p => (
                    <li key={p.id} className="flex justify-between border-b border-border pb-2 last:border-0">
                      <span>{p.patientName} · <span className="text-muted-foreground">{p.therapies[0]}</span></span>
                      <span className="text-muted-foreground">{p.time} · {p.room.split(" ")[1]}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-soft">
                <h3 className="font-display text-xl mb-3">Recent alerts</h3>
                <ul className="space-y-3 text-sm">
                  {state.sideEffects.map(s => (
                    <li key={s.id} className="flex justify-between border-b border-border pb-2 last:border-0">
                      <span>{s.patient} · <span className="text-muted-foreground">{s.symptom}</span></span>
                      <span className="text-xs text-destructive">{s.severity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === "Patients" && <Table cols={["Name","Age","Gender","History"]} rows={state.patients.map(p=>[p.name,p.age,p.gender,p.history])} />}
          {tab === "Doctors" && <Table cols={["Name","Specialty","Experience"]} rows={doctors.map(d=>[d.name,d.specialty,d.experience])} />}
          {tab === "Therapists" && <Table cols={["Name","Specialty","Status"]} rows={therapists.map(t=>[t.name,t.specialty,"Available"])} />}
          {tab === "Rooms" && <Table cols={["Room","Status"]} rows={rooms.map(r=>[r.name, "In use"])} />}
          {tab === "Appointments" && (
            <Table cols={["Patient","Therapy","Therapist","Room","Date","Time"]}
              rows={state.plans.map(p=>[p.patientName, p.therapies.join(", "), p.therapist, p.room, p.date, p.time])} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Table({ cols, rows }: { cols: string[]; rows: (string | number)[][] }) {
  return (
    <div className="card-soft overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>{cols.map(c => <th key={c} className="py-2 pr-4">{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border">
              {r.map((c, j) => <td key={j} className="py-3 pr-4">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
