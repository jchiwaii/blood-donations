import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";

const footerLinks = [
  { label: "About", href: "/#about" },
  { label: "Our Programs", href: "/#our-programs" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Donation", href: "/#donations" },
  { label: "Volunteers", href: "/#volunteers" },
];

const PublicFooter = () => {
  return (
    <footer id="contact" className="relative overflow-hidden bg-gradient-to-b from-[#fc605c] to-[#fc3b32] text-white">
      <div className="mx-auto w-full max-w-[1770px] px-5 pb-8 pt-14 md:px-8 lg:px-10">
        <div className="grid gap-10 border-b border-white/25 pb-10 md:grid-cols-[1.05fr_1fr_0.9fr] md:gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">From Proven Experience In Promise</p>
            <h3 className="mt-4 max-w-[500px] font-heading text-3xl leading-tight sm:text-4xl">
              Every act of generosity creates change that outlives the moment.
            </h3>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Say Hello</p>
            <div className="mt-4 space-y-3 text-sm">
              <a href="mailto:hello@redflow.org" className="inline-flex items-center gap-2 text-white/90 transition hover:text-white">
                <Mail className="size-4" />
                hello@redflow.org
              </a>
              <a href="tel:+10123456789" className="inline-flex items-center gap-2 text-white/90 transition hover:text-white">
                <Phone className="size-4" />
                (+01) 123456789
              </a>
              <p className="inline-flex items-start gap-2 text-white/90">
                <MapPin className="mt-0.5 size-4" />
                Festival Pavilion, 2nd floor, Midtown
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Menu</p>
            <div className="mt-4 grid gap-2 text-sm">
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-white/90 transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2">
              {[Facebook, Instagram, Youtube, Twitter].map((Icon, index) => (
                <a
                  key={`footer-social-${index}`}
                  href="#"
                  aria-label="Social channel"
                  className="flex size-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 py-5 text-xs text-white/75 md:flex-row md:items-center md:justify-between">
          <p>© Copyright 2026, Redflow. All rights reserved.</p>
          <p>Built for donor-first community response.</p>
        </div>
      </div>

      <p
        className="pointer-events-none select-none whitespace-nowrap px-5 pb-4 font-display text-[clamp(62px,11vw,196px)] leading-[0.86] text-[#a8bcf8] md:px-8 lg:px-10"
        aria-hidden
      >
        Creates Change
      </p>
    </footer>
  );
};

export default PublicFooter;
