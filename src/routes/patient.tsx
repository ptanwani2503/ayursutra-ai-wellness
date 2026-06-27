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

        {/* Upcoming */}
        <div className="mt-10 card-soft">
          <h2 className="font-display text-2xl mb-4">Your appointments</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="py-2">Therapy</th><th>Therapist</th><th>Room</th><th>Date</th><th>Time</th></tr>
              </thead>
              <tbody>
                {state.plans.filter(p => p.patientName === patientName || true).slice(0,5).map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="py-3">{p.therapies[0]}</td>
                    <td>{p.therapist}</td>
                    <td>{p.room}</td>
                    <td>{p.date}</td>
                    <td>{p.time}</td>
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
