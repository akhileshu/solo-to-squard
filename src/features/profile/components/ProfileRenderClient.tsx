"use client";

import { AppCard } from "@/components/app/card";
import { renderStatusMessage } from "@/components/app/status-message/renderStatusMessage";
import {
  getProfiles,
  getLoggedInUserProfile,
} from "@/features/profile/actions/profileActions";
import { cn } from "@/lib/utils";

type RenderProfilesProps = {
  className?: string;
  profilesResult: Awaited<ReturnType<typeof getProfiles>>;
};

type RenderProfileProps = {
  className?: string;
  profileResult: Awaited<ReturnType<typeof getLoggedInUserProfile>>;
};

// For List
export function RenderProfiles({
  profilesResult,
  className,
}: RenderProfilesProps) {
  const cardTitle = "Profile List";

  const statusMessage = renderStatusMessage(profilesResult, cardTitle);
  if (statusMessage || !profilesResult.ok) return statusMessage;

  const { data } = profilesResult;

  return (
    <AppCard title={cardTitle} className={cn("", className)}>
      <div className="divide-y">
        {data.map((item) => (
          <div key={item.id} className="">
            {/* Render your item here */}
          </div>
        ))}
      </div>
    </AppCard>
  );
}

// For Single Item
export function RenderProfile({
  profileResult,
  className,
}: RenderProfileProps) {
  const cardTitle = "Profile";

  const statusMessage = renderStatusMessage(profileResult, cardTitle);
  if (statusMessage || !profileResult.ok) return statusMessage;

  const { data } = profileResult;

  return (
    <AppCard title={cardTitle} className={cn("", className)}>
      <div className="divide-y">
        <div key={data.id} className="">
          {/* Render your item here */}
        </div>
      </div>
    </AppCard>
  );
}
