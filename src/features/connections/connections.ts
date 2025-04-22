import {
  PrismaClient,
  Connection,
  ConnectionStatus,
  User,
} from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Sends a connection request from one user to another.
 * @param senderId The ID of the user sending the request.
 * @param receiverId The ID of the user receiving the request.
 * @param message An optional introductory message.
 * @returns The created Connection object or null if users are invalid or request exists.
 */
export async function sendConnectionRequest(
  senderId: string,
  receiverId: string,
  message?: string
): Promise<Connection | null> {
  if (senderId === receiverId) {
    console.error("User cannot send a connection request to themselves.");
    return null;
  }

  try {
    // Check if sender and receiver exist (optional but good practice)
    const sender = await prisma.user.findUnique({ where: { id: senderId } });
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!sender || !receiver) {
      console.error("Sender or receiver not found.");
      return null;
    }

    // Check if a connection (in any state) already exists between them
    const existingConnection = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId }, // Check both directions
        ],
      },
    });

    if (existingConnection) {
      // Depending on desired logic, you might allow re-sending if declined,
      // or just return the existing connection. For now, we prevent duplicates.
      console.warn(
        `Connection between ${senderId} and ${receiverId} already exists with status ${existingConnection.status}.`
      );
      return existingConnection;
    }

    // Create the new connection request
    const newConnection = await prisma.connection.create({
      data: {
        senderId: senderId,
        receiverId: receiverId,
        message: message,
        status: ConnectionStatus.PENDING,
      },
    });

    return newConnection;
  } catch (error) {
    console.error("Error sending connection request:", error);
    return null; // Or throw error
  }
}

/**
 * Updates the status of an existing connection request (Accept or Decline).
 * @param connectionId The ID of the connection to update.
 * @param userId The ID of the user performing the action (must be the receiver).
 * @param newStatus The new status (ACCEPTED or DECLINED).
 * @returns The updated Connection object or null if invalid.
 */
export async function updateConnectionStatus(
  connectionId: string,
  userId: string, // The user performing the action
  newStatus: typeof ConnectionStatus.ACCEPTED | typeof ConnectionStatus.DECLINED
): Promise<Connection | null> {
  try {
    const connection = await prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      console.error("Connection not found.");
      return null;
    }

    // Ensure the user performing the action is the receiver of the request
    if (connection.receiverId !== userId) {
      console.error(
        "User is not authorized to update this connection request."
      );
      // In a real app, throw an AuthorizationError
      return null;
    }

    // Ensure the connection is currently PENDING
    if (connection.status !== ConnectionStatus.PENDING) {
      console.warn(
        `Connection ${connectionId} is already in status ${connection.status}.`
      );
      return connection; // Return the connection as is
    }

    // Update the status
    const updatedConnection = await prisma.connection.update({
      where: { id: connectionId },
      data: {
        status: newStatus,
      },
    });

    return updatedConnection;
  } catch (error) {
    console.error("Error updating connection status:", error);
    return null; // Or throw error
  }
}

/**
 * Gets all pending connection requests received by a user.
 * @param userId The ID of the user.
 * @returns A promise resolving to an array of pending Connection objects including sender info.
 */
export async function getPendingReceivedRequests(
  userId: string
): Promise<(Connection & { sender: Pick<User, "id" | "name" | "image"> })[]> {
  try {
    const requests = await prisma.connection.findMany({
      where: {
        receiverId: userId,
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
    return requests;
  } catch (error) {
    console.error("Error fetching pending received requests:", error);
    return [];
  }
}

/**
 * Gets all accepted connections for a user (where status is ACCEPTED, regardless of sender/receiver).
 * @param userId The ID of the user.
 * @returns A promise resolving to an array of User profiles they are connected with.
 */
export async function getAcceptedConnections(
  userId: string
): Promise<Pick<User, "id" | "name" | "image" | "domain" | "skills">[]> {
  try {
    const connections = await prisma.connection.findMany({
      where: {
        status: ConnectionStatus.ACCEPTED,
        OR: [{ receiverId: userId }, { senderId: userId }],
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
      return conn.senderId === userId ? conn.receiver : conn.sender;
    });

    // Remove potential duplicates if any edge case allows it (though unique constraint should prevent)
    const uniqueUsers = Array.from(
      new Map(connectedUsers.map((user) => [user.id, user])).values()
    );

    return uniqueUsers;
  } catch (error) {
    console.error("Error fetching accepted connections:", error);
    return [];
  }
}

// Example Usage (demonstrates how you might call it - requires async context)
/*
async function connectionWorkflowExample() {
    const userA_ID = 'USER_A_ID_HERE'; // Replace with actual ID
    const userB_ID = 'USER_B_ID_HERE'; // Replace with actual ID

    if (!userA_ID || !userB_ID) {
        console.log("Please replace USER_A_ID_HERE and USER_B_ID_HERE");
        return;
    }

    console.log(`
--- Sending request from ${userA_ID} to ${userB_ID} ---`);
    const request = await sendConnectionRequest(userA_ID, userB_ID, "Hey, let's connect!");
    if (request) {
        console.log("Request sent:", request.id, request.status);

        console.log(`
--- User ${userB_ID} checking pending requests ---`);
        const pending = await getPendingReceivedRequests(userB_ID);
        console.log(`Pending requests for ${userB_ID}:`, pending.length);
        if (pending.length > 0) {
             console.log(`First request from: ${pending[0].sender.name} (${pending[0].sender.id})`);

             console.log(`
--- User ${userB_ID} accepts request ${pending[0].id} ---`);
             const accepted = await updateConnectionStatus(pending[0].id, userB_ID, ConnectionStatus.ACCEPTED);
             console.log("Request accepted:", accepted?.status);

             console.log(`
--- User ${userA_ID} checking accepted connections ---`);
             const connectionsA = await getAcceptedConnections(userA_ID);
             console.log(`Accepted connections for ${userA_ID}:`, connectionsA.map(u => u.name));

             console.log(`
--- User ${userB_ID} checking accepted connections ---`);
             const connectionsB = await getAcceptedConnections(userB_ID);
             console.log(`Accepted connections for ${userB_ID}:`, connectionsB.map(u => u.name));
        }

    } else {
         console.log("Failed to send request (maybe already exists or invalid IDs?)");
    }


}

connectionWorkflowExample().catch(console.error);
*/
