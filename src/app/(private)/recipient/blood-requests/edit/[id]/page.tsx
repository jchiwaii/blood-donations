import { notFound, redirect } from "next/navigation";

import { getAllBloodRequests } from "@/server-actions/blood-reqests";
import { currentUser } from "@/server-actions/users";
import CreateRequestForm from "../../_components/create-request-form";
import PageTitle from "@/components/ui/page-title";

export default async function EditBloodRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();

  if (!user || user.role !== "recipient") {
    redirect("/");
  }

  const { id } = await params;
  const requestId = parseInt(id, 10);

  if (Number.isNaN(requestId)) {
    notFound();
  }

  const response = await getAllBloodRequests(user.id);

  if (!response.success || !response.data) {
    notFound();
  }

  const bloodRequest = response.data.find((req) => req.id === requestId);

  if (!bloodRequest) {
    notFound();
  }

  if (bloodRequest.status === "approved") {
    redirect("/recipient/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 pb-16 sm:px-6 lg:px-8">
      <PageTitle
        eyebrow="Recipient"
        title="Edit Blood Request"
        subtitle="Update your request details before approval."
      />

      <CreateRequestForm editData={bloodRequest} />
    </div>
  );
}
