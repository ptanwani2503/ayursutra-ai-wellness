import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar, Footer } from "@/components/Navbar";
import { generatePlan, reportSideEffect, reschedulePlan, cancelPlan, state, getRole, type TreatmentPlan } from "@/lib/ayur-store";

export const Route = createFileRoute("/patient")({
  head: () => ({ meta: [{ title: "Patient dashboard — AyurSutra" }] }),
  component: PatientDash,
});

function PatientDash() {
  const [session, setSession] = useState<ReturnType<typeof getRole>>(null);
  useEffect(() => { setSession(getRole()); }, []);

  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("34");
  const [lifestyle, setLifestyle] = useState("Sedentary desk job, irregular sleep");
  const [diseases, setDiseases] = useState("Mild anxiety, occasional migraines");
  const [allergies, setAllergies] = useState("None");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<TreatmentPlan | null>(null);

  // Side effect form
  const [seSymptom, setSeSymptom] = useState("");
  const [seSeverity, setSeSeverity] = useState<"Mild"|"Moderate"|"Severe">("Mild");
  const [seDesc, setSeDesc] = useState("");
  const [seSent, setSeSent] = useState(false);

  const patientName = session?.name || "Riya Kapoor";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setLoading(true);
    setPlan(null);
    setTimeout(() => {
      const p = generatePlan({ patientName, symptomsText: symptoms, age, lifestyle });
      setPlan(p);
      setLoading(false);
    }, 1200);
  };

  const submitSE = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seSymptom.trim()) return;
    reportSideEffect({ patient: patientName, symptom: seSymptom, severity: seSeverity, description: seDesc });
    setSeSent(true);
    setSeSymptom(""); setSeDesc("");
    setTimeout(() => setSeSent(false), 4000);
  };

  if (session && session.role !== "patient") {
    return (
      <div className="min-h-screen"><Navbar />
        <div className="mx-auto max-w-2xl p-12 text-center">
          <h1 className="font-display text-3xl">Patient access only</h1>
          <Link to="/login" className="btn-primary mt-6 inline-flex">Switch account</Link>
        </div></div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="mx-auto max-w-7xl px-5 py-10">
        {/* Header */}
        <div className="card-soft bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8">
          <p className="text-xs uppercase tracking-[0.2em] opacity-80">Patient dashboard</p>
          <h1 className="font-display text-4xl mt-2">Namaste, {patientName} 🪷</h1>
          <p className="mt-2 opacity-90">Your wellbeing journey, guided every step.</p>
        </div>

        {/* Profile */}
        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          {[
            ["Age", "34"],
            ["Gender", "Female"],
            ["Constitution", "Vata–Pitta"],
          ].map(([k,v]) => (
            <div key={k} className="card-soft">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{k}</p>
              <p className="font-display text-2xl mt-1">{v}</p>
            </div>
          ))}
        </div>

        <div className="card-soft mt-6">
          <h2 className="font-display text-xl">Medical history</h2>
          <p className="text-sm text-muted-foreground mt-2">Migraines (since 2021), mild anxiety, lactose intolerance.</p>
          <h3 className="font-display mt-5">Previous treatments</h3>
          <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
            <li>Shirodhara × 7 sessions (Mar 2024) — significant relief</li>
            <li>Abhyanga + Swedana × 14 days (Aug 2023)</li>
          </ul>
        </div>

        {/* Symptom form */}
        <div className="mt-10 grid lg:grid-cols-2 gap-8">
          <form onSubmit={submit} className="card-soft">
            <h2 className="font-display text-2xl">Describe your symptoms</h2>
            <p className="text-sm text-muted-foreground mt-1">Our AI will recommend a Panchakarma plan.</p>

            <label className="block mt-5 text-sm">
              Symptoms (comma separated)
              <textarea required value={symptoms} onChange={(e)=>setSymptoms(e.target.value)}
                rows={4}
                placeholder="e.g. joint pain, stress, insomnia, digestion issues"
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </label>

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <label className="block text-sm">
                Age
                <input value={age} onChange={(e)=>setAge(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm" />
              </label>
              <label className="block text-sm">
                Lifestyle
                <input value={lifestyle} onChange={(e)=>setLifestyle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm" />
              </label>
              <label className="block text-sm">
                Previous diseases
                <input value={diseases} onChange={(e)=>setDiseases(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm" />
              </label>
              <label className="block text-sm">
                Allergies
                <input value={allergies} onChange={(e)=>setAllergies(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm" />
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
              {loading ? "Analysing symptoms…" : "Generate AI Treatment Plan ✨"}
            </button>
          </form>

          {/* Plan card */}
          <div className="card-soft bg-gradient-to-br from-secondary to-card">
            <p className="text-xs uppercase tracking-[0.2em] text-leaf">AI-Generated Plan</p>
            {loading && (
              <div className="mt-6 space-y-3 animate-pulse">
                <div className="h-6 w-2/3 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-5/6 rounded bg-muted" />
                <div className="h-24 rounded bg-muted" />
              </div>
            )}
            {!loading && !plan && (
              <div className="mt-6 text-muted-foreground text-sm">
                Fill in the form to see your personalised Panchakarma protocol.
              </div>
            )}
            {plan && (
              <div className="animate-fade-up">
                <h2 className="font-display text-3xl mt-2">{plan.therapies.join(" · ")}</h2>
                <p className="text-sm text-muted-foreground mt-1">For: {plan.symptoms.join(", ") || "general balance"}</p>

                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Duration", `${plan.durationDays} days`],
                    ["Therapist", plan.therapist],
                    ["Room", plan.room],
                    ["Starts", `${plan.date} · ${plan.time}`],
                  ].map(([k,v]) => (
                    <div key={k} className="rounded-xl bg-background/70 p-3 border border-border">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
                      <p className="font-medium mt-1">{v}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl bg-gold/15 border border-gold/30 p-4 text-sm">
                  <p className="font-medium">Doctor's note</p>
                  <p className="text-muted-foreground mt-1">{plan.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side effect */}
        <div className="mt-10 card-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-destructive/10 text-destructive">⚠️</span>
            <div>
              <h2 className="font-display text-2xl">Report a side-effect</h2>
              <p className="text-sm text-muted-foreground">Concerns are sent instantly to your doctor.</p>
            </div>
          </div>

          <form onSubmit={submitSE} className="mt-5 grid md:grid-cols-3 gap-4">
            <input required value={seSymptom} onChange={(e)=>setSeSymptom(e.target.value)}
              placeholder="Symptom (e.g. nausea after Virechana)"
              className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm md:col-span-1" />
            <select value={seSeverity} onChange={(e)=>setSeSeverity(e.target.value as "Mild"|"Moderate"|"Severe")}
              className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm">
              <option>Mild</option><option>Moderate</option><option>Severe</option>
            </select>
            <textarea value={seDesc} onChange={(e)=>setSeDesc(e.target.value)}
              placeholder="Describe what you're feeling…" rows={1}
              className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm md:col-span-1" />
            <button type="submit" className="btn-primary md:col-span-3">Send to doctor</button>
          </form>

          {seSent && (
            <p className="mt-4 text-sm text-leaf">✓ Your concern has been sent to your doctor.</p>
          )}
        </div>

        {/* Upcoming - Calendar view */}
        <AppointmentsCalendar patientName={patientName} />
      </div>
      <Footer />
    </div>
  );
}

const TIME_SLOTS = ["09:00 AM", "10:30 AM", "12:00 PM", "02:30 PM", "04:00 PM"];

function AppointmentsCalendar({ patientName }: { patientName: string }) {
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [editing, setEditing] = useState<TreatmentPlan | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState(TIME_SLOTS[0]);

  // patient-scoped, exclude cancelled from calendar dots but show in list
  void tick;
  const myPlans = state.plans.filter((p) => p.patientName === patientName || patientName === "Riya Kapoor");
  const active = myPlans.filter((p) => p.status !== "cancelled");

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const plansByDay = new Map<string, TreatmentPlan[]>();
  for (const p of active) {
    const d = new Date(p.dateISO + "T00:00:00");
    if (d.getFullYear() === year && d.getMonth() === month) {
      const key = String(d.getDate());
      const arr = plansByDay.get(key) || [];
      arr.push(p);
      plansByDay.set(key, arr);
    }
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const openReschedule = (p: TreatmentPlan) => {
    setEditing(p);
    setNewDate(p.dateISO);
    setNewTime(p.time);
  };
  const confirmReschedule = () => {
    if (editing && newDate) {
      reschedulePlan(editing.id, newDate, newTime);
      setEditing(null);
      refresh();
    }
  };
  const doCancel = (p: TreatmentPlan) => {
    if (window.confirm(`Cancel ${p.therapies[0]} on ${p.date}?`)) {
      cancelPlan(p.id);
      refresh();
    }
  };

  const upcoming = [...myPlans].sort((a, b) => a.dateISO.localeCompare(b.dateISO));

  return (
    <div className="mt-10 card-soft">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="font-display text-2xl">Your appointments</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-secondary">←</button>
          <span className="font-medium min-w-[10rem] text-center">{monthLabel}</span>
          <button onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-secondary">→</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-wider text-muted-foreground mb-2">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="py-2">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} className="aspect-square" />;
          const dayPlans = plansByDay.get(String(d)) || [];
          const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          return (
            <div key={i} className={`aspect-square rounded-xl border p-1.5 text-left text-xs flex flex-col ${
              isToday ? "border-primary bg-primary/5" : "border-border"
            } ${dayPlans.length ? "bg-leaf/5" : ""}`}>
              <span className={`font-medium ${isToday ? "text-primary" : ""}`}>{d}</span>
              <div className="mt-auto space-y-0.5 overflow-hidden">
                {dayPlans.slice(0, 2).map((p) => (
                  <div key={p.id} className="truncate rounded bg-primary/15 text-primary px-1 py-0.5 text-[10px]">
                    {p.time.replace(/:00 /, " ")} {p.therapies[0]}
                  </div>
                ))}
                {dayPlans.length > 2 && (
                  <div className="text-[10px] text-muted-foreground">+{dayPlans.length - 2}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming list with actions */}
      <h3 className="font-display text-lg mt-8 mb-3">Schedule details</h3>
      <div className="space-y-3">
        {upcoming.length === 0 && (
          <p className="text-sm text-muted-foreground">No appointments scheduled.</p>
        )}
        {upcoming.map((p) => (
          <div key={p.id} className={`rounded-xl border border-border p-4 grid md:grid-cols-[1fr_auto] gap-3 items-center ${
            p.status === "cancelled" ? "opacity-60" : ""
          }`}>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{p.therapies.join(" · ")}</p>
                {p.status === "cancelled" && (
                  <span className="rounded-full bg-destructive/15 text-destructive px-2 py-0.5 text-[10px] uppercase tracking-wider">Cancelled</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {p.date} · {p.time} · {p.therapist} · {p.room}
              </p>
            </div>
            {p.status !== "cancelled" && (
              <div className="flex gap-2">
                <button onClick={() => openReschedule(p)}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-secondary">Reschedule</button>
                <button onClick={() => doCancel(p)}
                  className="rounded-lg bg-destructive/10 text-destructive px-3 py-1.5 text-sm hover:bg-destructive/20">Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reschedule modal */}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl">Reschedule appointment</h3>
            <p className="text-sm text-muted-foreground mt-1">{editing.therapies.join(" · ")}</p>
            <label className="block mt-4 text-sm">
              New date
              <input type="date" value={newDate} min={new Date().toISOString().slice(0,10)}
                onChange={(e) => setNewDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm" />
            </label>
            <label className="block mt-3 text-sm">
              New time
              <select value={newTime} onChange={(e) => setNewTime(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm">
                {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditing(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary">Close</button>
              <button onClick={confirmReschedule} className="btn-primary">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
