"use client";

import { AppCard } from "@/components/app/card";
import { renderStatusMessage } from "@/components/app/status-message/renderStatusMessage";
import {
  getLoggedInUserProfile,
  updateProfile,
} from "@/features/profile/actions/profileActions";
import { allGoals, allSkills, domains } from "@/lib/data/profile";
import { Button } from "@/lib/forms-inputs/button";
import AppForm from "@/lib/forms-inputs/form";
import { Input } from "@/lib/forms-inputs/Input";
import { MultiSelect } from "@/lib/forms-inputs/MultiSelect";
import { Select } from "@/lib/forms-inputs/Select";
import { useHandleFormState } from "@/lib/forms-inputs/useHandleFormState";
import { useEditToggle } from "@/lib/forms-inputs/utils";
import { initialState } from "@/lib/server-actions/handleAction";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { useActionState, useEffect } from "react";



type ViewOrEditProfileProps = {
  className?: string;
  profileResult: Awaited<ReturnType<typeof getLoggedInUserProfile>>;
};

// For Single Item
export function ViewOrEditProfile({
  profileResult,
  className,
}: ViewOrEditProfileProps) {
  const cardTitle = "Profile";
  const { editing, startEditing, cancelEditing } = useEditToggle();

  const statusMessage = renderStatusMessage(profileResult, cardTitle);
  if (statusMessage || !profileResult.ok) return statusMessage;

  const { data } = profileResult;

  return (
    <AppCard title={cardTitle} className={cn("space-y-2", className)}>
      {!editing ? (
        <Button disabled={editing} onClick={startEditing}>
          Edit Profile
        </Button>
      ) : null}

      {editing ? (
        <EditProfileForm onCancel={cancelEditing} profile={data} />
      ) : (
        <ViewProfile profile={data} />
      )}
    </AppCard>
  );
}

function EditProfileForm({
  profile,
  onCancel,
}: {
  profile: User;
  onCancel: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    initialState
  );
  const { fieldErrors } = state ?? {};

  useHandleFormState({
    state,
    revalidatePath: "/profile/view",
  });

  useEffect(() => {
    if (state.ok) {
      onCancel();
    }
  }, [onCancel, state.ok]);

  return (
    <AppForm
      className="space-y-4 max-w-md"
      action={formAction}
      variant="default"
      submitVariant="default"
      submitProps={{
        isPending,
        buttonState: { disabled: isPending },
        label: "Update Profile",
      }}
    >
      <Select
        label="Domain"
        name="domain"
        options={domains.map((d) => ({ label: d, value: d }))}
        fieldError={fieldErrors?.domain}
        value={profile.domain as string}
      />

      <MultiSelect
        label="Skills"
        name="skills"
        options={allSkills.map((skill) => ({ label: skill, value: skill }))}
        fieldError={fieldErrors?.skills}
        value={profile.skills}
      />

      <MultiSelect
        label="Learning Goals"
        name="learning"
        options={allSkills.map((skill) => ({ label: skill, value: skill }))}
        fieldError={fieldErrors?.learning}
        value={profile.learning}
      />

      <MultiSelect
        label="Your Goals"
        name="goals"
        options={allGoals.map((goal) => ({ label: goal, value: goal }))}
        fieldError={fieldErrors?.goals}
        value={profile.goals}
      />

      <Input
        label="Availability (hours/week)"
        name="availability"
        type="number"
        min={1}
        max={168}
        fullWidth
        fieldError={fieldErrors?.availability}
        defaultValue={profile.availability as number}
      />
      <Button
        className="mr-2 text-red-600"
        disabled={isPending}
        onClick={onCancel}
      >
        Cancel
      </Button>
    </AppForm>
  );
}

function ViewProfile({ profile }: { profile: User }) {
  return (
    <div className="space-y-2 text-sm text-gray-800">
      <p>
        <span className="font-semibold">Name:</span>{" "}
        {profile.name ?? "Not provided"}
      </p>
      <p>
        <span className="font-semibold">Email:</span>{" "}
        {profile.email ?? "Not provided"}
      </p>
      <p>
        <span className="font-semibold">Domain:</span>{" "}
        {profile.domain ?? "Not specified"}
      </p>
      <p>
        <span className="font-semibold">Availability:</span>{" "}
        {profile.availability ?? "N/A"} hrs/week
      </p>

      <div>
        <p className="font-semibold">Skills:</p>
        <ul className="list-disc list-inside text-gray-700">
          {profile.skills.length ? (
            profile.skills.map((s, i) => <li key={i}>{s}</li>)
          ) : (
            <li>No skills added</li>
          )}
        </ul>
      </div>

      <div>
        <p className="font-semibold">Learning:</p>
        <ul className="list-disc list-inside text-gray-700">
          {profile.learning.length ? (
            profile.learning.map((l, i) => <li key={i}>{l}</li>)
          ) : (
            <li>No items</li>
          )}
        </ul>
      </div>

      <div>
        <p className="font-semibold">Goals:</p>
        <ul className="list-disc list-inside text-gray-700">
          {profile.goals.length ? (
            profile.goals.map((g, i) => <li key={i}>{g}</li>)
          ) : (
            <li>No goals set</li>
          )}
        </ul>
      </div>
    </div>
  );
}
