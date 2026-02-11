import Link from "next/link";
import { ArrowRight, Droplet, Mail, Phone } from "lucide-react";
import { Button } from "../ui/button";

const PublicFooter = () => {
  return (
    <footer className="border-t border-border/70 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-8">
        <div className="space-y-5">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Droplet className="size-4 fill-current" />
            </span>
            <span className="font-heading text-xl font-semibold tracking-tight">
              Bloodline
            </span>
          </Link>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            A focused platform that helps donors, recipients, and coordinators
            act faster with less noise and clearer accountability.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-border/80 bg-card/70"
            >
              <Link href="/campaigns" className="gap-2">
                View campaigns
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/auth">Join now</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Navigate
            </p>
            <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
              <Link
                href="/about"
                className="transition-colors hover:text-foreground"
              >
                About
              </Link>
              <Link
                href="/campaigns"
                className="transition-colors hover:text-foreground"
              >
                Campaigns
              </Link>
              <Link
                href="/auth"
                className="transition-colors hover:text-foreground"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Contact
            </p>
            <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
              <a
                href="mailto:support@bloodline.app"
                className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Mail className="size-4" />
                support@bloodline.app
              </a>
              <a
                href="tel:+18001234567"
                className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Phone className="size-4" />
                +1 (800) 123-4567
              </a>
              <p className="pt-2 text-xs leading-relaxed">
                Emergency coordination desk available 24/7.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
          <p>© {new Date().getFullYear()} Bloodline. All rights reserved.</p>
          <p>Built for donor-first community response.</p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
