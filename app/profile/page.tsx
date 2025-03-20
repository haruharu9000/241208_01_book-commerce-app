import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../lib/next-auth/options";
import { redirect } from "next/navigation";
import ProfileEditor from "../components/ProfileEditor";

export default async function ProfilePage() {
  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">プロフィール設定</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ProfileEditor />
      </div>
    </div>
  );
}
