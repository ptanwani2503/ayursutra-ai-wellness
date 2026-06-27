// Mock in-memory store + AI logic for AyurSutra prototype.
// Persists session role to localStorage; data resets on reload (demo only).

export type Role = "patient" | "doctor" | "admin";

export type Therapist = { id: string; name: string; specialty: string };
export type Room = { id: string; name: string };
export type Doctor = { id: string; name: string; specialty: string; experience: string };

export type TreatmentPlan = {
  id: string;
  patientName: string;
  symptoms: string[];
  therapies: string[];
  durationDays: number;
  therapist: string;
  room: string;
  date: string;
  dateISO: string;
  time: string;
  notes: string;
  createdAt: string;
  status: "scheduled" | "cancelled";
};

export type SideEffect = {
  id: string;
  patient: string;
  symptom: string;
  severity: "Mild" | "Moderate" | "Severe";
  description: string;
  createdAt: string;
};

export const therapists: Therapist[] = [
  { id: "t1", name: "Therapist Ananya", specialty: "Abhyanga & Shirodhara" },
  { id: "t2", name: "Therapist Rohan", specialty: "Panchakarma Detox" },
  { id: "t3", name: "Therapist Meera", specialty: "Nasya & Swedana" },
];

export const rooms: Room[] = [
  { id: "r1", name: "Room 101 – Vata Suite" },
  { id: "r2", name: "Room 102 – Pitta Suite" },
  { id: "r3", name: "Room 103 – Kapha Suite" },
];

export const doctors: Doctor[] = [
  { id: "d1", name: "Dr. Aarav Sharma", specialty: "Panchakarma Specialist", experience: "15 yrs" },
  { id: "d2", name: "Dr. Priya Iyer", specialty: "Ayurvedic Internal Medicine", experience: "12 yrs" },
  { id: "d3", name: "Dr. Kabir Menon", specialty: "Rasayana & Rejuvenation", experience: "9 yrs" },
];

// Simple keyword-driven "AI" recommendation engine
const rules: { keywords: string[]; therapies: string[]; days: number }[] = [
  { keywords: ["stress", "anxiety", "insomnia", "sleep"], therapies: ["Shirodhara", "Abhyanga", "Nasya"], days: 14 },
  { keywords: ["joint", "arthritis", "back pain", "pain", "stiffness"], therapies: ["Abhyanga", "Pizhichil", "Kati Basti"], days: 21 },
  { keywords: ["digestion", "constipation", "bloating", "acidity", "gas"], therapies: ["Virechana", "Basti", "Udvartana"], days: 15 },
  { keywords: ["fatigue", "weakness", "low energy"], therapies: ["Rasayana", "Abhyanga", "Shirodhara"], days: 18 },
  { keywords: ["skin", "acne", "eczema", "psoriasis"], therapies: ["Udvartana", "Virechana", "Herbal Lepa"], days: 21 },
  { keywords: ["sinus", "headache", "migraine", "cold"], therapies: ["Nasya", "Shirodhara", "Swedana"], days: 10 },
];

let counter = 0;
const id = (p: string) => `${p}_${Date.now()}_${counter++}`;

const ROUND_TIMES = ["09:00 AM", "10:30 AM", "12:00 PM", "02:30 PM", "04:00 PM"];

export function generatePlan(input: {
  patientName: string;
  symptomsText: string;
  age?: string;
  lifestyle?: string;
}): TreatmentPlan {
  const text = input.symptomsText.toLowerCase();
  const matched = new Set<string>();
  let totalDays = 0;
  let hits = 0;
  const symptoms = text.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);

  for (const rule of rules) {
    if (rule.keywords.some((k) => text.includes(k))) {
      rule.therapies.forEach((t) => matched.add(t));
      totalDays += rule.days;
      hits++;
    }
  }

  const therapies = matched.size > 0
    ? Array.from(matched).slice(0, 4)
    : ["Abhyanga", "Shirodhara", "Panchakarma Detox"];
  const durationDays = hits > 0 ? Math.min(Math.round(totalDays / hits), 28) : 15;

  // Pick therapist/room by simple rotation based on existing plans
  const idx = state.plans.length;
  const therapist = therapists[idx % therapists.length].name;
  const room = rooms[idx % rooms.length].name;
  const time = ROUND_TIMES[idx % ROUND_TIMES.length];
  const d = new Date(); d.setDate(d.getDate() + 1 + (idx % 5));
  const date = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const dateISO = d.toISOString().slice(0, 10);

  const plan: TreatmentPlan = {
    id: id("plan"),
    patientName: input.patientName || "Guest Patient",
    symptoms,
    therapies,
    durationDays,
    therapist,
    room,
    date,
    dateISO,
    time,
    notes: `Based on reported concerns${input.age ? ` (age ${input.age})` : ""}${
      input.lifestyle ? `, lifestyle: ${input.lifestyle}` : ""
    }. Follow a sattvic diet, warm water intake, and early sleep.`,
    createdAt: new Date().toISOString(),
    status: "scheduled",
  };
  state.plans.unshift(plan);
  return plan;
}

export function reschedulePlan(planId: string, isoDate: string, time?: string) {
  const p = state.plans.find((x) => x.id === planId);
  if (!p) return null;
  const d = new Date(isoDate + "T00:00:00");
  p.dateISO = isoDate;
  p.date = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  if (time) p.time = time;
  return p;
}

export function cancelPlan(planId: string) {
  const p = state.plans.find((x) => x.id === planId);
  if (p) p.status = "cancelled";
  return p;
}

export function reportSideEffect(s: Omit<SideEffect, "id" | "createdAt">): SideEffect {
  const item: SideEffect = { ...s, id: id("se"), createdAt: new Date().toISOString() };
  state.sideEffects.unshift(item);
  return item;
}

// Sample seed
export const state = {
  plans: [] as TreatmentPlan[],
  sideEffects: [] as SideEffect[],
  patients: [
    { id: "p1", name: "Riya Kapoor", age: 34, gender: "F", history: "Migraines, mild anxiety" },
    { id: "p2", name: "Arjun Verma", age: 47, gender: "M", history: "Lower back pain, hypertension" },
    { id: "p3", name: "Sneha Pillai", age: 28, gender: "F", history: "IBS, fatigue" },
  ],
};

// Seed one example plan + side effect
state.plans.push({
  id: "seed1",
  patientName: "Arjun Verma",
  symptoms: ["lower back pain", "stiffness"],
  therapies: ["Abhyanga", "Kati Basti", "Pizhichil"],
  durationDays: 21,
  therapist: "Therapist Rohan",
  room: "Room 102 – Pitta Suite",
  date: new Date(Date.now() + 86400000).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
  time: "10:30 AM",
  notes: "Daily warm oil massage; avoid cold foods.",
  createdAt: new Date().toISOString(),
});

state.sideEffects.push({
  id: "seed_se1",
  patient: "Riya Kapoor",
  symptom: "Mild headache after Shirodhara",
  severity: "Mild",
  description: "Headache lasting ~2 hours post-session, resolved with rest.",
  createdAt: new Date().toISOString(),
});

// Auth helpers
const KEY = "ayursutra_role";
export function setRole(r: Role | null, name?: string) {
  if (typeof window === "undefined") return;
  if (r) window.localStorage.setItem(KEY, JSON.stringify({ role: r, name: name || "" }));
  else window.localStorage.removeItem(KEY);
}
export function getRole(): { role: Role; name: string } | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
