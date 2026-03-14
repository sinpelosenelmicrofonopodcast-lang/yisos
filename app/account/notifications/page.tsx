import { requireUser, getUserProfile } from "@/lib/services/auth-service";
import { AccountNotificationsForm } from "@/components/account/account-notifications-form";

export default async function AccountNotificationsPage() {
  const user = await requireUser();
  const profile = await getUserProfile(user.id);

  return (
    <AccountNotificationsForm
      initialMarketingOptIn={profile?.marketing_opt_in ?? true}
      initialOrderUpdatesOptIn={profile?.order_updates_opt_in ?? true}
      initialPushOptIn={profile?.push_opt_in ?? false}
    />
  );
}
