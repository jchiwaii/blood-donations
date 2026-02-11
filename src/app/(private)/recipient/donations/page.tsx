import { redirect } from "next/navigation";

import { getApprovedDonations } from "@/server-actions/blood-donations";
import { currentUser } from "@/server-actions/users";
import PageTitle from "@/components/ui/page-title";
import ApprovedDonationsList from "./_components/approved-donations-list";

async function RecipientDonations() {
  const user = await currentUser();

  if (!user || user.role !== "recipient") {
    redirect("/");
  }

  const response = await getApprovedDonations();
  const donations = response.success && Array.isArray(response.data) ? response.data : [];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-16 sm:px-6 lg:px-8">
      <PageTitle
        eyebrow="Recipient"
        title="Available Donations"
        subtitle="Browse approved donor offers and connect quickly for your active needs."
      />

      <ApprovedDonationsList initialDonations={donations} />
    </div>
  );
}

export default RecipientDonations;
