import { currentUser } from "@/server-actions/users";
import { redirect } from "next/navigation";
import { getAllBloodRequests } from "@/server-actions/blood-reqests";
import BloodRequestsList from "./_components/blood-requests-list";

async function RecipientDashboard() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  if (user.role !== "recipient") {
    redirect("/");
  }

  const response = await getAllBloodRequests(user.id);
  const requests = response.success && Array.isArray(response.data)
    ? response.data
    : [];

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(
    (request) => request.status === "pending"
  ).length;
  const activeRequests = requests.filter((request) =>
    ["approved", "in_progress"].includes(request.status)
  ).length;
  const fulfilledRequests = requests.filter(
    (request) => request.status === "fulfilled"
  ).length;
  const totalUnitsRequested = requests.reduce(
    (sum, request) => sum + (request.units_required || 0),
    0
  );
  const criticalRequests = requests.filter(
    (request) => request.urgency === "critical"
  ).length;

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-destructive/10 via-background to-background" />
      <div className="absolute -top-32 right-[-10%] -z-10 h-64 w-64 rounded-full bg-destructive/10 blur-3xl" />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 pb-16 pt-10 lg:px-8">
        <section className="overflow-hidden rounded-3xl border border-border/50 bg-card/80 shadow-2xl shadow-destructive/10 backdrop-blur">
          <div className="bg-linear-to-br from-destructive via-destructive/90 to-primary/80 px-8 py-10 text-white">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-white/70">
              Recipient Console
            </p>
            <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-semibold sm:text-4xl">
                  Welcome back, {user.name}
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-white/80">
                  Centralize every blood request, monitor approvals in real time, and
                  keep donors informed. Your dashboard gives you full visibility over
                  the lifesaving help you need.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center text-sm font-medium text-white">
                <div className="rounded-2xl bg-white/10 px-4 py-3 shadow-lg shadow-black/10">
                  <p className="text-xs uppercase tracking-wide text-white/60">
                    Active Requests
                  </p>
                  <p className="mt-1 text-2xl font-semibold">{activeRequests}</p>
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-3 shadow-lg shadow-black/10">
                  <p className="text-xs uppercase tracking-wide text-white/60">
                    Critical Alerts
                  </p>
                  <p className="mt-1 text-2xl font-semibold">{criticalRequests}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 bg-card/80 px-8 py-6 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide">
                Total requests
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {totalRequests}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                All requests submitted under your account.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide">
                Awaiting approval
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {pendingRequests}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Requests currently pending hospital review.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide">
                Fulfilled requests
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {fulfilledRequests}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Completed and successfully supplied cases.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide">
                Units requested
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {totalUnitsRequested}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Aggregate blood units required across all requests.
              </p>
            </div>
          </div>
        </section>

        <BloodRequestsList userId={user.id} initialRequests={requests} />
      </div>
    </div>
  );
}

export default RecipientDashboard;
