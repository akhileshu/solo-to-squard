"use client";

import { AppCard } from "@/components/app/card";
import { renderStatusMessage } from "@/components/app/status-message/renderStatusMessage";
import { getLoggedInUserProfile } from "@/features/profile/actions/profileActions";
import { cn } from "@/lib/utils";
import { Domain } from "@prisma/client";
import { useState } from "react";

// type ViewOrEditProfilesProps = {
//   className?: string;
//   profilesResult: Awaited<ReturnType<typeof getProfiles>>;
// };

// // For List
// export function ViewOrEditProfiles({
//   profilesResult,
//   className,
// }: ViewOrEditProfilesProps) {
//   const cardTitle = "Profile List";

//   const statusMessage = renderStatusMessage(profilesResult, cardTitle);
//   if (statusMessage || !profilesResult.ok) return statusMessage;

//   const { data } = profilesResult;

//   return (
//     <AppCard title={cardTitle} className={cn("", className)}>
//       <div className="divide-y">
//         {data.map((item) => (
//           <div key={item.id} className="">
//             {/* Render your item here */}
//           </div>
//         ))}
//       </div>
//     </AppCard>
//   );
// }

type ViewOrEditProfileProps = {
  className?: string;
  profileResult: Awaited<ReturnType<typeof getLoggedInUserProfile>>;
};

// For Single Item
export function ViewOrEditProfile({
  profileResult,
  className,
}: ViewOrEditProfileProps) {
  const [editing, setEditing] = useState(false);
  const cardTitle = "Profile";

  const statusMessage = renderStatusMessage(profileResult, cardTitle);
  if (statusMessage || !profileResult.ok) return statusMessage;

  const { data } = profileResult;

  

  return (
    <AppCard title={cardTitle} className={cn("", className)}>
      {editing ? <></> : <ProfileVeiw {...data} />}
    </AppCard>
  );
}

function ProfileVeiw(data: {
  name: string | null;
  id: string;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  isProfileSetupDone: boolean;
  domain: Domain | null;
  skills: string[];
  learning: string[];
  goals: string[];
  availability: number | null;
}) {
  return (
    <div className="space-y-2 text-sm text-gray-800">
      <p>
        <span className="font-semibold">Name:</span>{" "}
        {data.name ?? "Not provided"}
      </p>
      <p>
        <span className="font-semibold">Email:</span>{" "}
        {data.email ?? "Not provided"}
      </p>
      <p>
        <span className="font-semibold">Domain:</span>{" "}
        {data.domain ?? "Not specified"}
      </p>
      <p>
        <span className="font-semibold">Availability:</span>{" "}
        {data.availability ?? "N/A"} hrs/week
      </p>

      <div>
        <p className="font-semibold">Skills:</p>
        <ul className="list-disc list-inside text-gray-700">
          {data.skills.length ? (
            data.skills.map((s, i) => <li key={i}>{s}</li>)
          ) : (
            <li>No skills added</li>
          )}
        </ul>
      </div>

      <div>
        <p className="font-semibold">Learning:</p>
        <ul className="list-disc list-inside text-gray-700">
          {data.learning.length ? (
            data.learning.map((l, i) => <li key={i}>{l}</li>)
          ) : (
            <li>No items</li>
          )}
        </ul>
      </div>

      <div>
        <p className="font-semibold">Goals:</p>
        <ul className="list-disc list-inside text-gray-700">
          {data.goals.length ? (
            data.goals.map((g, i) => <li key={i}>{g}</li>)
          ) : (
            <li>No goals set</li>
          )}
        </ul>
      </div>
    </div>
  );
}
