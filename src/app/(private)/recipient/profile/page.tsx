import { currentUser } from "@/server-actions/users";
import { redirect } from "next/navigation";
import { ProfileSummaryCard } from "@/components/profile/profile-summary-card";

export default async function RecipientProfilePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  if (user.role !== "recipient") {
    redirect("/");
  }

  return (
    <div className="px-6 pb-12 pt-8 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-[0_18px_90px_rgba(15,23,42,0.55)]">
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background:
                "radial-gradient(120% 120% at 15% -10%, rgba(251,191,36,0.35) 0%, rgba(244,114,182,0.3) 40%, rgba(67,56,202,0.65) 70%, rgba(15,23,42,0.95) 100%)",
            }}
          />
          <div className="relative z-10 space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
              Account
            </span>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Profile
              </h2>
              <p className="max-w-2xl text-sm text-white/75 sm:text-base">
                Review your account information and keep your details up to
                date.
              </p>
            </div>
          </div>
        </section>

        <ProfileSummaryCard
          user={user}
          className="border-white/10 bg-slate-950/60 backdrop-blur"
        />
      </div>
    </div>
  );
}
