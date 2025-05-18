"use server";

import {   FetchResponse,
  MutateResponse,
  fetchError,
  fetchErrorNotLoggedIn,
  fetchSuccess,
  handleFetchAction,
  handleMutateAction,
  mutateError,
  mutateErrorNotLoggedIn,
  mutateSuccess,
  parseFormData,  } from "@/lib/server-actions/handleAction";
import { videoCreateSchema, videoUpdateSchema, videoDeleteSchema } from "../schemas/videoSchemas";

import { getServerUser } from "@/lib/auth/lib";
import { myPrisma } from "@/lib/db/prisma";
import { getMessage } from "@/lib/message/lib/get-message";


import {
  checkLimit,
  incrementLimit,
} from "../../../lib/limit-db-writes/limitHandler";

export async function getVideos(): Promise<FetchResponse<unknown>> {
  return handleFetchAction(async () => {
    const videos = await myPrisma.video.findMany();
    return fetchSuccess(videos);
  });
}

export async function getVideoById(id: string): Promise<FetchResponse<unknown>> {
  return handleFetchAction(async () => {
    const video = await myPrisma.video.findUnique({
      where: { id },
    });
    return fetchSuccess(video);
  });
}

export async function createVideo(_: unknown, formData: FormData): Promise<MutateResponse<undefined, typeof videoCreateSchema>> {
  return handleMutateAction(async () => {
    const user = await getServerUser();
    if (!user) return mutateErrorNotLoggedIn;

    const { data, fieldErrors } = parseFormData(formData, videoCreateSchema);
    if (fieldErrors) return mutateError(getMessage("video", "CREATE_ERROR"), fieldErrors);

    await myPrisma.video.create({ data: { ...data, userId: user.id } });
    return mutateSuccess(getMessage("video", "CREATE_SUCCESS"));
  });
}

export async function updateVideo(_: unknown, formData: FormData): Promise<MutateResponse<undefined, typeof videoUpdateSchema>>  {
  return handleMutateAction(async () => {
    const user = await getServerUser();
    if (!user) return mutateErrorNotLoggedIn;

    const { data, fieldErrors } = parseFormData(formData, videoUpdateSchema);
    if (fieldErrors) return mutateError(getMessage("video", "UPDATE_ERROR"), fieldErrors);

    await myPrisma.video.update({ where: { id: data.id, userId: user.id }, data });
    return mutateSuccess(getMessage("video", "UPDATE_SUCCESS"));
  });
}

export async function deleteVideo(_: unknown, formData: FormData): Promise<MutateResponse<undefined, typeof videoDeleteSchema>> {
  return handleMutateAction(async () => {
    const user = await getServerUser();
    if (!user) return mutateErrorNotLoggedIn;

    const { data, fieldErrors } = parseFormData(formData, videoDeleteSchema);
    if (fieldErrors) return mutateError(getMessage("video", "DELETE_ERROR"), fieldErrors);

    await myPrisma.video.delete({ where: { id: data.id, userId: user.id } });
    return mutateSuccess(getMessage("video", "DELETE_SUCCESS"));
  });
}
