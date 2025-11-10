import { currentUser } from "@/server-actions/users";
import { redirect } from "next/navigation";
import { getApprovedBloodRequests } from "@/server-actions/blood-reqests";
import ApprovedBloodRequests from "./_components/approved-blood-requests";

async function DonorDashboard() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  if (user.role !== "donor") {
    redirect("/");
  }

  const response = await getApprovedBloodRequests();
  const requests =
    response.success && Array.isArray(response.data) ? response.data : [];

  const totalOpportunities = requests.length;
  const criticalOpportunities = requests.filter(
    (request) => request.urgency === "critical"
  ).length;
  const highDemandUnits = requests.reduce(
    (total, request) => total + (request.units_required || 0),
    0
  );
  const uniqueBloodGroups = new Set(
    requests.map((request) => request.blood_group)
  ).size;

  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16">
      <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 text-white shadow-[0_25px_80px_rgba(15,23,42,0.45)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(120% 180% at 100% -40%, rgba(59,130,246,0.45) 0%, rgba(244,114,182,0.35) 45%, rgba(15,23,42,0.9) 100%)",
          }}
        />

        <div className="relative z-10 flex flex-col gap-8 px-8 py-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Donor console
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold sm:text-4xl">
                Grateful to have you back, {user.name}
              </h1>
              <p className="max-w-2xl text-sm text-white/80">
                Review approved matches, respond instantly, and keep track of the communities you support. Your availability turns requests into recoveries.
              </p>
            </div>
          </div>

          <div className="grid shrink-0 gap-4 text-sm font-medium sm:grid-cols-2">
            <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center">
              <p className="text-xs uppercase tracking-wide text-white/70">Active cases</p>
              <p className="mt-1 text-2xl font-semibold text-white">{totalOpportunities}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center">
              <p className="text-xs uppercase tracking-wide text-white/70">Critical priority</p>
              <p className="mt-1 text-2xl font-semibold text-white">{criticalOpportunities}</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid gap-4 border-t border-white/10 bg-slate-950/40 px-8 py-6 text-sm text-white/70 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Units requested</p>
            <p className="mt-2 text-2xl font-semibold text-white">{highDemandUnits}</p>
            <p className="mt-1 text-xs text-white/60">Total demand across approved requests.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Blood groups needed</p>
            <p className="mt-2 text-2xl font-semibold text-white">{uniqueBloodGroups}</p>
            <p className="mt-1 text-xs text-white/60">Unique blood types currently requested.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Critical cases</p>
            <p className="mt-2 text-2xl font-semibold text-white">{criticalOpportunities}</p>
            <p className="mt-1 text-xs text-white/60">Needs immediate response within 24 hours.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Opportunities this week</p>
            <p className="mt-2 text-2xl font-semibold text-white">{totalOpportunities > 8 ? "8+" : totalOpportunities}</p>
            <p className="mt-1 text-xs text-white/60">Recently approved requests awaiting donors like you.</p>
          </div>
        </div>
      </section>

      <ApprovedBloodRequests initialRequests={requests} />
    </div>
  );
}

export default DonorDashboard;
