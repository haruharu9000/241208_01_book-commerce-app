"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function ProfileEditor() {
  const { data: session, update } = useSession();
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    try {
      setIsUploading(true);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("アップロードに失敗しました");
      }

      const data = await response.json();

      // セッションの更新
      await update({
        ...session,
        user: {
          ...session?.user,
          image: data.url,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("画像のアップロードに失敗しました。");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Image
          src={session?.user?.image || "/default-avatar.png"}
          alt="プロフィール"
          width={100}
          height={100}
          className="rounded-full"
        />
        <div>
          <label className="block">
            <span className="sr-only">プロフィール画像を選択</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </label>
          {isUploading && (
            <p className="text-sm text-gray-500">アップロード中...</p>
          )}
        </div>
      </div>
    </div>
  );
}
