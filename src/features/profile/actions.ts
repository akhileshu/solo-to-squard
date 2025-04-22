// src/features/profile/actions.ts
"use server";

import { getServerUser } from "@/lib/auth/lib";
import { PrismaClient, User, Domain } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod"; // Using Zod for validation

const prisma = new PrismaClient();

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
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const user = await getServerUser()
  if (!user?.id) {
    return { success: false, message: "Not authenticated" };
  }

  const rawData = {
    domain: formData.get("domain") || undefined, // Handle empty select value
    skills: formData.get("skills") as string,
    learning: formData.get("learning") as string,
    goals: formData.get("goals") as string,
    availability: formData.get("availability") || undefined, // Handle empty number input
  };

  const validatedFields = ProfileSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.error(
      "Validation Errors:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      success: false,
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.issues,
    };
  }

  // Prepare data for Prisma update, ensuring optional fields are handled
  const dataToUpdate: Partial<
    Pick<User, "domain" | "skills" | "learning" | "goals" | "availability">
  > = {};
  if (validatedFields.data.domain)
    dataToUpdate.domain = validatedFields.data.domain;
  if (validatedFields.data.skills)
    dataToUpdate.skills = validatedFields.data.skills;
  if (validatedFields.data.learning)
    dataToUpdate.learning = validatedFields.data.learning;
  if (validatedFields.data.goals)
    dataToUpdate.goals = validatedFields.data.goals;
  // Check if availability is provided and is a valid number after coercion
  if (
    validatedFields.data.availability !== undefined &&
    !isNaN(validatedFields.data.availability)
  ) {
    dataToUpdate.availability = validatedFields.data.availability;
  } else {
    // Explicitly set to null if provided input was invalid or empty after coercion
    dataToUpdate.availability = null;
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: dataToUpdate,
    });

    revalidatePath("/profile/edit"); // Revalidate this page to show updated data
    revalidatePath("/dashboard"); // Revalidate dashboard if it shows profile info

    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return {
      success: false,
      message: "Database error: Failed to update profile.",
    };
  }
}
