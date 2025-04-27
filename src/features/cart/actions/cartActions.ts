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
import { cartCreateSchema, cartUpdateSchema, cartDeleteSchema } from "../schemas/cartSchemas";

import { getServerUser } from "@/lib/auth/lib";
import { myPrisma } from "@/lib/db/prisma";
import { getMessage } from "@/lib/message/lib/get-message";


import {
  checkLimit,
  incrementLimit,
} from "../../../lib/limit-db-writes/limitHandler";

export async function getCarts(): Promise<FetchResponse<unknown>> {
  return handleFetchAction(async () => {
    const carts = await myPrisma.cart.findMany();
    return fetchSuccess(carts);
  });
}

export async function getCartById(id: string): Promise<FetchResponse<unknown>> {
  return handleFetchAction(async () => {
    const cart = await myPrisma.cart.findUnique({
      where: { id },
    });
    return fetchSuccess(cart);
  });
}

export async function createCart(_: unknown, formData: FormData): Promise<MutateResponse<undefined, typeof cartCreateSchema>> {
  return handleMutateAction(async () => {
    const user = await getServerUser();
    if (!user) return mutateErrorNotLoggedIn;

    const { data, fieldErrors } = parseFormData(formData, cartCreateSchema);
    if (fieldErrors) return mutateError(getMessage("cart", "CREATE_ERROR"), fieldErrors);

    await myPrisma.cart.create({ data: { ...data, userId: user.id } });
    return mutateSuccess(getMessage("cart", "CREATE_SUCCESS"));
  });
}

export async function updateCart(_: unknown, formData: FormData): Promise<MutateResponse<undefined, typeof cartUpdateSchema>>  {
  return handleMutateAction(async () => {
    const user = await getServerUser();
    if (!user) return mutateErrorNotLoggedIn;

    const { data, fieldErrors } = parseFormData(formData, cartUpdateSchema);
    if (fieldErrors) return mutateError(getMessage("cart", "UPDATE_ERROR"), fieldErrors);

    await myPrisma.cart.update({ where: { id: data.id, userId: user.id }, data });
    return mutateSuccess(getMessage("cart", "UPDATE_SUCCESS"));
  });
}

export async function deleteCart(_: unknown, formData: FormData): Promise<MutateResponse<undefined, typeof cartDeleteSchema>> {
  return handleMutateAction(async () => {
    const user = await getServerUser();
    if (!user) return mutateErrorNotLoggedIn;

    const { data, fieldErrors } = parseFormData(formData, cartDeleteSchema);
    if (fieldErrors) return mutateError(getMessage("cart", "DELETE_ERROR"), fieldErrors);

    await myPrisma.cart.delete({ where: { id: data.id, userId: user.id } });
    return mutateSuccess(getMessage("cart", "DELETE_SUCCESS"));
  });
}
