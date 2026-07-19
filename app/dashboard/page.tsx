import Link from "next/link";
import { Activity, ArrowUpRight, Bot, Bus, CircleAlert, Gauge, Map, ShieldCheck, Users } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";

const recommendations = [
  { title: "Open Gate 6 for the next 20 minutes", detail: "Moves 1,100 visitors away from Gate 4 and cuts queue time by an estimated 31%.", impact: "High impact", action: "Open gate" },
  { title: "Redirect arrivals to Gate B", detail: "North concourse is trending 18% above its planned density before kickoff.", impact: "Medium impact", action: "Send alert" },
  { title: "Add 3 volunteers at Food Court 3", detail: "Predicted service wait will exceed 9 minutes at half-time without support.", impact: "Medium impact", action: "Assign team" },
];

export default function DashboardPage() {
  return (
    <PageLayout
      title="Command center"
      description="USA vs Argentina · MetLife Stadium · Kickoff in 42 minutes"
      breadcrumbs={[{ label: "Live operations" }]}
      actions={<Button size="sm" asChild><Link href="/dashboard/assistant"><Bot className="h-4 w-4" /> Ask StadiumIQ</Link></Button>}
    >
      <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/[.07] px-3 py-2 text-xs text-primary"><span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Live telemetry healthy · Last sync 8 seconds ago</div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Inside venue" value="64,218" icon={Users} accent="primary" trend={{ value: "+1,248 in last 10 min", direction: "up", isPositive: true }} />
        <StatCard label="Average gate queue" value="6.4 min" icon={Gauge} accent="info" trend={{ value: "Gate 4: 12.8 min", direction: "up", isPositive: false }} />
        <StatCard label="Crowd density" value="72%" icon={Activity} accent="warning" trend={{ value: "North concourse elevated", direction: "up", isPositive: false }} />
        <StatCard label="Active incidents" value="3" icon={CircleAlert} accent="destructive" trend={{ value: "1 needs review", direction: "up", isPositive: false }} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between"><div><p className="text-sm font-semibold">Live stadium overview</p><p className="mt-1 text-xs text-muted-foreground">Density, gates, and response teams</p></div><Link href="/dashboard/navigation" className="flex items-center gap-1 text-xs font-medium text-primary">Full map <ArrowUpRight className="h-3.5 w-3.5" /></Link></div>
          <div className="relative mt-5 h-64 overflow-hidden rounded-lg border border-border bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/.15),transparent_33%),linear-gradient(30deg,transparent_48%,hsl(var(--border)/.6)_49%,hsl(var(--border)/.6)_51%,transparent_52%),linear-gradient(-30deg,transparent_48%,hsl(var(--border)/.6)_49%,hsl(var(--border)/.6)_51%,transparent_52%)] bg-[length:auto,38px_38px,38px_38px]">
            <div className="absolute left-[17%] top-[14%] h-[73%] w-[66%] rounded-[48%] border-[24px] border-muted" /><div className="absolute left-[32%] top-[33%] h-[36%] w-[36%] rounded-[42%] border border-primary/30 bg-primary/10" />
            {[['Gate 4','left-[10%] top-[52%]','bg-destructive'],['Gate 6','left-[81%] top-[49%]','bg-primary'],['Med 2','left-[54%] top-[72%]','bg-warning'],['Sec D','left-[38%] top-[20%]','bg-info']].map(([label, pos, color]) => <div key={label} className={`absolute ${pos} flex items-center gap-1 rounded-full border border-background bg-surface-elevated px-2 py-1 text-[10px] font-semibold shadow-lg`}><span className={`h-2 w-2 rounded-full ${color}`} />{label}</div>)}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md bg-background/90 px-2 py-1.5 text-[10px] text-muted-foreground"><Map className="h-3 w-3 text-primary" /> Crowd heat map · live</div>
          </div>
        </section>
        <section className="rounded-xl border border-border bg-card p-5"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Gate status</p><p className="mt-1 text-xs text-muted-foreground">8 of 9 gates operating</p></div><ShieldCheck className="h-5 w-5 text-primary" /></div><div className="mt-5 space-y-3">{[['Gate A','Open','4 min','bg-primary'],['Gate B','Open','6 min','bg-primary'],['Gate 4','Congested','13 min','bg-destructive'],['Gate 6','Standby','—','bg-warning']].map(([gate,status,wait,tone]) => <div className="flex items-center justify-between rounded-lg bg-secondary/45 px-3 py-2.5" key={gate}><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${tone}`} /><p className="text-sm font-medium">{gate}</p></div><div className="text-right"><p className="text-xs font-semibold">{status}</p><p className="text-[10px] text-muted-foreground">{wait}</p></div></div>)}</div><Button className="mt-4 w-full" variant="secondary" size="sm" asChild><Link href="/dashboard/operations?tab=transport"><Bus className="h-3.5 w-3.5" /> Manage access</Link></Button></section>
      </div>
      <section className="rounded-xl border border-primary/20 bg-card p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="flex items-center gap-2 text-sm font-semibold"><span className="grid h-7 w-7 place-items-center rounded-md bg-primary/15 text-primary"><Bot className="h-4 w-4" /></span> AI decision support</p><p className="mt-1 text-xs text-muted-foreground">Recommendations ranked by projected operational impact</p></div><Link href="/dashboard/assistant" className="text-xs font-semibold text-primary">Open Copilot →</Link></div><div className="mt-4 grid gap-3 lg:grid-cols-3">{recommendations.map((item) => <div className="rounded-lg border border-border bg-secondary/30 p-4" key={item.title}><div className="flex items-center justify-between gap-2"><span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">{item.impact}</span><Activity className="h-4 w-4 text-muted-foreground" /></div><p className="mt-3 text-sm font-semibold leading-5">{item.title}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{item.detail}</p><Button className="mt-4 w-full" size="sm" variant="secondary">{item.action}</Button></div>)}</div></section>
    </PageLayout>
  );
}
