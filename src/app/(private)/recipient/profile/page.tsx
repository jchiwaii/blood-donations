import { redirect } from "next/navigation";

import { currentUser } from "@/server-actions/users";
import { ProfileSummaryCard } from "@/components/profile/profile-summary-card";
import PageTitle from "@/components/ui/page-title";

export default async function RecipientProfilePage() {
  const user = await currentUser();

  if (!user || user.role !== "recipient") {
    redirect("/");
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 pb-16 sm:px-6 lg:px-8">
      <PageTitle
        eyebrow="Recipient"
        title="Profile"
        subtitle="Review your details and keep contact information up to date."
      />

      <ProfileSummaryCard user={user} />
    </div>
  );
}
