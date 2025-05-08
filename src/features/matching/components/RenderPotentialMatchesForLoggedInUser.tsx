import { AppCard } from "@/components/app/card";
import { renderStatusMessage } from "@/components/app/status-message/renderStatusMessage";
import { SendConnectRequestButton } from "@/features/connection/components/SendConnectRequestButton";
import { getPotentialMatchesForLoggedInUser } from "@/features/matching/actions/matchingActions";
import { getServerUser } from "@/lib/auth/lib";
import { cn } from "@/lib/utils";
import Image from "next/image";
// import { generateMatchLabel } from "../lib";

import { UpdateRequestStatusButton } from "@/features/connection/components/updateRequestStatusButton";
import Link from "next/link";

export async function RenderPotentialMatchesForLoggedInUser({
  className,
}: {
  className?: string;
}) {
  const user = await getServerUser();
  const potentialMatches = await getPotentialMatchesForLoggedInUser();
  const cardTitle = "Recommended Matches - You Might Click";

  // Early return for loading/error states
  const statusMessage = renderStatusMessage(potentialMatches, cardTitle);
  if (statusMessage || !potentialMatches.ok) return statusMessage;

  const { data: matches } = potentialMatches;

  return (
    <AppCard title={cardTitle} className={cn("", className)}>
      <div className="flex gap-4 flex-wrap">
        {matches.map((match) => {
          const connectionStatus = getConnectionStatus(user?.id, match);

          return (
            <MatchCard
              key={match.id}
              match={match}
              connectionStatus={connectionStatus}
              userId={user?.id}
            />
          );
        })}
      </div>
    </AppCard>
  );
}

// Helper function to determine connection status
function getConnectionStatus(
  userId: string | undefined,
  match: PotentialMatch
) {
  if (!userId) return { type: "none" as const };

  const sentRequest = match.receivedConnections.find(
    (sc) => sc.senderId === userId
  );

  const receivedRequest = match.sentConnections.find(
    (rc) => rc.receiverId === userId
  );

  if (sentRequest) {
    return {
      type: "sent" as const,
      request: sentRequest,
      status: sentRequest.status,
      id: sentRequest.id,
    };
  }

  if (receivedRequest) {
    return {
      type: "received" as const,
      request: receivedRequest,
      status: receivedRequest.status,
      id: receivedRequest.id,
    };
  }

  return { type: "none" as const };
}

// Sub-component for individual match cards
function MatchCard({
  match,
  connectionStatus,
  userId,
}: {
  match: PotentialMatch;
  connectionStatus: ReturnType<typeof getConnectionStatus>;
  userId?: string;
}) {
  const statusMessages = {
    none: "Not connected",
    sent: {
      PENDING: "Request sent - pending approval",
      ACCEPTED: "Connected!",
      REJECTED: "Request was declined",
      CANCELLED: "You cancelled this request",
    },
    received: {
      PENDING: "Request received - pending your approval",
      ACCEPTED: "Connected!",
      REJECTED: "You declined this request",
      CANCELLED: "Sender cancelled this request",
    },
  };

  const statusMessage =
    connectionStatus.type === "none"
      ? statusMessages.none
      : statusMessages[connectionStatus.type][connectionStatus.status];

  return (
    <article className="w-xs border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="relative aspect-square mb-3">
        <Image
          src={match.image ?? "/default-avatar.png"}
          alt={match.name ?? "User profile"}
          width={500}
          height={280}
          className="w-full object-cover h-52 rounded-md"
        />
      </div>

      <h3 className="font-semibold text-lg">{match.name}</h3>
      {match.domain && <p className="text-sm text-gray-600">{match.domain}</p>}

      {match.skills.length > 0 && (
        <div className="mt-2">
          <span className="text-sm font-medium">Skills: </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {match.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs bg-gray-100 px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      {match.goals.length > 0 && (
        <div className="mt-2">
          <span className="text-sm font-medium">goals: </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {match.goals.map((goal) => (
              <span
                key={goal}
                className="text-xs bg-gray-100 px-2 py-1 rounded"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t">
        <p
          className={`text-sm ${
            connectionStatus.status === "ACCEPTED"
              ? "text-green-600"
              : connectionStatus.status === "REJECTED" ||
                connectionStatus.status === "CANCELLED"
              ? "text-red-600"
              : "text-blue-600"
          }`}
        >
          {statusMessage}
        </p>

        <div className="mt-3">
          {connectionStatus.type === "none" ? (
            <SendConnectRequestButton
              receiverId={match.id}
              className="w-full"
            />
          ) : connectionStatus.type === "received" &&
            connectionStatus.status === "PENDING" ? (
            <UpdateRequestStatusButton
              connectionId={connectionStatus.request.id}
            />
          ) : connectionStatus.status === "ACCEPTED" ? (
            <Link href={`/profile/${userId}`}> View Profile</Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
