import { redirect } from "next/navigation";

import { currentUser } from "@/server-actions/users";
import PageTitle from "@/components/ui/page-title";
import { ProfileSummaryCard } from "@/components/profile/profile-summary-card";

export default async function DonorProfilePage() {
  const user = await currentUser();

  if (!user || user.role !== "donor") {
    redirect("/");
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 pb-16 sm:px-6 lg:px-8">
      <PageTitle
        eyebrow="Donor"
        title="Profile"
        subtitle="Keep your account details updated for smoother donation coordination."
      />

      <ProfileSummaryCard user={user} />
    </div>
  );
}
