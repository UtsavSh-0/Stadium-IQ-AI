"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Accessibility, ArrowLeft, Bell, Bot, ChevronRight,
  Clock3, Languages, MapPin, Mic, Navigation, ParkingCircle,
  ShieldAlert, Shirt, Sparkles, Ticket, Bath, TrainFront, Utensils,
  Waves, X, Moon, Sun, Phone, Users,
} from "lucide-react";

const quickActions = [
  { label: "Find my seat", detail: "Section 124 · Row 18", icon: Ticket, color: "bg-primary/15 text-primary" },
  { label: "My gate", detail: "Gate B · 6 min walk", icon: Navigation, color: "bg-accent/15 text-accent" },
  { label: "Nearest washroom", detail: "Concourse East · 2 min", icon: Bath, color: "bg-violet-500/15 text-violet-300" },
  { label: "Food near me", detail: "12 stalls open nearby", icon: Utensils, color: "bg-warning/15 text-warning" },
];

const mapPins = [
  { x: "24%", y: "69%", label: "You", tone: "bg-primary" },
  { x: "64%", y: "30%", label: "124", tone: "bg-accent" },
  { x: "78%", y: "62%", label: "B", tone: "bg-warning" },
  { x: "43%", y: "38%", label: "WC", tone: "bg-violet-400" },
];

export default function FanPage() {
  const [message, setMessage] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [minutes, setMinutes] = useState(42);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setMinutes((value) => value === 38 ? 42 : value - 1), 7000);
    return () => window.clearInterval(timer);
  }, []);

  const ask = (prompt?: string) => {
    if (prompt) setMessage(prompt);
    setShowAnswer(true);
  };

  return (
    <main className={`min-h-dvh ${isLight ? "fan-light bg-slate-100 text-slate-900" : "bg-[#0c0e12] text-slate-100"}`}>
      <div className={`mx-auto min-h-dvh max-w-6xl border-x ${isLight ? "border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_100%)]" : "border-white/5 bg-[radial-gradient(circle_at_70%_-20%,rgba(112,0,255,.19),transparent_33%),linear-gradient(180deg,#111318_0%,#0c0e12_45%,#111318_100%)]"}`}>
        <header className="flex items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"><ArrowLeft className="h-4 w-4" /> StadiumIQ</Link>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsLight(!isLight)} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10" aria-label="Toggle light and dark mode">{isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</button>
            <button onClick={() => setLanguageOpen(!languageOpen)} className="relative flex h-9 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 text-xs font-medium hover:bg-white/10"><Languages className="h-4 w-4" /> EN</button>
            {languageOpen && <div className="absolute right-20 top-14 z-10 rounded-xl border border-white/10 bg-[#13213c] p-2 text-xs shadow-xl"><button className="block rounded-lg px-3 py-2 hover:bg-white/10">English</button><button className="block rounded-lg px-3 py-2 hover:bg-white/10">Español</button><button className="block rounded-lg px-3 py-2 hover:bg-white/10">Français</button></div>}
            <button className="relative rounded-full p-2 text-slate-300 hover:bg-white/10"><Bell className="h-5 w-5" /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" /></button>
          </div>
        </header>

        <section className="px-5 pb-5 pt-4 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-sm font-medium text-primary">Good evening, Maya</p><h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">Ready for matchday?</h1></div>
            <div className="rounded-2xl border border-white/10 bg-white/[.06] px-4 py-2.5 text-right"><p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Kickoff in</p><p className="font-mono text-xl font-bold text-white">00:{minutes.toString().padStart(2, "0")}:18</p></div>
          </div>
          <div className="mt-5 flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[.06] p-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary"><Waves className="h-5 w-5" /></div>
            <div className="min-w-0 flex-1"><p className="text-sm font-semibold">USA <span className="mx-2 text-slate-500">vs</span> Argentina</p><p className="mt-0.5 text-xs text-slate-400">MetLife Stadium · Group Stage · Today, 8:00 PM</p></div>
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </div>
        </section>

        <section className="px-5 pb-5 sm:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-[#7000ff]/45 bg-[linear-gradient(125deg,rgba(45,20,74,.95),rgba(17,19,24,.98))] p-5 shadow-[0_12px_45px_rgba(112,0,255,.14)] sm:p-6">
            <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-[#7000ff]/20 blur-2xl" />
            <div className="relative flex items-start gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-[#061225]"><Bot className="h-5 w-5" /></div><div><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary"><Sparkles className="h-3 w-3" /> AI Stadium Assistant</p><h2 className="mt-1.5 text-lg font-bold">How can I help you get match-ready?</h2><p className="mt-1 text-sm leading-5 text-slate-300">Ask about seats, gates, food, transport, or anything happening around you.</p></div></div>
            {showAnswer && <div className="relative mt-4 rounded-2xl bg-black/20 p-4 text-sm leading-6 text-slate-200"><button onClick={() => setShowAnswer(false)} className="float-right text-slate-400"><X className="h-4 w-4" /></button><span className="font-semibold text-primary">Here’s your route:</span> From your current location, follow the teal signs to Concourse East. Take the stairs by Gate B, then turn left at Section 122. You’ll reach your seat in about 6 minutes.</div>}
            <div className="relative mt-5 flex gap-2"><input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} placeholder="Try “How do I get to my seat?”" className="h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-[#07162b]/80 px-4 text-sm outline-none placeholder:text-slate-500 focus:border-primary/60" /><button onClick={() => ask()} className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-[#071225] hover:bg-primary/90"><ChevronRight className="h-5 w-5" /></button><button className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"><Mic className="h-5 w-5" /></button></div>
            <div className="relative mt-3 flex gap-2 overflow-x-auto pb-1">{["Find vegetarian food", "Which exit is quieter?", "Help me reach Gate B"].map((q) => <button onClick={() => ask(q)} key={q} className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:border-primary/50 hover:text-white">{q}</button>)}</div>
          </div>
        </section>

        <section className="px-5 pb-7 sm:px-8"><div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
          <div><div className="mb-3 flex items-center justify-between"><h2 className="font-display text-lg font-bold">Your matchday essentials</h2><button className="text-xs font-semibold text-primary">View all</button></div><div className="grid grid-cols-2 gap-3">{quickActions.map((action) => { const Icon = action.icon; const destination = action.label === "Find my seat" ? "seat" : action.label === "My gate" ? "gate" : action.label === "Nearest washroom" ? "washroom" : "food"; return <Link key={action.label} href={`/fan/directions/${destination}`} className="rounded-2xl border border-white/10 bg-white/[.055] p-4 text-left transition hover:-translate-y-0.5 hover:bg-white/[.09]"><div className={`grid h-9 w-9 place-items-center rounded-xl ${action.color}`}><Icon className="h-4 w-4" /></div><p className="mt-4 text-sm font-semibold">{action.label}</p><p className="mt-1 text-xs text-slate-400">{action.detail}</p></Link>})}</div></div>
          <div className="rounded-3xl border border-white/10 bg-white/[.055] p-4"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Your stadium map</p><p className="mt-0.5 text-xs text-slate-400">Live route guidance</p></div><MapPin className="h-4 w-4 text-primary" /></div><div className="relative mt-4 h-[220px] overflow-hidden rounded-2xl border border-white/10 bg-[#102a43] bg-[linear-gradient(35deg,transparent_48%,rgba(255,255,255,.06)_49%,rgba(255,255,255,.06)_51%,transparent_52%),linear-gradient(-35deg,transparent_48%,rgba(255,255,255,.05)_49%,rgba(255,255,255,.05)_51%,transparent_52%)] bg-[length:34px_34px]"><div className="absolute left-[18%] top-[17%] h-[68%] w-[65%] rounded-[46%] border-[18px] border-slate-500/30" /><div className="absolute left-[31%] top-[34%] h-[34%] w-[39%] rounded-[40%] border border-primary/20 bg-primary/10" /><svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 220"><path d="M95 160 C150 180, 190 75, 265 70" fill="none" stroke="#3dd8b4" strokeWidth="3" strokeDasharray="6 6" /></svg>{mapPins.map((pin) => <div key={pin.label} style={{left:pin.x,top:pin.y}} className={`absolute grid h-8 min-w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full px-1 text-[9px] font-bold text-[#071225] ring-4 ring-[#102a43] ${pin.tone}`}>{pin.label}</div>)}</div><button onClick={() => ask("Navigate me to my seat")} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-2.5 text-sm font-semibold hover:bg-white/15"><Navigation className="h-4 w-4 text-primary" /> Start navigation</button></div>
        </div><div className="mt-5 grid gap-3 sm:grid-cols-3"><Link href="/fan/directions/merchandise" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.045] p-4 text-left hover:bg-white/[.08]"><Shirt className="h-5 w-5 text-primary" /><div><p className="text-sm font-semibold">Official merchandise</p><p className="mt-0.5 text-xs text-slate-400">Fan Store East · 4 min walk</p></div></Link><Link href="/fan/accessibility" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.045] p-4 text-left hover:bg-white/[.08]"><Accessibility className="h-5 w-5 text-accent" /><div><p className="text-sm font-semibold">Accessibility support</p><p className="mt-0.5 text-xs text-slate-400">Step-free routes & assistance</p></div></Link><Link href="/fan/schedule" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.045] p-4 text-left hover:bg-white/[.08]"><Clock3 className="h-5 w-5 text-warning" /><div><p className="text-sm font-semibold">Match schedule</p><p className="mt-0.5 text-xs text-slate-400">Next: Brazil vs Japan · 11 PM</p></div></Link></div></section>

        <section className="border-t border-white/10 px-5 py-6 sm:px-8"><div className="grid gap-3 sm:grid-cols-3"><Link href="/fan/transport" className="flex items-center gap-3 rounded-2xl bg-white/[.04] p-3 hover:bg-white/[.08]"><TrainFront className="h-5 w-5 text-accent" /><div><p className="text-xs text-slate-400">After the match</p><p className="text-sm font-semibold">Metro · 9 min walk</p></div></Link><Link href="/fan/parking" className="flex items-center gap-3 rounded-2xl bg-white/[.04] p-3 hover:bg-white/[.08]"><ParkingCircle className="h-5 w-5 text-warning" /><div><p className="text-xs text-slate-400">Parking</p><p className="text-sm font-semibold">Lot P3 · 62% full</p></div></Link><button onClick={() => setEmergencyOpen(true)} className="flex items-center gap-3 rounded-2xl border border-red-400/25 bg-red-500/10 p-3 text-left hover:bg-red-500/15"><ShieldAlert className="h-5 w-5 text-red-400" /><div><p className="text-xs text-red-200/70">Need help?</p><p className="text-sm font-semibold text-red-100">Emergency assistance</p></div></button></div></section>
        {emergencyOpen && <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/70 p-4 backdrop-blur-sm sm:place-items-center"><div className="w-full max-w-md rounded-3xl border border-red-400/30 bg-[#13213c] p-6 shadow-2xl"><div className="flex items-start justify-between"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-red-500/15 text-red-400"><ShieldAlert className="h-5 w-5" /></div><button onClick={() => setEmergencyOpen(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button></div><h2 className="mt-5 font-display text-2xl font-bold">Emergency assistance</h2><p className="mt-2 text-sm leading-6 text-slate-300">This demo can share your approximate stadium location with the support team: East Concourse, near Section 121.</p><div className="mt-5 space-y-3"><button onClick={() => setShowAnswer(true)} className="flex w-full items-center gap-3 rounded-xl bg-red-500 px-4 py-3 text-left font-semibold text-white"><Phone className="h-5 w-5" /> Call stadium emergency team</button><button onClick={() => { setEmergencyOpen(false); ask("My child is lost. I need help."); }} className="flex w-full items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-left text-sm font-semibold"><Users className="h-5 w-5 text-primary" /> Report a missing person</button></div><p className="mt-4 text-center text-xs text-slate-400">Demo only · No live emergency services are contacted</p></div></div>}
      </div>
    </main>
  );
}
