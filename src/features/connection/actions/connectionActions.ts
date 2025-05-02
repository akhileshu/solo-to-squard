"use server";

import {
  FetchResponse,
  MutateResponse,
  fetchErrorNotLoggedIn,
  fetchSuccess,
  handleFetchAction,
  handleMutateAction,
  mutateError,
  mutateErrorNotLoggedIn,
  mutateSuccess,
  parseFormData
} from "@/lib/server-actions/handleAction";
import { connectionStatusUpdateSchema, sendConnectionSchema } from "../schemas/connectionSchemas";

import { getServerUser } from "@/lib/auth/lib";
import { myPrisma } from "@/lib/db/prisma";
import { getMessage } from "@/lib/message/lib/get-message";



import {
  Connection,
  ConnectionStatus,
  User,
} from "@prisma/client";


/**
 * Sends a connection request from one user to another.
 * @param receiverId The ID of the user receiving the request.
 * @param message An optional introductory message.
 * @returns The created Connection object or null if users are invalid or request exists.
 */
export async function sendConnectionRequest(
  _: unknown,
  formData: FormData
): Promise<MutateResponse<Connection, typeof sendConnectionSchema>> {
  return handleMutateAction(async () => {
    const loggedInUser = await getServerUser();
    if (!loggedInUser) return mutateErrorNotLoggedIn;
    const senderId = loggedInUser.id;
    const { data, fieldErrors } = parseFormData(formData, sendConnectionSchema);
    if (fieldErrors)
      return mutateError(getMessage("connection", "CREATE_ERROR"), fieldErrors);

    const { receiverId, message } = data;

    if (senderId === receiverId)
      return mutateError(getMessage("connection", "CREATE_ERROR"));

    const sender = await myPrisma.user.findUnique({ where: { id: senderId } });
    const receiver = await myPrisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!sender || !receiver)
      mutateError(getMessage("connection", "CREATE_ERROR"));

    const existingConnection = await myPrisma.connection.findFirst({
      where: {
        OR: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId }, // Check both directions
        ],
      },
    });

    if (existingConnection)
      return mutateError(getMessage("connection", "CREATE_ERROR"));
    const newConnection = await myPrisma.connection.create({
      data: {
        senderId: senderId,
        receiverId: receiverId,
        message: message,
        status: ConnectionStatus.PENDING,
      },
    });
    return mutateSuccess(
      getMessage("connection", "CREATE_SUCCESS"),
      newConnection
    );
  });
}


/**
 * Updates the status of an existing connection request (Accept or Decline).
 * @param connectionId The ID of the connection to update.
 * @param newStatus The new status (ACCEPTED or DECLINED).
 * @returns The updated Connection object or null if invalid.
 */
export async function updateConnectionStatus(
  _: unknown,
  formData: FormData
): Promise<MutateResponse<Connection, typeof connectionStatusUpdateSchema>> {
  return handleMutateAction(async () => {
    const loggedInUser = await getServerUser();
    if (!loggedInUser) return mutateErrorNotLoggedIn;
    const { data, fieldErrors } = parseFormData(
      formData,
      connectionStatusUpdateSchema
    );
    if (fieldErrors)
      return mutateError(
        getMessage("connection", "UPDATE_STATUS_ERROR"),
        fieldErrors
      );
    const { connectionId, newStatus } = data;
    const connection = await myPrisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection)
      return mutateError(
        getMessage("connection", "UPDATE_STATUS_ERROR"),
        fieldErrors
      );

    // Ensure the user performing the action is the receiver of the request
    if (connection.receiverId !== loggedInUser.id) return mutateError(
        getMessage("connection", "UPDATE_STATUS_ERROR"),
        fieldErrors
      );

    // Ensure the connection is currently PENDING
    if (connection.status !== ConnectionStatus.PENDING) return mutateError(
      getMessage("connection", "UPDATE_STATUS_ERROR"),
      fieldErrors
    );

    const updatedConnection = await myPrisma.connection.update({
      where: { id: connectionId },
      data: {
        status: newStatus as ConnectionStatus,
      },
    });
    return mutateSuccess(
      getMessage("connection", "UPDATE_STATUS_SUCCESS"),
      updatedConnection
    );
  });
}

/**
 * Gets all pending connection requests received by a user.
 * @returns A promise resolving to an array of pending Connection objects including sender info.
 */
export async function getPendingReceivedRequests(): Promise<
  FetchResponse<
    (Connection & { sender: Pick<User, "id" | "name" | "image"> })[]
  >
> {
  return handleFetchAction(async () => {
    const user = await getServerUser();
    if (!user) return fetchErrorNotLoggedIn;
    const requests = await myPrisma.connection.findMany({
      where: {
        receiverId: user.id,
        status: ConnectionStatus.PENDING,
      },
      include: {
        sender: {
          // Include basic info about the sender
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    return fetchSuccess(requests);
  });
}

/**
 * Gets all accepted connections for a user (where status is ACCEPTED, regardless of sender/receiver).
 * @returns A promise resolving to an array of User profiles they are connected with.
 */
export async function getAcceptedConnections(): Promise<
  FetchResponse<Pick<User, "id" | "name" | "image" | "domain" | "skills">[]>
> {
  return handleFetchAction(async () => {
    const user = await getServerUser();
    if (!user) return fetchErrorNotLoggedIn;
    const connections = await myPrisma.connection.findMany({
      where: {
        status: ConnectionStatus.ACCEPTED,
        OR: [{ receiverId: user.id }, { senderId: user.id }],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            domain: true,
            skills: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true,
            domain: true,
            skills: true,
          },
        },
      },
    });

    // Extract the profile of the *other* user in each connection
    const connectedUsers = connections.map((conn) => {
      return conn.senderId === user.id ? conn.receiver : conn.sender;
    });

    // Remove potential duplicates if any edge case allows it (though unique constraint should prevent)
    const uniqueUsers = Array.from(
      new Map(connectedUsers.map((user) => [user.id, user])).values()
    );

    return fetchSuccess(uniqueUsers);
  });
}

/*
export async function getConnections(): Promise<FetchResponse<unknown>> {
  return handleFetchAction(async () => {
    const connections = await myPrisma.connection.findMany();
    return fetchSuccess(connections);
  });
}

export async function getConnectionById(id: string): Promise<FetchResponse<unknown>> {
  return handleFetchAction(async () => {
    const connection = await myPrisma.connection.findUnique({
      where: { id },
    });
    return fetchSuccess(connection);
  });
}

export async function createConnection(_: unknown, formData: FormData): Promise<MutateResponse<undefined, typeof connectionCreateSchema>> {
  return handleMutateAction(async () => {
    const user = await getServerUser();
    if (!user) return mutateErrorNotLoggedIn;

    const { data, fieldErrors } = parseFormData(formData, connectionCreateSchema);
    if (fieldErrors) return mutateError(getMessage("connection", "CREATE_ERROR"), fieldErrors);

    await myPrisma.connection.create({ data: { ...data, userId: user.id } });
    return mutateSuccess(getMessage("connection", "CREATE_SUCCESS"));
  });
}

export async function updateConnection(_: unknown, formData: FormData): Promise<MutateResponse<undefined, typeof connectionUpdateSchema>>  {
  return handleMutateAction(async () => {
    const user = await getServerUser();
    if (!user) return mutateErrorNotLoggedIn;

    const { data, fieldErrors } = parseFormData(formData, connectionUpdateSchema);
    if (fieldErrors) return mutateError(getMessage("connection", "UPDATE_ERROR"), fieldErrors);

    await myPrisma.connection.update({ where: { id: data.id, userId: user.id }, data });
    return mutateSuccess(getMessage("connection", "UPDATE_SUCCESS"));
  });
}

export async function deleteConnection(_: unknown, formData: FormData): Promise<MutateResponse<undefined, typeof connectionDeleteSchema>> {
  return handleMutateAction(async () => {
    const user = await getServerUser();
    if (!user) return mutateErrorNotLoggedIn;

    const { data, fieldErrors } = parseFormData(formData, connectionDeleteSchema);
    if (fieldErrors) return mutateError(getMessage("connection", "DELETE_ERROR"), fieldErrors);

    await myPrisma.connection.delete({ where: { id: data.id, userId: user.id } });
    return mutateSuccess(getMessage("connection", "DELETE_SUCCESS"));
  });
}

*/