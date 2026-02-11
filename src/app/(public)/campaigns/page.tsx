import Link from "next/link";
import { CalendarDays, MapPin, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";

const campaigns = [
  {
    id: 1,
    title: "Downtown Mobile Unit",
    location: "Central Plaza, New York",
    date: "February 18, 2026",
    summary:
      "Walk-in donations and pre-booked appointments focused on emergency O- and A+ reserves.",
    status: "Open",
  },
  {
    id: 2,
    title: "University Health Week",
    location: "State University Hall",
    date: "February 24, 2026",
    summary:
      "Student-led drive with same-day screening and coordinator onboarding for first-time donors.",
    status: "Upcoming",
  },
  {
    id: 3,
    title: "Community Care Saturday",
    location: "Westside Community Center",
    date: "March 2, 2026",
    summary:
      "Neighborhood campaign supporting maternity and trauma units across partner clinics.",
    status: "Upcoming",
  },
];

export default function CampaignsPage() {
  return (
    <div className="relative overflow-hidden pb-16 text-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-75"
        style={{
          background:
            "radial-gradient(circle at 90% -6%, rgba(196,44,43,0.16), transparent 34%), radial-gradient(circle at 5% 20%, rgba(180,83,9,0.09), transparent 22%)",
        }}
      />

      <section className="relative px-6 pb-14 pt-16 sm:px-10 sm:pt-20">
        <div className="mx-auto w-full max-w-6xl rounded-[2rem] border border-border/70 bg-card/80 p-7 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Active campaigns
          </p>
          <h1 className="mt-4 max-w-3xl text-balance font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Find donor drives near you and join the next response wave.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Each campaign is coordinated with local hospitals and community
            volunteers to keep blood inventory stable where it matters most.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm text-muted-foreground">
            <UsersRound className="size-4 text-primary" />
            320+ partner clinics supported through campaign events
          </div>
        </div>
      </section>

      <section className="px-6 py-2 sm:px-10">
        <div className="mx-auto grid w-full max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <article
              key={campaign.id}
              className="group rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  {campaign.status}
                </span>
                <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  {campaign.date}
                </p>
              </div>

              <h2 className="font-heading text-xl font-semibold tracking-tight group-hover:text-primary">
                {campaign.title}
              </h2>

              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {campaign.location}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {campaign.summary}
              </p>

              <Button asChild variant="outline" className="mt-6 w-full rounded-xl border-border/80">
                <Link href="/auth">Join this campaign</Link>
              </Button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
