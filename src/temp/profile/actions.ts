// src/features/profile/actions.ts
"use server";

import { getServerUser } from "@/lib/auth/lib";
import {
  handleMutateAction,
  mutateError,
  mutateErrorNotLoggedIn,
  MutateResponse,
  mutateSuccess,
  parseFormData,
} from "@/lib/server-actions/handleAction";
import { User, Domain } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod"; // Using Zod for validation
import { getMessage } from "../../lib/message/lib/get-message";
import { myPrisma } from "@/lib/db/prisma";

// Define a schema for validation
const ProfileSchema = z.object({
  domain: z.nativeEnum(Domain).optional(), // Optional because user might not select one
  // For arrays stored as strings (e.g., comma-separated), refine validation as needed
  skills: z
    .string()
    .optional()
    .transform(
      (val) =>
        val
          ?.split(",")
          .map((s) => s.trim())
          .filter(Boolean) ?? []
    ),
  learning: z
    .string()
    .optional()
    .transform(
      (val) =>
        val
          ?.split(",")
          .map((s) => s.trim())
          .filter(Boolean) ?? []
    ),
  goals: z
    .string()
    .optional()
    .transform(
      (val) =>
        val
          ?.split(",")
          .map((s) => s.trim())
          .filter(Boolean) ?? []
    ),
  availability: z.coerce.number().int().min(0).max(168).optional(), // Coerce string from form to number, optional
});

export type ProfileFormState = {
  message: string;
  success: boolean;
  errors?: z.ZodIssue[];
};

export async function updateUserProfileAction(
  _: unknown,
  formData: FormData
): Promise<MutateResponse<undefined, typeof ProfileSchema>> {
  return handleMutateAction(async () => {
    const user = await getServerUser();
    if (!user) return mutateErrorNotLoggedIn;

    const { data, fieldErrors } = parseFormData(formData, ProfileSchema);
    if (fieldErrors)
      return mutateError(getMessage("post", "UPDATE_ERROR"), fieldErrors);

    // Prepare data for Prisma update, ensuring optional fields are handled
    const dataToUpdate: Partial<
      Pick<User, "domain" | "skills" | "learning" | "goals" | "availability">
    > = {};
    if (data.domain) dataToUpdate.domain = data.domain;
    if (data.skills) dataToUpdate.skills = data.skills;
    if (data.learning) dataToUpdate.learning = data.learning;
    if (data.goals) dataToUpdate.goals = data.goals;
    // Check if availability is provided and is a valid number after coercion
    if (data.availability !== undefined && !isNaN(data.availability)) {
      dataToUpdate.availability = data.availability;
    } else {
      // Explicitly set to null if provided input was invalid or empty after coercion
      dataToUpdate.availability = null;
    }

    await myPrisma.user.update({
      where: { id: user.id },
      data: dataToUpdate,
    });

    revalidatePath("/profile/edit"); // Revalidate this page to show updated data
    revalidatePath("/dashboard"); // Revalidate dashboard if it shows profile info

    return mutateSuccess(getMessage("post", "UPDATE_SUCCESS"));
  });
}
