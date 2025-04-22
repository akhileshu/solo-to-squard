// src/app/(with-layout)/profile/edit/page.tsx
import { PrismaClient, Domain } from "@prisma/client";
import { ProfileForm } from "./_components/ProfileForm";
import { redirect } from "next/navigation"; // For redirecting if not logged in
import { getServerUser } from "@/lib/auth/lib";

const prisma = new PrismaClient();

export default async function EditProfilePage() {

  const userSession = await getServerUser()

  if (!userSession?.id) {
    // Redirect to login if user is not found
    redirect("/api/auth/signin"); // Adjust to your login page URL
  }

  // Fetch the full user profile from DB including the fields we need
  const userProfile = await prisma.user.findUnique({
    where: { id: userSession.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      domain: true,
      skills: true,
      learning: true,
      goals: true,
      availability: true,
    },
  });

  if (!userProfile) {
    // This case is unlikely if userSession.id exists, but handle defensively
    return <div>Error: User profile not found.</div>;
  }

  // Get Domain enum values to pass to the form select dropdown
  const domains = Object.values(Domain);

  return (
    <div>
      <h1>Edit Profile</h1>
      <ProfileForm user={userProfile} domains={domains} />
    </div>
  );
}
