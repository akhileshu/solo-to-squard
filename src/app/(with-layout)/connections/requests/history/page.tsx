export default async function Page({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  
    return (
      <p>
        Purpose: Timeline of all request activity What to show: Sent requests
        with status: pending | approved | rejected Received requests with same
        status Extra: You can sort/filter by type and status.
      </p>
    );
  
}
