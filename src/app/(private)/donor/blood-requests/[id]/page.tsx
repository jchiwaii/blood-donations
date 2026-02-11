import { redirect } from "next/navigation";

import { currentUser } from "@/server-actions/users";
import PageTitle from "@/components/ui/page-title";
import DonationOfferForm from "./_components/donation-offer-form";

async function getBloodRequestById(id: number) {
  const { db } = await import("@/config/db");

  const result = await db.query(
    `SELECT br.*, json_build_object('id', up.id, 'name', up.name, 'email', up.email) AS recipient
     FROM blood_requests br
     LEFT JOIN user_profiles up ON br.recipient_id = up.id
     WHERE br.id = $1 AND br.status = 'approved'`,
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

export default async function OfferDonationPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await currentUser();

  if (!user || user.role !== "donor") {
    redirect("/");
  }

  const request = await getBloodRequestById(parseInt(params.id));

  if (!request) {
    redirect("/donor/blood-requests");
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 pb-16 sm:px-6 lg:px-8">
      <PageTitle
        eyebrow="Donor"
        title="Submit Donation Offer"
        subtitle="Review the request details and send your offer to the recipient."
      />

      <DonationOfferForm request={request} donorId={user.id} />
    </div>
  );
}
