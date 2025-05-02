export default async function Page({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  if (type === "sent") {
    return (
      <p>
        view all pending sent requests
      </p>
    );
  } else if (type === "received") {
    return <p>view all pending received requests</p>;
  }
}
