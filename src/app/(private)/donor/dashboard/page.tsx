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
    <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10 lg:gap-12">
        <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 text-foreground shadow-2xl backdrop-blur-md animate-slide-up">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 100% 0%, rgba(88, 28, 255, 0.15) 0%, rgba(15, 15, 25, 0) 50%)",
            }}
          />

          <div className="relative z-10 flex flex-col gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary shadow-glow">
                Donor console
              </span>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold sm:text-4xl font-heading">
                  Grateful to have you back, {user.name}
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
                  Review approved matches, respond instantly, and keep track of
                  the communities you support. Your availability turns requests
                  into recoveries.
                </p>
              </div>
            </div>

            <div className="grid shrink-0 gap-4 text-sm font-medium sm:grid-cols-2">
              <div className="rounded-2xl border border-border/50 bg-background/30 px-5 py-4 text-center backdrop-blur-sm">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Active cases
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground font-heading">
                  {totalOpportunities}
                </p>
              </div>
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-4 text-center backdrop-blur-sm">
                <p className="text-xs uppercase tracking-wide text-destructive">
                  Critical priority
                </p>
                <p className="mt-1 text-2xl font-bold text-destructive font-heading">
                  {criticalOpportunities}
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid gap-4 border-t border-border/40 bg-background/20 px-6 py-6 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border/30 bg-card/30 p-5 transition-all hover:bg-card/50">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Units requested
              </p>
              <p className="mt-2 text-2xl font-bold text-foreground font-heading">
                {highDemandUnits}
              </p>
              <p className="mt-1 text-xs text-muted-foreground/80">
                Total demand across approved requests.
              </p>
            </div>
            <div className="rounded-2xl border border-border/30 bg-card/30 p-5 transition-all hover:bg-card/50">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Blood groups needed
              </p>
              <p className="mt-2 text-2xl font-bold text-foreground font-heading">
                {uniqueBloodGroups}
              </p>
              <p className="mt-1 text-xs text-muted-foreground/80">
                Unique blood types currently requested.
              </p>
            </div>
            <div className="rounded-2xl border border-border/30 bg-card/30 p-5 transition-all hover:bg-card/50">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Critical cases
              </p>
              <p className="mt-2 text-2xl font-bold text-foreground font-heading">
                {criticalOpportunities}
              </p>
              <p className="mt-1 text-xs text-muted-foreground/80">
                Needs immediate response within 24 hours.
              </p>
            </div>
            <div className="rounded-2xl border border-border/30 bg-card/30 p-5 transition-all hover:bg-card/50">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Opportunities this week
              </p>
              <p className="mt-2 text-2xl font-bold text-foreground font-heading">
                {totalOpportunities > 8 ? "8+" : totalOpportunities}
              </p>
              <p className="mt-1 text-xs text-muted-foreground/80">
                Recently approved requests awaiting donors like you.
              </p>
            </div>
          </div>
        </section>

        <ApprovedBloodRequests initialRequests={requests} />
      </div>
    </div>
  );
}

export default DonorDashboard;
