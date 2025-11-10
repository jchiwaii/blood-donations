import { currentUser } from "@/server-actions/users";
import { redirect, notFound } from "next/navigation";
import CreateRequestForm from "../../_components/create-request-form";
import { getAllBloodRequests } from "@/server-actions/blood-reqests";

export default async function EditBloodRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  if (user.role !== "recipient") {
    redirect("/");
  }

  const { id } = await params;
  const requestId = parseInt(id);

  if (isNaN(requestId)) {
    notFound();
  }

  // Fetch the specific blood request
  const response = await getAllBloodRequests(user.id);

  if (!response.success || !response.data) {
    notFound();
  }

  const bloodRequest = response.data.find((req) => req.id === requestId);

  if (!bloodRequest) {
    notFound();
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Edit Blood Request
          </h1>
          <p className="text-muted-foreground">
            Update your blood donation request details
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <CreateRequestForm editData={bloodRequest} />
        </div>
      </div>
    </div>
  );
}
