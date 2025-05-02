"use server";
import {
  FetchResponse,
  MutateResponse,
  fetchError,
  fetchErrorNotLoggedIn,
  fetchSuccess,
  handleFetchAction,
  handleMutateAction,
  mutateError,
  mutateErrorNotLoggedIn,
  mutateSuccess,
  parseFormData,
} from "@/lib/server-actions/handleAction";
import {
  profileSetupSchema,
  profileUpdateSchema,
} from "../schemas/profileSchemas";

import { getServerUser } from "@/lib/auth/lib";
import { myPrisma } from "@/lib/db/prisma";
import { getMessage } from "@/lib/message/lib/get-message";
import { Domain, User } from "@prisma/client";

export async function getProfiles(): Promise<FetchResponse<User[]>> {
  return handleFetchAction(async () => {
    const profiles = await myPrisma.user.findMany();
    return fetchSuccess(profiles);
  });
}

export async function getProfileById(id: string): Promise<FetchResponse<User>> {
  return handleFetchAction(async () => {
    const profile = await myPrisma.user.findUnique({
      where: { id },
    });
    if (!profile) return fetchError(getMessage("profile", "NOT_FOUND"));
    return fetchSuccess(profile);
  });
}

export async function getLoggedInUserProfile(
): Promise<FetchResponse<User>> {
  return handleFetchAction(async () => {
     const user = await getServerUser();
     if (!user) return fetchErrorNotLoggedIn;
    const profile = await myPrisma.user.findUnique({
      where: { id:user.id },
    });
    if (!profile) return fetchError(getMessage("profile", "NOT_FOUND"));
    return fetchSuccess(profile);
  });
}


export async function setupProfile(
  _: unknown,
  formData: FormData
): Promise<MutateResponse<undefined, typeof profileSetupSchema>> {
  return handleMutateAction(async () => {
    const user = await getServerUser();
    if (!user) return mutateErrorNotLoggedIn;

    //todo : ignore these kinds of ts error for parseformdata function
    // @ts-expect-error for parseFormData()args
    const { data, fieldErrors } = parseFormData(formData, profileSetupSchema);
    if (fieldErrors)
      return mutateError(getMessage("profile", "SETUP_ERROR"), fieldErrors);

    await myPrisma.user.update({
      where: {
        id: user.id,
        isProfileSetupDone: false,
      },
      data: {
        ...data,
        domain: data.domain as Domain,
        isProfileSetupDone: true,
      },
    });

    return mutateSuccess(getMessage("profile", "SETUP_SUCCESS"));
  });
}

export async function updateProfile(
  _: unknown,
  formData: FormData
): Promise<MutateResponse<undefined, typeof profileUpdateSchema>> {
  return handleMutateAction(async () => {
    const user = await getServerUser();
    if (!user) return mutateErrorNotLoggedIn;
    // @ts-expect-error for parseFormData()args
    const { data, fieldErrors } = parseFormData(formData, profileUpdateSchema);
    if (fieldErrors)
      return mutateError(getMessage("profile", "UPDATE_ERROR"), fieldErrors);

    await myPrisma.user.update({
      where: {
        id: user.id,
        isProfileSetupDone: true,
      },
      data: {
        ...data,
        domain: data.domain as Domain,
        isProfileSetupDone: true,
      },
    });
    return mutateSuccess(getMessage("profile", "UPDATE_SUCCESS"));
  });
}

