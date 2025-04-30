"use client";

import { useState, useActionState } from "react";
import { initialState } from "@/lib/server-actions/handleAction";
import AppForm from "@/lib/forms-inputs/form";
import { Input } from "@/lib/forms-inputs/Input";
import { FieldError } from "@/lib/forms-inputs/FieldError";
import SubmitButton from "@/lib/forms-inputs/SubmitButton";
import { createProfile, updateProfile } from "../actions/profileActions";
import { useHandleFormState } from "@/lib/forms-inputs/useHandleFormState";
import { ButtonState } from "@/lib/forms-inputs/button";

interface Props {
  profile?: any;
}

export default function CreateOrEditProfileForm({ profile }: Props) {
  const isEdit = !!profile;
  const [title, setTitle] = useState(profile?.title ?? "");
  const [content, setContent] = useState(profile?.content ?? "");

  const actionFn = isEdit ? updateProfile : createProfile;
  const [state, formAction, isPending] = useActionState(actionFn, initialState);

  const { fieldErrors } = state ?? {};

  useHandleFormState({
    state,
    revalidatePath: "/dashboard",
    navigateTo: "/dashboard",
  });

  const getButtonState = (): ButtonState => ({
    disabled: isPending || !title || !content,
    tooltip: !title ? "Title required" : !content ? "Content required" : "",
  });

  return (
    <AppForm submitVariant="custom" action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={ profile?.id ?? ""} />
      <Input
        required
        type="text"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
      />
      <FieldError errors={fieldErrors?.title} />

      <Input
        required
        type="text"
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter content"
      />
      <FieldError errors={fieldErrors?.content} />

      <SubmitButton
        {...getButtonState()}
        text={isEdit ? "Update" : "Save"}
        pendingText={isEdit ? "Updating..." : "Saving..."
        }
        isPending={isPending}
      />
    </AppForm>
  );
}
