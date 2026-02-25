import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  Droplet,
  Facebook,
  HandHeart,
  HeartPulse,
  Instagram,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Twitter,
  Users,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";

type MissionCard = {
  title: string;
  src: string;
};

type ProgramCard = {
  title: string;
  description: string;
  location: string;
  src: string;
  tall?: boolean;
  dark?: boolean;
};

type Volunteer = {
  name: string;
  role: string;
  src: string;
  featured?: boolean;
};

const missionCards: MissionCard[] = [
  {
    title: "Hollow Creek",
    src: "https://res.cloudinary.com/dgh4a1why/image/upload/v1771666460/adorable-kid-playing-with-shadows_ng75ah.jpg",
  },
  {
    title: "Stonepath Village",
    src: "https://res.cloudinary.com/dgh4a1why/image/upload/v1771666461/photorealistic-kid-refugee-camp_2_l8aagx.jpg",
  },
  {
    title: "Drywell Town",
    src: "https://res.cloudinary.com/dgh4a1why/image/upload/v1771666461/photorealistic-refugee-camp_1_efasij.jpg",
  },
  {
    title: "Silent Haven",
    src: "https://res.cloudinary.com/dgh4a1why/image/upload/v1771666461/photorealistic-refugee-camp_f8uy0n.jpg",
  },
  {
    title: "Hopefall Settlement",
    src: "https://res.cloudinary.com/dgh4a1why/image/upload/v1771666459/photorealistic-kid-refugee-camp_1_oxx559.jpg",
  },
];

const stats = [
  { label: "Community projects supported and completed", value: "2.3K+" },
  { label: "Families empowered through care", value: "3.6M" },
  { label: "Lives impacted through donations", value: "130K+" },
  { label: "Community members in our network", value: "136K+" },
];

const programs: ProgramCard[] = [
  {
    title: "Community Blood Drives",
    description: "Bringing donation events directly into neighborhoods.",
    location: "River district",
    src: "https://picsum.photos/seed/program-community/570/380",
  },
  {
    title: "Youth Engagement",
    description: "Encouraging students to build a habit of compassion early.",
    location: "North campus",
    src: "https://picsum.photos/seed/program-youth/570/1220",
    tall: true,
    dark: true,
  },
  {
    title: "Mobile Donation Units",
    description: "Reaching remote and underserved communities on schedule.",
    location: "Harbor route",
    src: "https://picsum.photos/seed/program-mobile/570/380",
  },
  {
    title: "Donor Education",
    description: "Practical guidance for first-time and returning donors.",
    location: "Downtown center",
    src: "https://picsum.photos/seed/program-education/570/380",
  },
  {
    title: "Donor Care & Support",
    description: "Ensuring every donor feels informed, safe, and supported.",
    location: "Neighborhood clinic",
    src: "https://picsum.photos/seed/program-support/570/380",
  },
];

const volunteers: Volunteer[] = [
  {
    name: "Andrew Leadon",
    role: "Community Outreach",
    src: "https://picsum.photos/seed/volunteer-andrew/270/360",
  },
  {
    name: "Gillian Freeman",
    role: "Blood Drive Coordinator",
    src: "https://picsum.photos/seed/volunteer-gillian/270/360",
    featured: true,
  },
  {
    name: "Amber Julia",
    role: "Registration & Donor Support",
    src: "https://picsum.photos/seed/volunteer-amber/270/360",
  },
  {
    name: "Barbara Michelle",
    role: "Logistics & Supply Aid",
    src: "https://picsum.photos/seed/volunteer-barbara/270/360",
  },
];

const valueCards = [
  {
    src: "https://picsum.photos/seed/value-left/470/470",
    alt: "Volunteer helping donor during intake",
  },
  {
    src: "https://picsum.photos/seed/value-right/470/470",
    alt: "Donor support team smiling",
  },
];

const socials: LucideIcon[] = [Facebook, Instagram, Youtube, Twitter];

const tickerPhrases = [
  "A Gift of Blood is a Gift of Life",
  "Strong Hearts Donate Blood",
  "Saving Lives Starts with You",
  "Be the Lifesaver Someone Needs",
  "Blood Donation Builds Tomorrow",
  "One Donation, Endless Hope",
];

function SectionTag({ text }: { text: string }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
      {text}
    </p>
  );
}

function TickerSparkIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="size-5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.79241 10.6085C5.52825 23.1305 -1.70743 18.1151 9.45736 10.3761C-1.70743 18.1151 -4.47156 10 9.32934 10C-4.47156 10 -1.70743 1.88495 9.45736 9.62393C-1.70743 1.88495 5.52825 -3.13048 9.79241 9.39145C5.52825 -3.13048 14.4721 -3.13048 10.2072 9.39145C14.4721 -3.13048 21.7078 1.88495 10.5422 9.62393C21.7078 1.88495 24.4715 10 10.6703 10C24.4715 10 21.7078 18.1151 10.5422 10.3761C21.7078 18.1151 14.4721 23.1305 10.2072 10.6085C14.4721 23.1305 5.52825 23.1305 9.79241 10.6085"
        fill="#FC382F"
      />
    </svg>
  );
}

export function Hero() {
  return (
    <div className="overflow-hidden bg-background text-foreground">
      <section className="px-5 pb-0 pt-4 md:px-8 lg:px-10 lg:pt-5">
        <div className="mx-auto max-w-[1880px] overflow-hidden rounded-[24px] bg-[#1d1d1f] shadow-[0_30px_100px_-45px_rgba(0,0,0,0.6)] md:rounded-[30px]">
          <div className="relative grid min-h-[560px] items-end gap-8 p-7 sm:p-10 lg:min-h-[840px] lg:grid-cols-[1.15fr_470px] lg:p-14">
            <Photo
              src="https://res.cloudinary.com/dgh4a1why/image/upload/v1771666460/diverse-people-refugee-camps_pzei9h.jpg"
              alt="Blood donation volunteers collaborating"
              width={1880}
              height={840}
              priority
              sizes="100vw"
              className="absolute inset-0 h-full w-full object-cover object-[18%_center] sm:object-[14%_center] lg:object-[8%_center]"
            />

            <div className="absolute inset-0 bg-[linear-gradient(102deg,rgba(17,17,19,0.82)_12%,rgba(17,17,19,0.3)_50%,rgba(17,17,19,0.55)_100%)]" />

            <div className="relative z-10 max-w-[760px] space-y-6 lg:pb-16">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-[#ff5c5c]" />
                Lifeline network
              </p>
              <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl lg:text-7xl">
                Every Drop Tells a Story of Hope.
              </h1>
              <p className="max-w-[500px] text-base leading-relaxed text-white/80 sm:text-lg">
                Every drop you share becomes a lifeline for someone fighting for
                another day.
              </p>
              <Button
                asChild
                className="h-12 rounded-full bg-gradient-to-r from-[#fc605c] to-[#fc3b32] px-9 text-sm font-medium text-white shadow-[0_12px_26px_-10px_rgba(252,59,50,0.75)] hover:from-[#fc5a56] hover:to-[#f5322a]"
              >
                <Link href="/auth" className="gap-2">
                  View Our Program
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <aside className="relative z-10 ml-auto w-full max-w-[470px] rounded-[20px] bg-white p-5 shadow-[0_28px_80px_-35px_rgba(0,0,0,0.55)] sm:p-6">
              <div className="rounded-[16px] border border-[#e5e7ef] bg-[#f5f6fb] p-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-[#e8edf7] to-[#cad8f6] px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-black">
                    <Droplet className="size-3 fill-current" />
                    Redflow
                  </div>
                  <div className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#1f1f22] px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                    <span className="size-1.5 rounded-full bg-[#62d563]" />
                    2026
                  </div>
                </div>

                <h3 className="font-heading text-2xl font-semibold leading-tight text-[#121317]">
                  Lifeline Heroes Initiative
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5a6170]">
                  Every donor can help keep emergency care moving. Register now
                  and get matched to nearby drives.
                </p>

                <Button
                  asChild
                  className="mt-5 h-10 rounded-full bg-gradient-to-r from-[#1f1f22] to-black px-5 text-xs uppercase tracking-[0.16em] text-white"
                >
                  <Link href="/auth">Register</Link>
                </Button>

                <div className="mt-6 overflow-hidden rounded-[14px]">
                  <Photo
                    src="https://res.cloudinary.com/dgh4a1why/image/upload/v1771666460/african-children-standing-head-head_jbhoqr.jpg"
                    alt="Volunteer preparing blood donation kit"
                    width={410}
                    height={210}
                    priority
                    sizes="(max-width: 1024px) 100vw, 410px"
                    className="h-[210px] w-full object-cover"
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-[1170px]">
          <div className="grid grid-cols-1 gap-3 py-3 px-4 sm:px-5 md:grid-cols-[1fr_180px] md:items-center md:gap-4 lg:px-0">
            <div className="flex flex-wrap items-center gap-2.5 lg:w-[492px]">
              <div className="flex -space-x-[10px]">
                {[
                  "https://randomuser.me/api/portraits/women/44.jpg",
                  "https://randomuser.me/api/portraits/men/32.jpg",
                  "https://randomuser.me/api/portraits/women/68.jpg",
                  "https://randomuser.me/api/portraits/men/75.jpg",
                  "https://randomuser.me/api/portraits/women/90.jpg",
                ].map((src, index) => (
                  <Photo
                    key={`avatar-${index}`}
                    src={src}
                    alt={`Community donor ${index + 1}`}
                    width={40}
                    height={40}
                    sizes="40px"
                    className="size-10 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                10,000+ people smiling through every donation cycle.
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              className="h-[50px] w-[180px] rounded-full border-[#fc3830] px-7 text-[#fc3830] md:justify-self-end"
            >
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="px-5 pb-18 pt-20 md:px-8 md:pt-24 lg:px-10 lg:pb-[140px] lg:pt-[140px]"
      >
        <div className="mx-auto max-w-[1770px]">
          <div className="mx-auto max-w-[1170px]">
            <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-0">
              <div>
                <SectionTag text="Our Mission" />
              </div>
              <div>
                <h2 className="max-w-[930px] font-heading text-3xl leading-tight sm:text-4xl md:text-5xl">
                  Our mission is to inspire a culture of compassion by making
                  blood donation accessible, meaningful, and impactful.
                </h2>
                <div className="mt-[53px] grid gap-6 md:grid-cols-[minmax(0,1fr)_180px] md:items-start">
                  <p className="max-w-[670px] text-base leading-relaxed text-muted-foreground">
                    We are committed to creating a healthier, more resilient
                    community where every person can access life-saving blood
                    when it matters most.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="h-[50px] w-[180px] rounded-full border-[#fc3830] px-7 text-[#fc3830] md:mt-[5px] md:justify-self-end"
                  >
                    <Link href="#our-programs">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-[100px] lg:grid-cols-5">
            {missionCards.map((card) => (
              <article
                key={card.title}
                className="group relative overflow-hidden rounded-[18px]"
              >
                <Photo
                  src={card.src}
                  alt={card.title}
                  width={338}
                  height={480}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="h-[300px] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-[480px]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(16,17,20,0.72),rgba(16,17,20,0.12))]" />
                <p className="absolute left-5 top-5 rounded-full bg-black/50 px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
                  {card.title}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-[#d8ddef] bg-[#c6d3f7]">
        <div className="marquee-track py-[50px] font-heading text-[clamp(20px,2.15vw,42px)] leading-none text-[#ec3d34]">
          {Array.from({ length: 2 }).map((_, copyIndex) => (
            <div
              key={`ticker-copy-${copyIndex}`}
              className="flex shrink-0 items-center gap-10 px-5 sm:px-8"
            >
              {tickerPhrases.map((phrase) => (
                <span
                  key={`${copyIndex}-${phrase}`}
                  className="whitespace-nowrap"
                >
                  {phrase}
                  <span className="ml-8 inline-flex items-center align-middle">
                    <TickerSparkIcon />
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden bg-background py-3">
        <div className="marquee-track-reverse">
          {Array.from({ length: 2 }).map((_, copyIndex) => (
            <p
              key={`redgesture-copy-${copyIndex}`}
              className="shrink-0 whitespace-nowrap px-6 font-display text-[clamp(82px,9.8vw,188px)] uppercase leading-none text-transparent"
              style={{
                WebkitTextStroke: "0.5px #f04842",
              }}
            >
              THE REDGESTURE THE REDGESTURE THE REDGESTURE THE REDGESTURE
            </p>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#ffffff] to-[#e9edf6] px-5 py-20 md:px-8 lg:px-10">
        <div className="mx-auto max-w-[1770px]">
          <div className="max-w-[1270px]">
            <SectionTag text="About Us" />
            <h2 className="mt-4 font-heading text-3xl leading-tight sm:text-4xl md:text-5xl">
              Built on compassion, integrity, and commitment to public health,
              our mission is to ensure safe and reliable blood for hospitals and
              families.
            </h2>
            <Button
              asChild
              className="mt-7 h-12 rounded-full bg-gradient-to-r from-[#fc605c] to-[#fc3b32] px-8 text-sm font-medium text-white"
            >
              <Link href="#our-programs">View Our Program</Link>
            </Button>
          </div>

          <div className="mt-16 lg:mt-[100px] lg:grid lg:grid-cols-[minmax(0,1170px)_272px] lg:items-start lg:gap-[30px]">
            <div className="grid gap-6 sm:grid-cols-2 lg:w-[1170px] lg:grid-cols-4 lg:gap-x-[30px] lg:gap-y-0">
              {stats.map((item) => (
                <article
                  key={item.label}
                  className="min-h-[170px] border-l border-black/15 pl-8 lg:min-h-[200px] lg:pl-10"
                >
                  <p className="max-w-[230px] text-lg leading-tight text-black">
                    {item.label}
                  </p>
                  <p className="mt-10 font-heading text-[54px] leading-none text-[#fc3b32]">
                    {item.value}
                  </p>
                </article>
              ))}
            </div>

            <article className="mt-8 lg:mt-12">
              <div className="flex items-start gap-4">
                <p className="font-heading text-[56px] leading-none lg:text-[64px]">
                  4.9/5
                </p>
                <p className="pt-2 text-sm leading-5 text-muted-foreground">
                  37K Happy
                  <br />
                  Donors
                </p>
              </div>
              <div className="mt-2 flex items-center gap-1 text-[#ff9f1a]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={`star-${index}`} className="size-5 fill-current" />
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="bg-white px-5 py-20 md:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-[1770px]">
          <div className="mx-auto max-w-[1270px] text-center">
            <SectionTag text="Our Commitment" />
            <h2 className="mt-4 font-heading text-3xl leading-tight sm:text-4xl lg:text-[58px] lg:leading-[1.15]">
              We are dedicated to building a healthier, stronger community by
              ensuring reliable blood for those who need it most.
            </h2>

            <div className="mt-14 grid gap-8 md:mt-18 md:grid-cols-3 md:items-start">
              <p className="order-2 text-center font-heading text-[clamp(42px,4.4vw,72px)] leading-none text-[#8a8b92] md:order-1 md:text-left">
                Saving Lives
              </p>

              <div className="order-1 text-center md:order-2">
                <p className="font-heading text-[clamp(48px,5.2vw,76px)] leading-none text-black">
                  Delivering Hope
                </p>
                <p className="mx-auto mt-6 max-w-[570px] text-base leading-relaxed text-muted-foreground">
                  We follow strict standards to ensure every donation is
                  processed with the highest level of safety and care.
                </p>

                <div className="mt-8 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    aria-label="Previous"
                    className="flex size-[50px] items-center justify-center rounded-full bg-[#f6f6f7] text-[#fc3b32] transition hover:bg-[#efeff2]"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next"
                    className="flex size-[50px] items-center justify-center rounded-full bg-[#f6f6f7] text-[#fc3b32] transition hover:bg-[#efeff2]"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>
              </div>

              <p className="order-3 text-center font-heading text-[clamp(42px,4.4vw,72px)] leading-none text-[#8a8b92] md:text-right">
                Ensuring Safe
              </p>
            </div>
          </div>

          <div className="relative mt-12 overflow-hidden rounded-[22px] border border-[#d9dfef]">
            <Photo
              src="https://picsum.photos/seed/commitment-video/1770/680"
              alt="Blood donation process in action"
              width={1770}
              height={680}
              sizes="100vw"
              className="h-[360px] w-full object-cover md:h-[680px]"
            />
            <div className="absolute inset-0 bg-black/30" />
            <button
              type="button"
              aria-label="Play video"
              className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/75 bg-black/30 text-white backdrop-blur-sm transition hover:scale-105"
            >
              <CirclePlay className="size-8" />
            </button>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8 lg:px-10">
        <div className="mx-auto max-w-[1170px] rounded-[30px] bg-gradient-to-b from-[#e8ebf6] to-[#c5d3f7] px-8 py-14 text-center shadow-[0_24px_70px_-52px_rgba(0,0,0,0.5)] sm:px-12 sm:py-18 lg:px-[100px] lg:py-[140px]">
          <p className="font-heading text-[clamp(36px,4.5vw,76px)] leading-[1.1] text-[#0f1117]">
            Every drop you give becomes a lifeline, restoring health, sparking
            hope, and giving someone a second chance.
          </p>
          <p className="mx-auto mt-10 max-w-[670px] text-base leading-relaxed text-[#666666]">
            Your donation can help save a life. It&apos;s a powerful reminder
            that even the smallest act of giving can create an extraordinary
            impact.
          </p>
          <p className="mt-10 font-heading text-[clamp(78px,10vw,188px)] font-semibold leading-[0.95] tracking-[-0.02em] text-[#fc3b32]">
            382,945+
          </p>

          <Button
            asChild
            className="mt-10 h-[50px] rounded-full bg-gradient-to-r from-[#1e1f23] to-black px-10 text-sm font-medium text-white"
          >
            <Link href="/auth">Join Us Today</Link>
          </Button>
          <p className="mx-auto mt-10 max-w-[670px] text-base leading-5 text-[#666666]">
            Your act of kindness today can become a miracle for someone
            tomorrow.
          </p>
        </div>
      </section>

      <section
        id="our-programs"
        className="bg-gradient-to-b from-[#ffffff] to-[#e9edf6] px-5 py-20 md:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-[1770px]">
          <div className="mx-auto max-w-[980px] text-center">
            <SectionTag text="Our Programs" />
            <h2 className="mt-4 font-heading text-3xl leading-tight sm:text-4xl">
              Discover the initiatives we built to support donors, empower
              communities, and secure life-saving blood where it is needed most.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <article className="space-y-5 rounded-[18px] bg-white/85 p-0 shadow-[0_16px_55px_-40px_rgba(0,0,0,0.35)]">
              <div className="relative overflow-hidden rounded-[18px]">
                <Photo
                  src={programs[0].src}
                  alt={programs[0].title}
                  width={570}
                  height={380}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="h-[280px] w-full object-cover sm:h-[380px]"
                />
              </div>
              <div className="px-6 pb-6">
                <h3 className="font-heading text-3xl">{programs[0].title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {programs[0].description}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {programs[0].location}
                  </p>
                  <button
                    type="button"
                    className="flex size-10 items-center justify-center rounded-full bg-[#1f1f22] text-white"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-[20px] bg-black text-white shadow-[0_22px_65px_-50px_rgba(0,0,0,0.55)] lg:row-span-2">
              <Photo
                src={programs[1].src}
                alt={programs[1].title}
                width={570}
                height={1220}
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="h-full min-h-[560px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.85)_10%,rgba(0,0,0,0.2)_55%)]" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <h3 className="font-heading text-3xl">{programs[1].title}</h3>
                <p className="mt-3 text-sm text-white/80">
                  {programs[1].description}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/70">
                    {programs[1].location}
                  </p>
                  <button
                    type="button"
                    className="flex size-10 items-center justify-center rounded-full bg-white text-black"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            </article>

            <article className="space-y-5 rounded-[18px] bg-white/85 p-0 shadow-[0_16px_55px_-40px_rgba(0,0,0,0.35)]">
              <div className="relative overflow-hidden rounded-[18px]">
                <Photo
                  src={programs[2].src}
                  alt={programs[2].title}
                  width={570}
                  height={380}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="h-[280px] w-full object-cover sm:h-[380px]"
                />
              </div>
              <div className="px-6 pb-6">
                <h3 className="font-heading text-3xl">{programs[2].title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {programs[2].description}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {programs[2].location}
                  </p>
                  <button
                    type="button"
                    className="flex size-10 items-center justify-center rounded-full bg-[#1f1f22] text-white"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            </article>

            <article className="space-y-5 rounded-[18px] bg-white/85 p-0 shadow-[0_16px_55px_-40px_rgba(0,0,0,0.35)]">
              <div className="relative overflow-hidden rounded-[18px]">
                <Photo
                  src={programs[3].src}
                  alt={programs[3].title}
                  width={570}
                  height={380}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="h-[280px] w-full object-cover sm:h-[380px]"
                />
              </div>
              <div className="px-6 pb-6">
                <h3 className="font-heading text-3xl">{programs[3].title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {programs[3].description}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {programs[3].location}
                  </p>
                  <button
                    type="button"
                    className="flex size-10 items-center justify-center rounded-full bg-[#1f1f22] text-white"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            </article>

            <article className="space-y-5 rounded-[18px] bg-white/85 p-0 shadow-[0_16px_55px_-40px_rgba(0,0,0,0.35)]">
              <div className="relative overflow-hidden rounded-[18px]">
                <Photo
                  src={programs[4].src}
                  alt={programs[4].title}
                  width={570}
                  height={380}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="h-[280px] w-full object-cover sm:h-[380px]"
                />
              </div>
              <div className="px-6 pb-6">
                <h3 className="font-heading text-3xl">{programs[4].title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {programs[4].description}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {programs[4].location}
                  </p>
                  <button
                    type="button"
                    className="flex size-10 items-center justify-center rounded-full bg-[#1f1f22] text-white"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="donations" className="bg-white px-5 py-20 md:px-8 lg:px-10">
        <div className="mx-auto max-w-[1770px]">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <SectionTag text="Donation" />
              <h2 className="mt-4 max-w-[820px] font-heading text-3xl leading-tight sm:text-4xl md:text-5xl">
                Every act of giving has the power to create a ripple of hope.
                Your contribution can change lives.
              </h2>
              <p className="mt-5 max-w-[680px] text-base leading-relaxed text-muted-foreground">
                Your contribution builds stronger donor communities, improves
                emergency response speed, and keeps hospitals prepared.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <article className="overflow-hidden rounded-[18px]">
                  <Photo
                    src="https://picsum.photos/seed/donation-left/370/260"
                    alt="Blood bank technician preparing supplies"
                    width={370}
                    height={260}
                    sizes="(max-width: 1024px) 100vw, 370px"
                    className="h-[220px] w-full object-cover sm:h-[260px]"
                  />
                </article>
                <article className="overflow-hidden rounded-[18px]">
                  <Photo
                    src="https://picsum.photos/seed/donation-right/370/260"
                    alt="Donor being guided during registration"
                    width={370}
                    height={260}
                    sizes="(max-width: 1024px) 100vw, 370px"
                    className="h-[220px] w-full object-cover sm:h-[260px]"
                  />
                </article>
              </div>
            </div>

            <form className="space-y-4 rounded-[22px] border border-[#e5e8f1] bg-white p-6 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.35)] sm:p-8">
              <label className="block">
                <span className="sr-only">Name</span>
                <input
                  type="text"
                  placeholder="Name"
                  className="h-14 w-full rounded-[999px] border border-[#ebeef7] bg-[#f9f9fb] px-6 text-sm outline-none transition focus:border-primary/40"
                />
              </label>

              <label className="block">
                <span className="sr-only">Email Address</span>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="h-14 w-full rounded-[999px] border border-[#ebeef7] bg-[#f9f9fb] px-6 text-sm outline-none transition focus:border-primary/40"
                />
              </label>

              <label className="block">
                <span className="sr-only">Phone</span>
                <input
                  type="tel"
                  placeholder="Phone"
                  className="h-14 w-full rounded-[999px] border border-[#ebeef7] bg-[#f9f9fb] px-6 text-sm outline-none transition focus:border-primary/40"
                />
              </label>

              <label className="block">
                <span className="sr-only">Donation Amount</span>
                <input
                  type="text"
                  placeholder="Donation Amount"
                  className="h-14 w-full rounded-[999px] border border-[#ebeef7] bg-[#f9f9fb] px-6 text-sm outline-none transition focus:border-primary/40"
                />
              </label>

              <label className="block">
                <span className="sr-only">Your Message</span>
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  className="w-full rounded-[28px] border border-[#ebeef7] bg-[#f9f9fb] px-6 py-4 text-sm outline-none transition focus:border-primary/40"
                />
              </label>

              <Button
                type="submit"
                className="h-11 rounded-full bg-gradient-to-r from-[#fc605c] to-[#fc3b32] px-7 text-sm text-white"
              >
                Donate Now
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section
        id="volunteers"
        className="bg-gradient-to-b from-[#ffffff] to-[#e9edf6] px-5 py-20 md:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-[1770px] text-center">
          <SectionTag text="Volunteers" />
          <h2 className="mx-auto mt-4 max-w-[1020px] font-heading text-3xl leading-tight sm:text-4xl">
            Get to know the everyday heroes who make our community stronger
            through kindness, teamwork, and unwavering commitment.
          </h2>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {volunteers.map((volunteer) => (
              <article
                key={volunteer.name}
                className="group overflow-hidden rounded-[20px] bg-white p-4 text-left shadow-[0_18px_52px_-42px_rgba(0,0,0,0.45)]"
              >
                <div className="relative overflow-hidden rounded-[16px]">
                  <Photo
                    src={volunteer.src}
                    alt={volunteer.name}
                    width={270}
                    height={360}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="h-[280px] w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-[360px]"
                  />
                  {volunteer.featured ? (
                    <div className="absolute inset-0 flex items-end justify-center bg-[linear-gradient(to_top,rgba(0,0,0,0.74),rgba(0,0,0,0.12))] p-5">
                      <div className="flex items-center gap-2">
                        {socials.map((Icon, index) => (
                          <span
                            key={`${volunteer.name}-social-${index}`}
                            className="flex size-9 items-center justify-center rounded-full bg-gradient-to-b from-[#fc605c] to-[#fc3b32] text-white"
                          >
                            <Icon className="size-4" />
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
                <h3 className="mt-4 font-heading text-2xl">{volunteer.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {volunteer.role}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#c6d3f7] px-5 py-20 md:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1770px] items-center gap-8 lg:grid-cols-[470px_1fr_470px]">
          <article className="overflow-hidden rounded-[20px]">
            <Photo
              src={valueCards[0].src}
              alt={valueCards[0].alt}
              width={470}
              height={470}
              sizes="(max-width: 1024px) 100vw, 470px"
              className="h-[260px] w-full object-cover sm:h-[470px]"
            />
          </article>

          <div className="mx-auto max-w-[700px] text-center">
            <SectionTag text="Our Values" />
            <h2 className="mt-4 font-heading text-3xl leading-tight sm:text-4xl">
              We are guided by principles that reflect who we are and what we
              stand for.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#1d1f29]/75">
              These values shape every action we take, every choice we make, and
              every life we support.
            </p>
            <Button
              asChild
              className="mt-7 h-11 rounded-full bg-gradient-to-r from-[#fc605c] to-[#fc3b32] px-7 text-sm text-white"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>

          <article className="overflow-hidden rounded-[20px]">
            <Photo
              src={valueCards[1].src}
              alt={valueCards[1].alt}
              width={470}
              height={470}
              sizes="(max-width: 1024px) 100vw, 470px"
              className="h-[260px] w-full object-cover sm:h-[470px]"
            />
          </article>
        </div>
      </section>
    </div>
  );
}
