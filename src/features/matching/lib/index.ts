import { Domain, User } from "@prisma/client";
/**
 * Generates a simple "You Might Click" label based on user data.
 * @param user The user profile.
 * @returns A descriptive string label.
 */
export function generateMatchLabel(user: User): string {
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
