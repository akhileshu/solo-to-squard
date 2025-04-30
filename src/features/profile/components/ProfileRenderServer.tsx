import { AppCard } from "@/components/app/card";
import { renderStatusMessage } from "@/components/app/status-message/renderStatusMessage";
import {
  getProfiles,
  getLoggedInUserProfile,
} from "@/features/profile/actions/profileActions";
import { cn, formatDate } from "@/lib/utils";

// Render List of Profiles
export async function RenderProfiles({ className }: { className?: string }) {
  const profilesResult = await getProfiles();
  const cardTitle = "Profile List";

  const statusMessage = renderStatusMessage(profilesResult, cardTitle);
  if (statusMessage || !profilesResult.ok) return statusMessage;

  const { data } = profilesResult;

  return (
    <AppCard title={cardTitle} className={cn("", className)}>
      {data.map((item) => (
        <div key={item.id}>{/* Render your item here */}</div>
      ))}
    </AppCard>
  );
}

// Render Single Profile
export async function RenderProfile({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const profileResult = await getLoggedInUserProfile(id);
  const cardTitle = "Profile";

  const statusMessage = renderStatusMessage(profileResult, cardTitle);
  if (statusMessage || !profileResult.ok) return statusMessage;

  const { data } = profileResult;

  return (
    <AppCard title={cardTitle} className={cn("", className)}>
      <div key={data.id}>{/* Render your item here */}</div>
    </AppCard>
  );
}
