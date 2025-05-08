import { getConnectionRequests } from "@/features/connection/actions/connectionActions";
import { ConnectionRequestsPage } from "@/features/connection/components/ConnectionRequests";
import { FetchConnReqSearchParams } from "@/features/connection/types";

const mockConnectionRequests = {
  ok: true,
  data: [
    {
      id: "req-1",
      senderId: "user-1",
      receiverId: "user-2",
      message: "Hey! Let's connect.",
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
      sender: {
        id: "user-1",
        name: "Alice Johnson",
        image: "https://i.pravatar.cc/100?img=1",
      },
      receiver: {
        id: "user-2",
        name: "Bob Smith",
        image: "https://i.pravatar.cc/100?img=2",
      },
    },
    {
      id: "req-2",
      senderId: "user-3",
      receiverId: "user-2",
      message: "Would love to collaborate!",
      status: "ACCEPTED",
      createdAt: new Date(),
      updatedAt: new Date(),
      sender: {
        id: "user-3",
        name: "Charlie Brown",
        image: "https://i.pravatar.cc/100?img=3",
      },
      receiver: {
        id: "user-2",
        name: "Bob Smith",
        image: "https://i.pravatar.cc/100?img=2",
      },
    },
    {
      id: "req-3",
      senderId: "user-2",
      receiverId: "user-4",
      message: null,
      status: "DECLINED",
      createdAt: new Date(),
      updatedAt: new Date(),
      sender: {
        id: "user-2",
        name: "Bob Smith",
        image: "https://i.pravatar.cc/100?img=2",
      },
      receiver: {
        id: "user-4",
        name: "Diana Prince",
        image: "https://i.pravatar.cc/100?img=4",
      },
    },
  ],
  message: "Success",
};


export default async function Page(props: {
  searchParams: Promise<FetchConnReqSearchParams>;
}) {
  const searchParams = await props.searchParams;
  const requestsResult = await getConnectionRequests(searchParams);
  return (
    <ConnectionRequestsPage
      requestsResult={requestsResult}
      // requestsResult={{
      //   ...requestsResult,
      //   data: [...requestsResult.data, ...mockConnectionRequests.data],
      // }}
    />
  );
}
