import { currentUser } from "@/server-actions/users";
import { redirect } from "next/navigation";
import { ProfileSummaryCard } from "@/components/profile/profile-summary-card";

export default async function DonorProfilePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  if (user.role !== "donor") {
    redirect("/");
  }

  return (
    <div className="p-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Profile</h2>
          <p className="text-muted-foreground">
            Review your account information and keep your details up to date.
          </p>
        </div>

        <ProfileSummaryCard user={user} />
      </div>
    </div>
  );
}
