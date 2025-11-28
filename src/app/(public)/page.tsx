import Link from "next/link";

import { Hero } from "./_components/hero";
import { Button } from "@/components/ui/button";
import { Droplet, Heart } from "lucide-react";

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"
        aria-hidden="true"
      />

      <main className="relative">
        <Hero />
      </main>
    </div>
  );
};

export default Home;
