import { PrismaClient, User, Domain } from "@prisma/client";

const prisma = new PrismaClient(); // This will require the DB to be migrated and running

// Define the User type with the new fields for clarity, though Prisma generates types
// We'll use Prisma's generated types directly in the functions
type UserProfile = Pick<
  User,
  | "id"
  | "name"
  | "domain"
  | "skills"
  | "learning"
  | "goals"
  | "availability"
  | "image" // Include image for potential UI display
>;

/**
 * Finds potential matches for a given user.
 *
 * Basic logic:
 * - Exclude the user themselves.
 * - Prioritize users with complementary skills (e.g., user knows FE, match knows BE).
 * - Consider users with similar goals.
 * - Consider users with similar availability.
 * - Bonus: Consider users learning skills the current user possesses.
 *
 * @param userId The ID of the user to find matches for.
 * @param limit The maximum number of matches to return.
 * @returns A promise resolving to an array of potential user matches.
 */
export async function findPotentialMatches(
  userId: string,
  limit: number = 5
): Promise<UserProfile[]> {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        domain: true,
        skills: true,
        learning: true,
        goals: true,
        availability: true,
        image: true,
      },
    });

    if (!currentUser) {
      console.error("Current user not found for matching.");
      return [];
    }

    // Fetch all other users (excluding the current user)
    // In a real application, you'd add pagination and more filtering here.
    const otherUsers = await prisma.user.findMany({
      where: {
        id: { not: userId },
        // Maybe add filters like: domain is not null, availability is not null etc.
      },
      select: {
        id: true,
        name: true,
        domain: true,
        skills: true,
        learning: true,
        goals: true,
        availability: true,
        image: true,
      },
    });

    // --- Basic Matching Algorithm ---
    const potentialMatches = otherUsers
      .map((potentialMatch) => {
        let score = 0;

        // 1. Domain Complementarity (Simple Example)
        if (currentUser.domain && potentialMatch.domain) {
          if (
            (currentUser.domain === Domain.FRONTEND &&
              potentialMatch.domain === Domain.BACKEND) ||
            (currentUser.domain === Domain.BACKEND &&
              potentialMatch.domain === Domain.FRONTEND) ||
            (currentUser.domain === Domain.DESIGNING &&
              (potentialMatch.domain === Domain.FRONTEND ||
                potentialMatch.domain === Domain.BACKEND))
            // Add more complementary pairs as needed
          ) {
            score += 3; // Higher score for complementary domains
          } else if (currentUser.domain === potentialMatch.domain) {
            score += 1; // Smaller score for same domain (might still be useful)
          }
        }

        // 2. Skill Complementarity / Learning synergy
        const userSkills = new Set(currentUser.skills);
        const matchLearns = new Set(potentialMatch.learning);
        const matchSkills = new Set(potentialMatch.skills);
        const userLearns = new Set(currentUser.learning);

        // Score if match learns what user knows
        for (const skill of matchLearns) {
          if (userSkills.has(skill)) {
            score += 2;
          }
        }
        // Score if user learns what match knows
        for (const skill of userLearns) {
          if (matchSkills.has(skill)) {
            score += 2;
          }
        }
        // Bonus for distinct skill sets (less overlap - very basic check)
        const allSkills = new Set([...userSkills, ...matchSkills]);
        if (
          allSkills.size > userSkills.size &&
          allSkills.size > matchSkills.size
        ) {
          score += 1;
        }

        // 3. Goal Similarity
        const commonGoals = currentUser.goals.filter((goal) =>
          potentialMatch.goals.includes(goal)
        );
        score += commonGoals.length * 1.5; // Score based on number of shared goals

        // 4. Availability Similarity (Allow some difference)
        if (currentUser.availability && potentialMatch.availability) {
          const diff = Math.abs(
            currentUser.availability - potentialMatch.availability
          );
          if (diff <= 2) score += 2; // Very similar availability
          else if (diff <= 5) score += 1; // Moderately similar
        } else if (currentUser.availability || potentialMatch.availability) {
          score += 0.5; // One has specified availability, the other hasn't - small score boost
        }

        return { user: potentialMatch, score };
      })
      // Filter out users with zero score (or low score threshold)
      .filter((match) => match.score > 1)
      // Sort by score descending
      .sort((a, b) => b.score - a.score)
      // Take the top N matches
      .slice(0, limit)
      // Return only the user profile
      .map((match) => match.user);

    return potentialMatches;
  } catch (error) {
    console.error("Error finding potential matches:", error);
    // In a real app, you might want to throw the error or handle it differently
    return [];
  } finally {
    // It's important to disconnect the Prisma client when done in scripts,
    // but in a long-running app, you typically initialize it once.
    // await prisma.$disconnect(); // Commented out for typical app usage
  }
}

/**
 * Generates a simple "You Might Click" label based on user data.
 * @param user The user profile.
 * @returns A descriptive string label.
 */
export function generateMatchLabel(user: UserProfile): string {
  if (user.goals.some((g) => g.toLowerCase().includes("saas")))
    return `Wants to build a SaaS`;
  if (user.goals.some((g) => g.toLowerCase().includes("co-founder")))
    return `Seeking a Co-Founder`;
  if (user.domain === Domain.DESIGNING) return `UX/UI Designer`;
  if (
    user.skills.includes("AI") ||
    user.skills.includes("Machine Learning") ||
    user.learning.includes("AI")
  )
    return `Interested in AI tools`;
  if (user.availability && user.availability <= 5)
    return `Weekend hacker (${user.availability} hrs/week)`;
  if (user.domain === Domain.FRONTEND) return `Frontend Developer`;
  if (user.domain === Domain.BACKEND) return `Backend Developer`;
  if (user.learning.length > 0) return `Actively learning ${user.learning[0]}`;
  if (user.skills.length > 0) return `Skilled in ${user.skills[0]}`;
  return `Exploring collaborations`; // Generic fallback
}

// Example Usage (demonstrates how you might call it - requires async context)
/*
async function main() {
  const userIdToMatch = 'USER_ID_HERE'; // Replace with an actual user ID from your DB
  if (!userIdToMatch) {
    console.log("Please replace 'USER_ID_HERE' with an actual user ID.");
    return;
  }
  const matches = await findPotentialMatches(userIdToMatch);
  console.log(`Matches found for user ${userIdToMatch}:`);
  matches.forEach(match => {
      console.log(`- ${match.name} (${match.domain || 'N/A'}): ${generateMatchLabel(match)}`);
  });
}

main().catch(console.error);
*/
