import { redirect } from "next/navigation";

import { currentUser } from "@/server-actions/users";
import PageTitle from "@/components/ui/page-title";
import CreateDonationOfferForm from "../_components/create-donation-offer-form";

async function CreateDonationOffer() {
  const user = await currentUser();

  if (!user || user.role !== "donor") {
    redirect("/");
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 pb-16 sm:px-6 lg:px-8">
      <PageTitle
        eyebrow="Donor"
        title="Create Donation Offer"
        subtitle="Share availability and contact details so recipients can coordinate quickly."
      />

      <CreateDonationOfferForm userId={user.id} />
    </div>
  );
}

export default CreateDonationOffer;
