"use server";

import {
  FetchResponse,
  fetchError,
  fetchErrorNotLoggedIn,
  fetchSuccess,
  handleFetchAction
} from "@/lib/server-actions/handleAction";

import { getServerUser } from "@/lib/auth/lib";
import { myPrisma } from "@/lib/db/prisma";
import { getMessage } from "@/lib/message/lib/get-message";


import { Domain, User } from "@prisma/client";


export async function getPotentialMatchesForLoggedInUser(
  limit: number = 5
): Promise<FetchResponse<User[]>> {
  return handleFetchAction(async () => {
    const userSession = await getServerUser();
    if (!userSession) return fetchErrorNotLoggedIn;

    const currentUser = await myPrisma.user.findUnique({
      where: { id: userSession.id },
    });
    if (!currentUser) return fetchError(getMessage("profile", "NOT_FOUND"));

    const otherUsers = await myPrisma.user.findMany({
      where: {
        id: { not: currentUser.id },
        // Maybe add filters like: domain is not null, availability is not null etc.
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
    return fetchSuccess(potentialMatches);
  });
}



/*

export async function getMatchings(): Promise<FetchResponse<unknown>> {
  return handleFetchAction(async () => {
    const matchings = await myPrisma.user.findMany();
    return fetchSuccess(matchings);
  });
}

export async function getMatchingById(id: string): Promise<FetchResponse<unknown>> {
  return handleFetchAction(async () => {
    const matching = await myPrisma.user.findUnique({
      where: { id },
    });
    return fetchSuccess(matching);
  });
}

export async function createMatching(_: unknown, formData: FormData): Promise<MutateResponse<undefined, typeof matchingCreateSchema>> {
  return handleMutateAction(async () => {
    const user = await getServerUser();
    if (!user) return mutateErrorNotLoggedIn;

    const { data, fieldErrors } = parseFormData(formData, matchingCreateSchema);
    if (fieldErrors) return mutateError(getMessage("matching", "CREATE_ERROR"), fieldErrors);

    await myPrisma.user.create({ data: { ...data, userId: user.id } });
    return mutateSuccess(getMessage("matching", "CREATE_SUCCESS"));
  });
}

export async function updateMatching(_: unknown, formData: FormData): Promise<MutateResponse<undefined, typeof matchingUpdateSchema>>  {
  return handleMutateAction(async () => {
    const user = await getServerUser();
    if (!user) return mutateErrorNotLoggedIn;

    const { data, fieldErrors } = parseFormData(formData, matchingUpdateSchema);
    if (fieldErrors) return mutateError(getMessage("matching", "UPDATE_ERROR"), fieldErrors);

    await myPrisma.user.update({ where: { id: data.id, userId: user.id }, data });
    return mutateSuccess(getMessage("matching", "UPDATE_SUCCESS"));
  });
}

export async function deleteMatching(_: unknown, formData: FormData): Promise<MutateResponse<undefined, typeof matchingDeleteSchema>> {
  return handleMutateAction(async () => {
    const user = await getServerUser();
    if (!user) return mutateErrorNotLoggedIn;

    const { data, fieldErrors } = parseFormData(formData, matchingDeleteSchema);
    if (fieldErrors) return mutateError(getMessage("matching", "DELETE_ERROR"), fieldErrors);

    await myPrisma.user.delete({ where: { id: data.id, userId: user.id } });
    return mutateSuccess(getMessage("matching", "DELETE_SUCCESS"));
  });
}


*/