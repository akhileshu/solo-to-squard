

export default async function Page() {
  return (
    <p>
      Purpose: System-wide alerts (read once → removed) Examples: “John accepted
      your connection request.” “Sara declined your connection request.”
      Behavior: Clicking a notification can redirect to /connections/history or
      profile. Mark as read removes it (or moves it to an archive if needed
      later).
    </p>
  );
}
