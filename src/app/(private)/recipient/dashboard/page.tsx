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
  const requests =
    response.success && Array.isArray(response.data) ? response.data : [];

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
    <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10 lg:gap-12">
        <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 text-white shadow-[0_25px_80px_rgba(15,23,42,0.45)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(120% 180% at 0% -20%, rgba(244,114,182,0.5) 0%, rgba(79,70,229,0.35) 45%, rgba(15,23,42,0.9) 100%)",
          }}
        />

        <div className="relative z-10 flex flex-col gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Recipient console
            </span>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold sm:text-4xl">
                Welcome back, {user.name}
              </h1>
              <p className="max-w-2xl text-sm text-white/80">
                Centralise every blood request, monitor approvals in real time,
                and keep donors informed. Your dashboard gives you full
                visibility over the lifesaving help you need.
              </p>
            </div>
          </div>

          <div className="grid shrink-0 gap-4 text-sm font-medium sm:grid-cols-2">
            <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center">
              <p className="text-xs uppercase tracking-wide text-white/70">
                Active requests
              </p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {activeRequests}
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center">
              <p className="text-xs uppercase tracking-wide text-white/70">
                Critical alerts
              </p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {criticalRequests}
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid gap-4 border-t border-white/10 bg-slate-950/40 px-6 py-6 text-sm text-white/70 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
              Total requests
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {totalRequests}
            </p>
            <p className="mt-1 text-xs text-white/60">
              All requests submitted under your account.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
              Awaiting approval
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {pendingRequests}
            </p>
            <p className="mt-1 text-xs text-white/60">
              Requests currently pending hospital review.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
              Fulfilled requests
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {fulfilledRequests}
            </p>
            <p className="mt-1 text-xs text-white/60">
              Completed and successfully supplied cases.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
              Units requested
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {totalUnitsRequested}
            </p>
            <p className="mt-1 text-xs text-white/60">
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
