import { currentUser } from "@/server-actions/users";
import { redirect } from "next/navigation";
import { getBloodDonations } from "@/server-actions/blood-donations";
import DonorDonationsList from "./_components/donor-donations-list";
import PageTitle from "@/components/ui/page-title";

async function DonorDonations() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  if (user.role !== "donor") {
    redirect("/");
  }

  const response = await getBloodDonations(user.id);
  const donations =
    response.success && Array.isArray(response.data) ? response.data : [];

  return (
    <div className="space-y-8">
      <PageTitle title="My Donation Offers" />
      <p className="text-sm text-white/60">
        Create and manage your blood donation offers
      </p>

      <DonorDonationsList userId={user.id} initialDonations={donations} />
    </div>
  );
}

export default DonorDonations;
