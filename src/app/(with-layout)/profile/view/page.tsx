import { getLoggedInUserProfile } from "@/features/profile/actions/profileActions";
import { ViewOrEditProfile } from "@/features/profile/components/ViewOrEditProfile";

export default async function SetupProfile() {
  const profileResult = await getLoggedInUserProfile();
  return <ViewOrEditProfile profileResult={profileResult} />;
}
