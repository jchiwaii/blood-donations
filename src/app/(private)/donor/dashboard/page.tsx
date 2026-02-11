import { getApprovedBloodRequests } from "@/server-actions/blood-reqests";
import { currentUser } from "@/server-actions/users";
import { redirect } from "next/navigation";

import PageTitle from "@/components/ui/page-title";
import ApprovedBloodRequests from "./_components/approved-blood-requests";

async function DonorDashboard() {
  const user = await currentUser();

  if (!user || user.role !== "donor") {
    redirect("/");
  }

  const response = await getApprovedBloodRequests();
  const requests = response.success && Array.isArray(response.data) ? response.data : [];

  const totalOpportunities = requests.length;
  const criticalOpportunities = requests.filter((r) => r.urgency === "critical").length;
  const highDemandUnits = requests.reduce((total, request) => total + (request.units_required || 0), 0);
  const uniqueBloodGroups = new Set(requests.map((request) => request.blood_group)).size;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-16 sm:px-6 lg:px-8">
      <PageTitle
        eyebrow="Donor"
        title={`Welcome back, ${user.name}`}
        subtitle="Review approved requests and offer donations where your blood group is needed most."
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Approved requests
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {totalOpportunities}
          </p>
        </article>

        <article className="rounded-2xl border border-rose-300/70 bg-rose-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-700">
            Critical cases
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-rose-800">
            {criticalOpportunities}
          </p>
        </article>

        <article className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Units requested
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {highDemandUnits}
          </p>
        </article>

        <article className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Blood groups needed
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {uniqueBloodGroups}
          </p>
        </article>
      </section>

      <ApprovedBloodRequests initialRequests={requests} />
    </div>
  );
}

export default DonorDashboard;
