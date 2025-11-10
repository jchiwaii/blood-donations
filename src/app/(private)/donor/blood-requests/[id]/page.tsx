import { redirect } from "next/navigation";
import { currentUser } from "@/server-actions/users";
import PageTitle from "@/components/ui/page-title";
import DonationOfferForm from "./_components/donation-offer-form";

async function getBloodRequestById(id: number) {
  const supabase = (await import("@/config/supabase-config")).default;
  
  const { data, error } = await supabase
    .from("blood_requests")
    .select("*, recipient:user_profiles!blood_requests_recipient_id_fkey(id, name, email)")
    .eq("id", id)
    .eq("status", "approved")
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export default async function OfferDonationPage({ params }: { params: { id: string } }) {
  const user = await currentUser();

  if (!user || user.role !== "donor") {
    redirect("/");
  }

  const request = await getBloodRequestById(parseInt(params.id));

  if (!request) {
    redirect("/donor/blood-requests");
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 pb-16 sm:px-6 lg:px-8">
      <div>
        <PageTitle title="Offer Donation" />
        <p className="mt-2 text-sm text-white/60">
          Review the request details and submit your donation offer
        </p>
      </div>

      <DonationOfferForm request={request} donorId={user.id} />
    </div>
  );
}
