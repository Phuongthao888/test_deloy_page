"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EventsPage from "../events/page";
import MusicListPage from "../music-releases/page";
import YouTubeStats_admin from "../../components/YoutubeStats/index";
import SpotifyStats_admin from "../../components/Spotify";
import { authService } from "@/services/auth.services";
import { setAccessToken } from "@/core/axios";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Gọi refresh để xác thực cookie HTTP-only
        const res = await authService.refresh();
        const newToken =
          res?.data?.accessToken ||
          res?.accessToken ||
          res?.data?.data?.accessToken;

        if (newToken) {
          setAccessToken(newToken); 
          setLoading(false);
        } else {
          router.push("/auth/login");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/auth/login");
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <p>Đang kiểm tra đăng nhập...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-zinc-900 text-white flex flex-col overflow-auto">
      <main className="flex-grow w-full flex flex-col items-center justify-start gap-12">
        <EventsPage />
        <MusicListPage />
        <YouTubeStats_admin />
        <SpotifyStats_admin />
      </main>
    </div>
  );
}
