import { redirect } from "next/navigation";

import { getAllBloodRequests } from "@/server-actions/blood-reqests";
import { currentUser } from "@/server-actions/users";
import PageTitle from "@/components/ui/page-title";
import BloodRequestsList from "./_components/blood-requests-list";

async function RecipientDashboard() {
  const user = await currentUser();

  if (!user || user.role !== "recipient") {
    redirect("/");
  }

  const response = await getAllBloodRequests(user.id);
  const requests = response.success && Array.isArray(response.data) ? response.data : [];

  const totalRequests = requests.length;
  const pendingRequests = requests.filter((request) => request.status === "pending").length;
  const activeRequests = requests.filter((request) => ["approved", "in_progress"].includes(request.status)).length;
  const fulfilledRequests = requests.filter((request) => request.status === "fulfilled").length;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-16 sm:px-6 lg:px-8">
      <PageTitle
        eyebrow="Recipient"
        title={`Welcome back, ${user.name}`}
        subtitle="Manage blood requests, review donations, and keep critical cases updated."
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Total requests
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{totalRequests}</p>
        </article>

        <article className="rounded-2xl border border-amber-300/70 bg-amber-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
            Pending review
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-amber-800">{pendingRequests}</p>
        </article>

        <article className="rounded-2xl border border-primary/20 bg-primary/10 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Active cases
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-primary">{activeRequests}</p>
        </article>

        <article className="rounded-2xl border border-emerald-300/70 bg-emerald-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Fulfilled
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-emerald-800">{fulfilledRequests}</p>
        </article>
      </section>

      <BloodRequestsList userId={user.id} initialRequests={requests} />
    </div>
  );
}

export default RecipientDashboard;
