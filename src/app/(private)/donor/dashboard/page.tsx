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
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/10 via-background to-background" />
      <div className="absolute -top-40 left-[-15%] -z-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 pb-16 pt-10 lg:px-8">
        <section className="overflow-hidden rounded-3xl border border-border/50 bg-card/80 shadow-2xl shadow-primary/10 backdrop-blur">
          <div className="bg-linear-to-br from-primary via-primary/90 to-destructive/80 px-8 py-10 text-white">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-white/70">
              Donor Console
            </p>
            <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-semibold sm:text-4xl">
                  Grateful to have you back, {user.name}
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-white/80">
                  Review approved matches, respond instantly, and keep track of
                  the communities you support. Your availability turns requests
                  into recoveries.
                </p>
              </div>
              <div className="grid gap-4 text-center text-sm font-medium text-white sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 px-4 py-3 shadow-lg shadow-black/10">
                  <p className="text-xs uppercase tracking-wide text-white/60">
                    Active cases
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {totalOpportunities}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3 shadow-lg shadow-black/10">
                  <p className="text-xs uppercase tracking-wide text-white/60">
                    Critical priority
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {criticalOpportunities}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 bg-card/80 px-8 py-6 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide">
                Units requested
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {highDemandUnits}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Total demand across approved requests.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide">
                Blood groups needed
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {uniqueBloodGroups}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Unique blood types currently requested.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide">
                Critical cases
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {criticalOpportunities}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Needs immediate response within 24 hours.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide">
                Opportunities this week
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {totalOpportunities > 8 ? "8+" : totalOpportunities}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
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
