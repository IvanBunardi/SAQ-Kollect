import UserProfile from "./userprofile";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <UserProfile username={username} />;
}
