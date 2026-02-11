import { redirect } from "next/navigation";

import { getBloodDonations } from "@/server-actions/blood-donations";
import { currentUser } from "@/server-actions/users";
import PageTitle from "@/components/ui/page-title";
import DonorDonationsList from "./_components/donor-donations-list";

async function DonorDonations() {
  const user = await currentUser();

  if (!user || user.role !== "donor") {
    redirect("/");
  }

  const response = await getBloodDonations(user.id);
  const donations = response.success && Array.isArray(response.data) ? response.data : [];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-16 sm:px-6 lg:px-8">
      <PageTitle
        eyebrow="Donor"
        title="My Donation Offers"
        subtitle="Create offers and monitor approval status from one place."
      />

      <DonorDonationsList userId={user.id} initialDonations={donations} />
    </div>
  );
}

export default DonorDonations;
