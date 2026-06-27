import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar, Footer } from "@/components/Navbar";
import { state, getRole } from "@/lib/ayur-store";

export const Route = createFileRoute("/doctor")({
  head: () => ({ meta: [{ title: "Doctor dashboard — AyurSutra" }] }),
  component: DoctorDash,
});

function DoctorDash() {
  const [session, setSession] = useState<ReturnType<typeof getRole>>(null);
  useEffect(() => { setSession(getRole()); }, []);

  const [selected, setSelected] = useState(state.patients[0]);
  const [diagnosis, setDiagnosis] = useState("Vata aggravation with mild Pitta — chronic stress pattern.");
  const [notes, setNotes] = useState("Continue Shirodhara × 7 days; recommend Brahmi rasayana morning.");
  const [saved, setSaved] = useState(false);

  if (session && session.role !== "doctor") {
    return (
      <div className="min-h-screen"><Navbar />
        <div className="mx-auto max-w-2xl p-12 text-center">
          <h1 className="font-display text-3xl">Doctor access only</h1>
          <Link to="/login" className="btn-primary mt-6 inline-flex">Switch account</Link>
        </div></div>
    );
  }

  const doctorName = session?.name || "Dr. Aarav Sharma";

  const save = () => { setSaved(true); setTimeout(()=>setSaved(false), 2500); };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="mx-auto max-w-7xl px-5 py-10">
        <div className="card-soft bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] opacity-80">Doctor workspace</p>
            <h1 className="font-display text-4xl mt-2">{doctorName}</h1>
            <p className="opacity-90 mt-1">Panchakarma Specialist · 15 yrs experience</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[["Patients","18"],["Today","6"],["Alerts", String(state.sideEffects.length)]].map(([k,v])=>(
              <div key={k} className="rounded-xl bg-primary-foreground/10 p-4">
                <p className="font-display text-3xl">{v}</p>
                <p className="text-xs opacity-80">{k}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="mt-8 card-soft border-l-4 border-l-destructive">
          <h2 className="font-display text-2xl flex items-center gap-2">⚠️ Side-effect reports</h2>
          <div className="mt-4 space-y-3">
            {state.sideEffects.length === 0 && <p className="text-sm text-muted-foreground">No reports yet.</p>}
            {state.sideEffects.map((s) => (
              <div key={s.id} className="rounded-xl border border-border p-4 grid md:grid-cols-[1fr_auto] gap-3">
                <div>
                  <p className="font-medium">{s.patient} <span className="text-muted-foreground">· {s.symptom}</span></p>
                  <p className="text-sm text-muted-foreground mt-1">{s.description || "No additional notes."}</p>
                </div>
                <span className={`self-start px-3 py-1 rounded-full text-xs font-medium ${
                  s.severity === "Severe" ? "bg-destructive text-destructive-foreground" :
                  s.severity === "Moderate" ? "bg-gold/30 text-gold-foreground" :
                  "bg-leaf/20 text-primary"
                }`}>{s.severity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Patient list + details */}
        <div className="mt-8 grid lg:grid-cols-[280px_1fr] gap-6">
          <div className="card-soft">
            <h2 className="font-display text-xl mb-3">Patients</h2>
            <ul className="space-y-1">
              {state.patients.map((p) => (
                <li key={p.id}>
                  <button onClick={()=>setSelected(p)}
                    className={`w-full text-left rounded-xl px-3 py-2 text-sm transition ${
                      selected.id === p.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                    }`}>
                    <div className="font-medium">{p.name}</div>
                    <div className={`text-xs ${selected.id===p.id?"opacity-80":"text-muted-foreground"}`}>{p.age} · {p.gender}</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-soft">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Patient record</p>
            <h2 className="font-display text-3xl mt-1">{selected.name}</h2>
            <p className="text-sm text-muted-foreground">{selected.age} years · {selected.gender === "F" ? "Female" : "Male"}</p>
            <p className="mt-3 text-sm"><span className="text-muted-foreground">History:</span> {selected.history}</p>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <label className="block text-sm">Diagnosis
                <textarea value={diagnosis} onChange={(e)=>setDiagnosis(e.target.value)} rows={3}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm" />
              </label>
              <label className="block text-sm">Treatment notes
                <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} rows={3}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm" />
              </label>
            </div>
            <button onClick={save} className="btn-primary mt-4">Save record</button>
            {saved && <span className="ml-3 text-sm text-leaf">✓ Saved</span>}
          </div>
        </div>

        {/* Appointments */}
        <div className="mt-8 card-soft">
          <h2 className="font-display text-2xl mb-4">Upcoming appointments</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="py-2">Patient</th><th>Therapy</th><th>Therapist</th><th>Date</th><th>Time</th><th>Room</th></tr>
              </thead>
              <tbody>
                {state.plans.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="py-3 font-medium">{p.patientName}</td>
                    <td>{p.therapies.join(", ")}</td>
                    <td>{p.therapist}</td>
                    <td>{p.date}</td>
                    <td>{p.time}</td>
                    <td>{p.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
