"use client";

import AppImg from "@/components/app/AppImg";
import { AppCard } from "@/components/app/card";
import { renderStatusMessage } from "@/components/app/status-message/renderStatusMessage";
import {
  getProfileById
} from "@/features/profile/actions/profileActions";
import { cn } from "@/lib/utils";



type RenderProfileProps = {
  className?: string;
  profileResult: Awaited<ReturnType<typeof getProfileById>>;
};


// For Single Item
export function UserProfile({
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
        <div key={data.id} className="space-y-4 p-4">
          <div className="flex items-center space-x-4">
            <AppImg
              src={data.image ?? "/default-avatar.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold">
                {data.name ?? "Anonymous"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {data.email ?? "No email provided"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm">
              <span className="font-medium">Profile Setup:</span>{" "}
              {data.isProfileSetupDone ? "Completed" : "Not Completed"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Domain:</span>{" "}
              {data.domain ?? "Not specified"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Availability (hrs/week):</span>{" "}
              {data.availability ?? "Not available"}
            </p>
          </div>

          <div>
            <p className="font-semibold">Skills:</p>
            <ul className="list-disc list-inside text-sm">
              {data.skills.length > 0 ? (
                data.skills.map((skill, i) => <li key={i}>{skill}</li>)
              ) : (
                <li>No skills listed</li>
              )}
            </ul>
          </div>

          <div>
            <p className="font-semibold">Currently Learning:</p>
            <ul className="list-disc list-inside text-sm">
              {data.learning.length > 0 ? (
                data.learning.map((item, i) => <li key={i}>{item}</li>)
              ) : (
                <li>Nothing listed</li>
              )}
            </ul>
          </div>

          <div>
            <p className="font-semibold">Goals:</p>
            <ul className="list-disc list-inside text-sm">
              {data.goals.length > 0 ? (
                data.goals.map((goal, i) => <li key={i}>{goal}</li>)
              ) : (
                <li>No goals set</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </AppCard>
  );
}
