import { getApprovedBloodRequests } from "@/server-actions/blood-reqests";
import { currentUser } from "@/server-actions/users";
import { redirect } from "next/navigation";
import PageTitle from "@/components/ui/page-title";
import ApprovedBloodRequests from "../dashboard/_components/approved-blood-requests";

async function DonorBloodRequests() {
  const user = await currentUser();

  if (!user || user.role !== "donor") {
    redirect("/");
  }

  const response = await getApprovedBloodRequests();
  const requests =
    response.success && Array.isArray(response.data) ? response.data : [];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-16 sm:px-6 lg:px-8">
      <div>
        <PageTitle title="Blood Requests" />
        <p className="mt-2 text-sm text-white/60">
          Browse approved requests and offer your donation
        </p>
      </div>

      <ApprovedBloodRequests initialRequests={requests} />
    </div>
  );
}

export default DonorBloodRequests;
