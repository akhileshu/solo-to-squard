import { PropsWithChildren } from "react";
import Navbar from "./_components/navbar";
import { getServerUser } from "@/lib/auth/lib";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";import { headers } from "next/headers";

async function setupProfileIfRequired() {
  try {
    const user = await getServerUser();
    if (!user) throw new Error("not logged in");
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!userProfile) return;
    const pathname = (await headers()).get("x-pathname") || "";
    const isProfileIncomplete =
      !userProfile.availability ||
      !userProfile.domain ||
      !userProfile.goals.length ||
      !userProfile.learning.length ||
      !userProfile.skills.length;

    if (isProfileIncomplete && pathname !== "/profile/setup") {
      redirect("/profile/setup");
    }
  } catch (error) {
    throw error;
  }
}

export default async function WithLayout({ children }: PropsWithChildren) {
  // await setupProfileIfRequired();
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
