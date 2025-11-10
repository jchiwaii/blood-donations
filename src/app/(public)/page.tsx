import Link from "next/link";

import { Hero } from "./_components/hero";
import { Button } from "@/components/ui/button";
import { Droplet, Heart } from "lucide-react";

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-20%,rgba(79,70,229,0.2)_0%,rgba(15,23,42,0.95)_60%)]"
        aria-hidden="true"
      />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 sm:px-8">
          <Link href="/" className="flex items-center gap-2 text-white">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-white/10">
              <Droplet className="size-5 text-rose-200" />
            </span>
            <span className="text-lg font-semibold tracking-wide">
              BloodConnect
            </span>
          </Link>

          <Button
            size="sm"
            variant="ghost"
            className="border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            asChild
          >
            <Link href="/auth" className="flex items-center gap-2">
              <Heart className="size-4 text-rose-200" />
              Login / Register
            </Link>
          </Button>
        </div>
      </header>

      <main className="relative">
        <Hero />
      </main>
    </div>
  );
};

export default Home;
