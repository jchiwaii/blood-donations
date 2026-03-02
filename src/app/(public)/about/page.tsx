import Link from "next/link";
import {
  ArrowRight,
  Droplet,
  HeartHandshake,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";

const principles = [
  {
    icon: ShieldCheck,
    title: "Safe by design",
    description:
      "Every request, donor touchpoint, and coordination step is structured around clarity, screening, and accountable handling.",
  },
  {
    icon: UsersRound,
    title: "Built for community",
    description:
      "We design for real neighborhoods, trusted donor networks, and local teams who need a calmer way to respond quickly.",
  },
  {
    icon: HeartHandshake,
    title: "Human first",
    description:
      "Technology supports the process, but empathy, trust, and responsive communication remain at the center of every interaction.",
  },
];

const stats = [
  { label: "Lives supported", value: "58K+" },
  { label: "Active donors", value: "12K+" },
  { label: "Coordinator support", value: "24/7" },
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden bg-background text-foreground">
      <section className="px-5 pb-8 pt-8 md:px-8 md:pt-10 lg:px-10 lg:pb-12 lg:pt-12">
        <div className="mx-auto max-w-[1770px] overflow-hidden rounded-[28px] border border-[#d9dfef] bg-gradient-to-b from-white to-[#e9edf6] shadow-[0_24px_80px_-58px_rgba(0,0,0,0.35)]">
          <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[minmax(0,1.02fr)_520px] lg:items-center lg:gap-14 lg:p-14">
            <div>
              <p className="type-section-name text-primary">About Us</p>
              <h1 className="type-heading-xl mt-5 max-w-[860px]">
                Redflow exists to make blood donation coordination feel clear,
                dependable, and deeply human.
              </h1>
              <p className="type-body-lg mt-6 max-w-[700px] text-muted-foreground">
                We bring donors, recipients, and coordinators into one calmer
                workflow so urgent needs can be answered with more trust, less
                friction, and better visibility at every step.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="h-12 rounded-full bg-gradient-to-r from-[#fc605c] to-[#fc3b32] px-8 text-sm font-medium text-white"
                >
                  <Link href="/auth" className="gap-2">
                    Join the Network
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-[#fc3830] px-8 text-sm text-[#fc3830]"
                >
                  <Link href="/#our-programs">Explore Programs</Link>
                </Button>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                  <article
                    key={stat.label}
                    className="rounded-[20px] border border-white/70 bg-white/70 px-5 py-5 shadow-[0_14px_34px_-28px_rgba(0,0,0,0.28)] backdrop-blur-sm"
                  >
                    <p className="type-stat text-[#fc3b32]">{stat.value}</p>
                    <p className="type-caption mt-3 text-muted-foreground">
                      {stat.label}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 -top-6 hidden rounded-full bg-white/85 px-4 py-2 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.3)] backdrop-blur-sm lg:inline-flex">
                <span className="type-caption inline-flex items-center gap-2 text-primary">
                  <Droplet className="size-3 fill-current" />
                  Donor-first coordination
                </span>
              </div>

              <div className="overflow-hidden rounded-[24px]">
                <Photo
                  src="https://res.cloudinary.com/dgh4a1why/image/upload/v1771666460/diverse-people-refugee-camps_pzei9h.jpg"
                  alt="Volunteers and community members working together"
                  width={520}
                  height={640}
                  priority
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="h-[360px] w-full object-cover object-center sm:h-[460px] lg:h-[640px]"
                />
              </div>

              <div className="mt-4 rounded-[22px] border border-[#d9dfef] bg-white/80 p-5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.25)] backdrop-blur-sm">
                <p className="type-title max-w-[420px] text-[#111317]">
                  We do not replace medical teams. We make it easier for people
                  and systems to move together when urgency is real.
                </p>
                <p className="type-body mt-3 text-muted-foreground">
                  That means clearer requests, stronger donor response, and more
                  confidence across the entire coordination flow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 md:px-8 lg:px-10 lg:py-[90px]">
        <div className="mx-auto max-w-[1770px]">
          <div className="mx-auto max-w-[980px] text-center">
            <p className="type-section-name text-primary">Our Principles</p>
            <h2 className="type-heading-lg mt-5">
              The platform is shaped by trust, responsiveness, and a standard
              of care that respects the urgency of every request.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {principles.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-[24px] border border-[#e2e6f0] bg-white/85 p-7 shadow-[0_18px_55px_-42px_rgba(0,0,0,0.35)]"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#fde8e5] text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="type-title mt-6">{title}</h3>
                <p className="type-body mt-4 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 pt-2 md:px-8 lg:px-10 lg:pb-[120px]">
        <div className="mx-auto max-w-[1170px] rounded-[30px] bg-gradient-to-b from-[#e8ebf6] to-[#c5d3f7] px-8 py-12 text-center shadow-[0_24px_70px_-52px_rgba(0,0,0,0.45)] sm:px-12 lg:px-[100px] lg:py-[84px]">
          <p className="type-section-name text-primary">Join Redflow</p>
          <h2 className="type-heading-md mx-auto mt-5 max-w-[820px] text-[#0f1117]">
            Become part of a donor community built to respond with speed,
            compassion, and confidence.
          </h2>
          <p className="type-body mx-auto mt-6 max-w-[640px] text-[#666666]">
            Whether you are ready to donate, coordinate, or stay informed,
            Redflow is designed to help people act with clarity when it matters
            most.
          </p>

          <Button
            asChild
            className="mt-8 h-[50px] rounded-full bg-gradient-to-r from-[#1e1f23] to-black px-10 text-sm font-medium text-white"
          >
            <Link href="/auth">Create Your Profile</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
