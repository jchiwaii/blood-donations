import { currentUser } from "@/server-actions/users";
import { redirect } from "next/navigation";
import PageTitle from "@/components/ui/page-title";
import CreateDonationOfferForm from "../_components/create-donation-offer-form";

async function CreateDonationOffer() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  if (user.role !== "donor") {
    redirect("/");
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-4 pb-16 sm:px-6 lg:px-8">
      <PageTitle title="Create Donation Offer" />
      <p className="text-sm text-white/60">
        Offer your blood donation to help those in need. Your offer will be reviewed by admin.
      </p>

      <CreateDonationOfferForm userId={user.id} />
    </div>
  );
}

export default CreateDonationOffer;
