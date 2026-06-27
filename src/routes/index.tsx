import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar, Footer } from "@/components/Navbar";
import heroImg from "@/assets/hero.jpg";
import herbsImg from "@/assets/herbs.jpg";
import roomImg from "@/assets/therapy-room.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AyurSutra — AI Panchakarma Patient Management" },
      { name: "description", content: "Personalised Ayurvedic treatment plans, therapist scheduling and patient care — powered by AI." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: "🌿", title: "AI Treatment Plans", body: "Describe symptoms in natural language — our engine maps them to classical Panchakarma protocols." },
  { icon: "🗓️", title: "Auto Scheduling", body: "Therapists, rooms and time-slots are assigned automatically based on real-time availability." },
  { icon: "🩺", title: "Doctor Workspace", body: "Maintain medical history, diagnosis, treatment notes and respond to patient alerts in one place." },
  { icon: "⚠️", title: "Side-Effect Alerts", body: "Patients report concerns post-therapy and doctors are notified instantly." },
  { icon: "📊", title: "Centre Admin", body: "Manage patients, doctors, therapists, rooms and the entire appointment book." },
  { icon: "🪔", title: "Authentic Protocols", body: "Treatments grounded in Vata · Pitta · Kapha balance and time-honored Ayurvedic texts." },
];

const therapies = [
  { name: "Abhyanga", desc: "Synchronised warm herbal-oil massage that calms Vata and improves circulation." },
  { name: "Shirodhara", desc: "A steady stream of medicated oil over the forehead — profound for stress, anxiety and insomnia." },
  { name: "Panchakarma Detox", desc: "Classical 5-action cleanse: Vamana, Virechana, Basti, Nasya, Raktamokshana." },
  { name: "Kati Basti", desc: "Warm oil pooled over the lumbar region — flagship therapy for chronic back pain." },
  { name: "Nasya", desc: "Nasal administration of herbal oils for sinus, migraine and clarity of mind." },
  { name: "Udvartana", desc: "Dry herbal-powder massage that mobilises Kapha, supports skin and metabolism." },
];

const doctors = [
  { name: "Dr. Aarav Sharma", role: "Panchakarma Specialist · 15 yrs", initials: "AS" },
  { name: "Dr. Priya Iyer", role: "Internal Medicine · 12 yrs", initials: "PI" },
  { name: "Dr. Kabir Menon", role: "Rasayana & Rejuvenation · 9 yrs", initials: "KM" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/60 via-background to-background" />
        <div className="absolute -top-32 -right-32 -z-10 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 -z-10 h-96 w-96 rounded-full bg-leaf/15 blur-3xl" />

        <div className="mx-auto max-w-7xl px-5 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf" /> AI-Powered Panchakarma Platform
            </span>
            <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] font-semibold">
              Ancient healing,<br />
              <span className="italic text-primary">intelligently</span> scheduled.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              AyurSutra blends classical Panchakarma wisdom with modern AI — generating personalised
              treatment plans, assigning therapists & rooms, and keeping doctors close to every patient.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login" className="btn-primary">Get Started →</Link>
              <a href="#features" className="btn-outline">Explore the platform</a>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {[
                ["12k+", "Patients cared for"],
                ["48", "Certified therapists"],
                ["97%", "Wellness satisfaction"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl text-primary">{n}</dt>
                  <dd className="text-xs text-muted-foreground mt-1">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img src={heroImg} alt="Ayurvedic herbs and brass vessels" width={1600} height={1100} className="w-full h-auto object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 card-soft w-56 animate-float hidden sm:block">
              <p className="text-xs text-muted-foreground">Today's plan</p>
              <p className="font-display text-lg">Shirodhara</p>
              <p className="text-xs text-muted-foreground mt-1">10:30 AM · Room 102</p>
            </div>
            <div className="absolute -top-6 -right-6 card-soft w-48 hidden sm:block">
              <p className="text-xs text-muted-foreground">AI confidence</p>
              <p className="font-display text-2xl text-primary">94%</p>
              <p className="text-xs text-muted-foreground">Vata-pacifying protocol</p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section-pad">
        <div className="mx-auto max-w-7xl px-5 grid lg:grid-cols-2 gap-14 items-center">
          <img src={herbsImg} alt="Ayurvedic herbs flat lay" width={1200} height={900} loading="lazy" className="rounded-3xl shadow-xl" />
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-leaf">About AyurSutra</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">A modern home for a 5,000-year-old science.</h2>
            <p className="mt-5 text-muted-foreground text-lg">
              We help Ayurvedic centres run with the precision of a modern hospital — without losing the soul
              of the practice. From the first consultation to the last Rasayana drop, every step is recorded,
              recommended and refined by intelligent workflows.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Symptom-aware AI that respects classical Dosha logic",
                "Real-time therapist and treatment-room allocation",
                "Continuity-of-care across doctors, therapists and patients",
              ].map((t) => (
                <li key={t} className="flex gap-3"><span className="text-leaf">✓</span>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-pad bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-leaf">Platform</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">Built for the whole centre.</h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card-soft hover:-translate-y-1 transition-transform">
                <div className="text-3xl">{f.icon}</div>
                <h3 className="mt-3 font-display text-xl">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI explanation */}
      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-5 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-leaf">AI Treatment Planning</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">From symptoms to a Panchakarma plan, in seconds.</h2>
            <ol className="mt-6 space-y-5">
              {[
                ["01", "Patient describes concerns in their own words"],
                ["02", "NLP engine extracts symptoms & maps to Dosha imbalance"],
                ["03", "Classical therapy protocols are matched and sequenced"],
                ["04", "Therapist, room and slot are assigned automatically"],
              ].map(([n, t]) => (
                <li key={n} className="flex gap-4">
                  <span className="font-display text-2xl text-gold">{n}</span>
                  <p className="pt-1.5 text-muted-foreground">{t}</p>
                </li>
              ))}
            </ol>
            <Link to="/login" className="btn-gold mt-8">Try a sample plan</Link>
          </div>
          <div className="card-soft bg-card/80">
            <p className="text-xs text-muted-foreground">SAMPLE OUTPUT</p>
            <p className="font-display text-2xl mt-1">Vata–Pitta balancing protocol</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              {[
                ["Therapy", "Abhyanga · Shirodhara"],
                ["Duration", "15 days"],
                ["Therapist", "Ananya"],
                ["Room", "102 · Pitta Suite"],
                ["Starts", "Tomorrow · 10:30 AM"],
                ["Diet", "Sattvic, warm, light"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-secondary/60 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
                  <p className="font-medium mt-1">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Therapies */}
      <section id="therapies" className="section-pad bg-gradient-to-b from-background to-secondary/40">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.2em] text-leaf">Panchakarma Therapies</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">A complete repertoire of healing rituals.</h2>
            </div>
            <img src={roomImg} alt="Ayurvedic therapy room interior" width={1200} height={900} loading="lazy" className="rounded-3xl shadow-xl w-full md:w-96" />
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {therapies.map((t) => (
              <div key={t.name} className="card-soft">
                <h3 className="font-display text-2xl">{t.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section id="doctors" className="section-pad">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-leaf">Care Team</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">Doctors who listen, therapists who heal.</h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((d) => (
              <div key={d.name} className="card-soft text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground font-display text-2xl">{d.initials}</div>
                <h3 className="mt-4 font-display text-xl">{d.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{d.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad">
        <div className="mx-auto max-w-5xl px-5">
          <div className="rounded-3xl bg-primary text-primary-foreground p-12 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-gold/30 blur-3xl" />
            <h2 className="font-display text-4xl sm:text-5xl">Bring balance back. Begin today.</h2>
            <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
              Sign in as a patient to generate your AI treatment plan, or as a doctor / admin to manage the centre.
            </p>
            <Link to="/login" className="btn-gold mt-8 inline-flex">Enter AyurSutra</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
