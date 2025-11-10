import CreateRequestForm from "./_components/create-request-form";
import { HeartPulse, ShieldPlus } from "lucide-react";

const RecipientBloodRequest = () => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 md:px-6 lg:gap-12">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 p-8 shadow-[0_10px_60px_rgba(15,23,42,0.4)] sm:p-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(120% 120% at 0% 0%, rgba(244,114,182,0.45) 0%, rgba(129,140,248,0.25) 45%, rgba(15,23,42,0.9) 100%)",
          }}
        />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/80">
              <ShieldPlus className="size-4" /> Secure Request Intake
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Create a life-saving blood request
              </h1>
              <p className="max-w-2xl text-sm text-white/80 sm:text-base">
                Share critical details so nearby donors can respond quickly. A
                complete request helps us surface volunteers with the right
                blood group and availability.
              </p>
            </div>
          </div>
          <div className="flex min-w-60 flex-col gap-3 rounded-2xl border border-white/15 bg-white/10 p-5 text-white/90 backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-full bg-white/15">
                <HeartPulse className="size-6" />
              </span>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-white/70">
                  Fast response
                </p>
                <p className="text-lg font-semibold text-white">
                  80% requests matched in 48h
                </p>
              </div>
            </div>
            <p className="text-xs text-white/70">
              Include the urgency and hospital details to prioritise your
              request in donor feeds.
            </p>
          </div>
        </div>
      </section>

      <CreateRequestForm />
    </div>
  );
};

export default RecipientBloodRequest;
