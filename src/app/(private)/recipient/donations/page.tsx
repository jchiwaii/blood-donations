import { currentUser } from "@/server-actions/users";
import { redirect } from "next/navigation";
import { getApprovedDonations } from "@/server-actions/blood-donations";
import ApprovedDonationsList from "./_components/approved-donations-list";
import PageTitle from "@/components/ui/page-title";

async function RecipientDonations() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  if (user.role !== "recipient") {
    redirect("/");
  }

  const response = await getApprovedDonations();
  const donations =
    response.success && Array.isArray(response.data) ? response.data : [];

  return (
    <div className="space-y-8">
      <PageTitle title="Available Donations" />
      <p className="text-sm text-white/60">
        Browse approved donation offers from donors
      </p>

      <ApprovedDonationsList initialDonations={donations} />
    </div>
  );
}

export default RecipientDonations;
