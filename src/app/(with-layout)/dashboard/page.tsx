import { findPotentialMatches, generateMatchLabel } from "@/lib/matching";

import { ConnectButton } from "@/features/connections/ConnectButton";
import { getServerUser } from "@/lib/auth/lib";

export default async function DashboardPage() {
  const user = await getServerUser()

  if (!user) {
    return <div>Please log in.</div>;
  }

  const potentialMatches = await findPotentialMatches(user.id, 5); // Get top 5 matches

  return (
    <div>
      <h2>You Might Click</h2>
      {potentialMatches.length === 0 ? (
        <p>No potential matches found yet. Complete your profile?</p>
      ) : (
        <ul>
          {potentialMatches.map((match) => (
            <li key={match.id}>
              {/* Display match info */}
              <img
                src={match.image ?? "/default-avatar.png"}
                alt={match.name ?? "User"}
              />
              <h3>{match.name}</h3>
              <p>{match.domain}</p>
              <p>Skills: {match.skills.join(", ")}</p>
              <p>Label: {generateMatchLabel(match)}</p>

              {/* Connect Button - Passes receiverId to a Client Component */}
              <ConnectButton receiverId={match.id} />
            </li>
          ))}
        </ul>
      )}
      {/* ... other dashboard content */}
    </div>
  );
}
