// src/app/(with-layout)/profile/edit/_components/ProfileForm.tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  updateUserProfileAction,
  ProfileFormState,
} from "@/features/profile/actions";
import { User, Domain } from "@prisma/client"; // Import Prisma types

// Helper SubmitButton component to show pending state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Profile"}
    </button>
  );
}

interface ProfileFormProps {
  user: Pick<
    User,
    | "id"
    | "name"
    | "email"
    | "image"
    | "domain"
    | "skills"
    | "learning"
    | "goals"
    | "availability"
  >;
  domains: Domain[]; // Pass the enum values
}

export function ProfileForm({ user, domains }: ProfileFormProps) {
  const initialState: ProfileFormState = { message: "", success: false };
  const [state, formAction] = useFormState(
    updateUserProfileAction,
    initialState
  );

  // Helper to find specific error messages from state.errors
  const getError = (fieldName: string): string | undefined => {
    return state.errors?.find((err) => err.path.includes(fieldName))?.message;
  };

  return (
    <form action={formAction}>
      <h2>Edit Your Profile</h2>
      <p>Help others connect with you by sharing your interests and goals.</p>

      {state.message && (
        <p style={{ color: state.success ? "green" : "red" }}>
          {state.message}
        </p>
      )}

      {/* Display basic info (read-only) */}
      <div>
        <label>Name:</label>
        <span>{user.name || "N/A"}</span>
      </div>
      <div>
        <label>Email:</label>
        <span>{user.email || "N/A"}</span>
      </div>

      {/* Domain */}
      <div>
        <label htmlFor="domain">Primary Domain:</label>
        <select
          id="domain"
          name="domain"
          defaultValue={user.domain ?? ""} // Handle null/undefined
        >
          <option value="">-- Select Domain --</option>
          {domains.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {getError("domain") && (
          <p style={{ color: "red" }}>{getError("domain")}</p>
        )}
      </div>

      {/* Skills */}
      <div>
        <label htmlFor="skills">Skills (comma-separated):</label>
        <textarea
          id="skills"
          name="skills"
          defaultValue={user.skills?.join(", ") ?? ""}
          placeholder="e.g., React, Node.js, Figma"
        />
        {getError("skills") && (
          <p style={{ color: "red" }}>{getError("skills")}</p>
        )}
      </div>

      {/* Learning */}
      <div>
        <label htmlFor="learning">Actively Learning (comma-separated):</label>
        <textarea
          id="learning"
          name="learning"
          defaultValue={user.learning?.join(", ") ?? ""}
          placeholder="e.g., TypeScript, AWS, UX Research"
        />
        {getError("learning") && (
          <p style={{ color: "red" }}>{getError("learning")}</p>
        )}
      </div>

      {/* Goals */}
      <div>
        <label htmlFor="goals">Goals (comma-separated):</label>
        <textarea
          id="goals"
          name="goals"
          defaultValue={user.goals?.join(", ") ?? ""}
          placeholder="e.g., Build SaaS, Find Co-Founder, Network"
        />
        {getError("goals") && (
          <p style={{ color: "red" }}>{getError("goals")}</p>
        )}
      </div>

      {/* Availability */}
      <div>
        <label htmlFor="availability">Availability (hours/week):</label>
        <input
          type="number"
          id="availability"
          name="availability"
          defaultValue={user.availability ?? ""} // Handle null/undefined
          min="0"
          max="168"
          placeholder="e.g., 5"
        />
        {getError("availability") && (
          <p style={{ color: "red" }}>{getError("availability")}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
